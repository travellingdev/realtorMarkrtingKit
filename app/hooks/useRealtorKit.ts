'use client';
import { useMemo, useState, useEffect } from 'react';
import { useUser } from '@/app/providers/UserProvider';
import { buildPayloadFromForm } from '@/lib/payloadBuilder';
import { saveIntent } from '@/lib/intent';
import { BASE_FREE_LIMIT } from '@/lib/constants';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { uploadPhotos } from '@/lib/uploadPhotos';

function computeFreeLimit(base: number, extraUnlocked: boolean) {
  return base + (extraUnlocked ? 1 : 0);
}

export function useRealtorKit() {
  // --- Auth & gating state ---
  const { user, quota, refresh } = useUser();
  const isLoggedIn = !!user;
  const [showAuth, setShowAuth] = useState(false);
  const [extraUnlocked, setExtraUnlocked] = useState(false);
  const [freeKitsUsed, setFreeKitsUsed] = useState(0);

  useEffect(() => {
    if (quota) {
      setFreeKitsUsed(Number(quota.used || 0));
      setExtraUnlocked(Boolean(quota.extraUnlocked));
    }
  }, [quota]);

  const freeLimit = computeFreeLimit(BASE_FREE_LIMIT, extraUnlocked);

  // --- Form state ---
  const [address, setAddress] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [features, setFeatures] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [propertyType, setPropertyType] = useState("Starter Home");
  const [tone, setTone] = useState("Warm & Lifestyle");
  const [brandVoice, setBrandVoice] = useState("");
  const [channels, setChannels] = useState<string[]>(['mls', 'instagram', 'reel', 'email']);
  const [openHouseDate, setOpenHouseDate] = useState("");
  const [openHouseTime, setOpenHouseTime] = useState("");
  const [openHouseLink, setOpenHouseLink] = useState("");
  const [ctaType, setCtaType] = useState("");
  const [ctaPhone, setCtaPhone] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [ctaCustom, setCtaCustom] = useState("");
  const [socialHandle, setSocialHandle] = useState("");
  const [hashtagStrategy, setHashtagStrategy] = useState("");
  const [extraHashtags, setExtraHashtags] = useState("");
  const [readingLevel, setReadingLevel] = useState("");
  const [useEmojis, setUseEmojis] = useState(false);
  const [mlsFormat, setMlsFormat] = useState("paragraph");
  const [mustInclude, setMustInclude] = useState("");
  const [avoidWords, setAvoidWords] = useState("");

  // --- Output state ---
  const [generated, setGenerated] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copyToast, setCopyToast] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [serverOutputs, setServerOutputs] = useState<any>(null);
  const [kitStatus, setKitStatus] = useState<null | 'PROCESSING' | 'READY' | 'FAILED'>(null);

  // current kit metadata
  const [kitId, setKitId] = useState(0);
  const [kitSample, setKitSample] = useState(false);
  const [kitConsumed, setKitConsumed] = useState(false);

  // Helpers
  const toFeatureList = useMemo(() => features.split(",").map((f) => f.trim()).filter(Boolean), [features]);
  const nearby = neighborhood ? `${neighborhood}` : "the area";

  const onGenerate = async () => {
    if (!isLoggedIn) {
      saveIntent({ action: 'generate' });
      setShowAuth(true);
      return;
    }
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      console.log('[useRealtorKit] onGenerate begin');
      let photoUrls: string[] = [];
      try {
        if (photos.length) {
          const sb = supabaseBrowser();
          photoUrls = await uploadPhotos(sb, photos, user.id);
        }
      } catch (err) {
        console.warn('[useRealtorKit] photo upload failed', err);
      }
      const { payload, controls } = buildPayloadFromForm({
        address,
        beds,
        baths,
        sqft,
        neighborhood,
        features,
        photos: photoUrls,
        propertyType,
        tone,
        brandVoice,
        channels,
        openHouseDate,
        openHouseTime,
        openHouseLink,
        ctaType,
        ctaPhone,
        ctaLink,
        ctaCustom,
        socialHandle,
        hashtagStrategy,
        extraHashtags,
        readingLevel,
        useEmojis,
        mlsFormat,
        mustInclude,
        avoidWords,
      });
      console.log('[useRealtorKit] payload', {
        hasAddress: Boolean(address), hasBeds: Boolean(beds), hasBaths: Boolean(baths), hasSqft: Boolean(sqft), hasNeighborhood: Boolean(neighborhood),
        featuresCount: features.split(',').filter(Boolean).length,
        propertyType, tone,
      });
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, controls }),
      });
      if (!res.ok) {
        console.warn('[useRealtorKit] /api/generate failed', { status: res.status });
        setCopyToast('Failed to generate. Please try again.');
        setTimeout(() => setCopyToast(''), 1600);
        setKitStatus('FAILED');
        return;
      }
      const data = await res.json().catch(() => null);
      console.log('[useRealtorKit] /api/generate ok', { kitId: data?.kitId });
      if (data?.kitId) setKitId(data.kitId);
      setKitSample(false);
      setKitConsumed(false);
      setGenerated(true);
      setRevealed(false);
      setServerOutputs(null);
      setKitStatus('PROCESSING');
      if (data?.kitId) {
        const start = Date.now();
        const poll = async () => {
          try {
            const r = await fetch(`/api/kits/${data.kitId}`);
            if (r.ok) {
              const j = await r.json();
              if (j?.status === 'READY' && j.outputs) {
                setServerOutputs(j.outputs);
                setKitStatus('READY');
                console.log('[useRealtorKit] kit ready', { ms: Date.now() - start });
                return;
              }
              if (j?.status === 'FAILED') {
                setKitStatus('FAILED');
                setCopyToast('Generation failed. Please try again.');
                setTimeout(() => setCopyToast(''), 2000);
                console.warn('[useRealtorKit] kit failed');
                return;
              }
            }
          } catch (_) {
            console.warn('[useRealtorKit] poll error');
          }
          if (Date.now() - start < 30000) {
            setTimeout(poll, 1000);
          } else {
            setKitStatus('FAILED');
            setCopyToast('Generation timed out. Please try again.');
            setTimeout(() => setCopyToast(''), 2000);
            console.warn('[useRealtorKit] poll timeout');
          }
        };
        poll();
      }
      const el = document.getElementById('outputs');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.warn('[useRealtorKit] onGenerate error', err);
      setCopyToast('Unexpected error. Please try again.');
      setTimeout(() => setCopyToast(''), 1600);
      setKitStatus('FAILED');
    } finally {
      setIsGenerating(false);
    }
  };

  const useSample = () => {
    setAddress("1420 Brookfield Ave");
    setBeds("3");
    setBaths("2");
    setSqft("1850");
    setNeighborhood("Brookfield");
    setFeatures("Chef's kitchen, Wide-plank oak floors, EV-ready garage, South-facing light, Fenced yard, New roof 2023");
    setPropertyType("Starter Home");
    setTone("Warm & Lifestyle");
    setBrandVoice("Friendly, confident, zero fluff. Short sentences.");
    setKitId((k) => k + 1);
    setKitSample(true);
    setKitConsumed(true);
    setGenerated(true);
    setRevealed(true);
    const el = document.getElementById("outputs");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReveal = async () => {
    if (revealed) return;
    if (kitSample) {
      setRevealed(true);
      return;
    }
    if (!isLoggedIn) {
      saveIntent({ action: 'reveal' });
      setShowAuth(true);
      return;
    }
    if (kitConsumed) {
      setRevealed(true);
      return;
    }
    try {
      console.log('[useRealtorKit] reveal begin');
      const res = await fetch('/api/reveal', { method: 'POST' });
      if (res.status === 401) {
        console.warn('[useRealtorKit] reveal unauthorized');
        setShowAuth(true);
        setCopyToast('Please sign in to reveal results.');
        setTimeout(() => setCopyToast(''), 2000);
        return;
      }
      if (res.status === 402) {
        const data = await res.json().catch(() => null);
        console.warn('[useRealtorKit] reveal paywall', { used: data?.used, limit: data?.limit });
        setCopyToast('Free quota reached. Upgrade to reveal more.');
        setTimeout(() => setCopyToast(''), 2000);
        // setShowPaywall(true); // This state is not in the hook
        return;
      }
      if (!res.ok) {
        console.warn('[useRealtorKit] reveal failed', { status: res.status });
        setCopyToast('Failed to reveal results. Please try again.');
        setTimeout(() => setCopyToast(''), 2000);
        // setShowPaywall(true);
        return;
      }
      const data = await res.json().catch(() => null);
      console.log('[useRealtorKit] reveal ok', { used: data?.used, limit: data?.limit });
      if (data && typeof data.used === 'number') setFreeKitsUsed(data.used);
      setKitConsumed(true);
      setRevealed(true);
    } catch (err) {
      console.warn('[useRealtorKit] reveal error', err);
      setCopyToast('Unexpected error revealing results.');
      setTimeout(() => setCopyToast(''), 2000);
      // setShowPaywall(true);
    }
  };

  const sampleOutputs = useMemo(() => {
    if (!generated) return null;
    const addr = address || "(address withheld)";
    const featLine = toFeatureList.length ? `Highlights: ${toFeatureList.slice(0, 6).join(" • ")}. ` : "";
    const baseDesc = `Sun-filled ${beds || "?"}-bed, ${baths || "?"}-bath${sqft ? `, ${sqft} sq ft` : ""} near ${nearby}. ${featLine}Moments to parks, cafés, and daily conveniences in ${nearby}. Newer systems and easy parking.`;
    const styledDesc = `${baseDesc} ${brandVoice ? `\n\nIn your voice: ${brandVoice}` : ""}`;
    const igSlides = [
      `Just Listed${nearby ? ` in ${nearby}` : ""} 🏡`,
      `${beds || "?"} Bed • ${baths || "?"} Bath${sqft ? ` • ${sqft} sq ft` : ""}`,
      toFeatureList.length ? `Why it's special: ${toFeatureList.slice(0, 3).join(", ")}` : `Why it's special: light, flow, and location`,
      `Open house: Sat 11–1 • ${addr}`,
      `DM "TOUR" for details`,
    ];
    const reelScript = [
      {
        shot: 'Front exterior with quick zoom-in',
        text: 'If natural light matters to you, watch this.',
        voice: 'If natural light matters to you, watch this.',
      },
      {
        shot: 'Pan through living area and kitchen',
        text: `${beds || "?"} bd/${baths || "?"} ba${sqft ? `, ${sqft} sq ft` : ""}; ${toFeatureList[0] || "flex layout"}`,
        voice: `${beds || "?"} bedrooms, ${baths || "?"} baths${sqft ? `, ${sqft} square feet` : ""}; ${toFeatureList[0] || "flex layout"}`,
      },
      {
        shot: 'Street view with agent waving',
        text: `Open house Sat 11–1 at ${addr}`,
        voice: `Open house Saturday 11 to 1 at ${addr}. Comment "TOUR" for details`,
      },
    ];
    const emailSubject = `Open House ${nearby ? `• ${nearby} ` : ""}${beds || "?"}BR`;
    const emailBody = `Hi there,\n\nWe're opening the doors at ${addr}. Quick look:\n\n• ${beds || "?"} bed / ${baths || "?"} bath${sqft ? ` • ${sqft} sq ft` : ""}\n• ${toFeatureList.length ? toFeatureList.slice(0, 4).join("\n• ") : "Bright, functional, great location"}\n• Near ${nearby} amenities\n\nOpen House: Sat 11–1\nReply to RSVP or request the full photo tour.\n\nBest,\nYour Realtor`;
    return { mlsDesc: styledDesc, igSlides, reelScript, emailSubject, emailBody };
  }, [generated, address, beds, baths, sqft, toFeatureList, brandVoice, nearby]);

  const outputs = kitSample ? sampleOutputs : serverOutputs;

  return {
    // State
    address, setAddress,
    beds, setBeds,
    baths, setBaths,
    sqft, setSqft,
    neighborhood, setNeighborhood,
    features, setFeatures,
    photos, setPhotos,
    propertyType, setPropertyType,
    tone, setTone,
    brandVoice, setBrandVoice,
    channels, setChannels,
    openHouseDate, setOpenHouseDate,
    openHouseTime, setOpenHouseTime,
    openHouseLink, setOpenHouseLink,
    ctaType, setCtaType,
    ctaPhone, setCtaPhone,
    ctaLink, setCtaLink,
    ctaCustom, setCtaCustom,
    socialHandle, setSocialHandle,
    hashtagStrategy, setHashtagStrategy,
    extraHashtags, setExtraHashtags,
    readingLevel, setReadingLevel,
    useEmojis, setUseEmojis,
    mlsFormat, setMlsFormat,
    mustInclude, setMustInclude,
    avoidWords, setAvoidWords,
    generated,
    revealed,
    copyToast, setCopyToast,
    isGenerating,
    kitStatus,
    kitSample,
    isLoggedIn,
    freeKitsUsed,
    freeLimit,
    outputs,
    showAuth, setShowAuth,

    // Functions
    onGenerate,
    useSample,
    handleReveal,
    refresh,
  };
}
