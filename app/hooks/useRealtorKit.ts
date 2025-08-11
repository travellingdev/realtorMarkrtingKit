'use client';
import { useMemo, useState, useEffect } from 'react';
import { useUser } from '@/app/providers/UserProvider';
import { buildPayloadFromForm } from '@/lib/payloadBuilder';
import { saveIntent } from '@/lib/intent';
import { BASE_FREE_LIMIT } from '@/lib/constants';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

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

  // --- Output state ---
  const [generated, setGenerated] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copyToast, setCopyToast] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [serverOutputs, setServerOutputs] = useState<any>(null);
  const [kitStatus, setKitStatus] = useState<null | 'PROCESSING' | 'READY' | 'FAILED'>(null);

  // current kit metadata
  const [kitId, setKitId] = useState<string | null>(null);
  const [kitSample, setKitSample] = useState(false);
  const [kitConsumed, setKitConsumed] = useState(false);

  // Realtime subscription
  useEffect(() => {
    if (!kitId || kitSample) return;

    const sb = supabaseBrowser();
    const channel = sb
      .channel(`kit-${kitId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'kits',
        filter: `id=eq.${kitId}`,
      }, (payload) => {
        const newKit = payload.new as { status: 'READY' | 'FAILED'; outputs: any };
        if (newKit.status === 'READY' && newKit.outputs) {
          setServerOutputs(newKit.outputs);
          setKitStatus('READY');
          channel.unsubscribe();
        } else if (newKit.status === 'FAILED') {
          setKitStatus('FAILED');
          setCopyToast('Generation failed. Please try again.');
          setTimeout(() => setCopyToast(''), 2000);
          channel.unsubscribe();
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [kitId, kitSample]);

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
      const payload = buildPayloadFromForm({ address, beds, baths, sqft, neighborhood, features, propertyType, tone, brandVoice });
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setCopyToast('Failed to generate. Please try again.');
        setTimeout(() => setCopyToast(''), 1600);
        return;
      }
      const data = await res.json().catch(() => null);
      if (data?.kitId) {
        setKitId(data.kitId); // Start the subscription
      }
      setKitSample(false);
      setKitConsumed(false);
      setGenerated(true);
      setRevealed(false);
      setServerOutputs(null);
      setKitStatus('PROCESSING');

      const el = document.getElementById('outputs');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      const res = await fetch('/api/reveal', { method: 'POST' });
      if (res.status === 401) {
        setShowAuth(true);
        return;
      }
      if (res.status === 402) {
        // setShowPaywall(true); // This state is not in the hook
        return;
      }
      if (!res.ok) {
        // setShowPaywall(true);
        return;
      }
      const data = await res.json().catch(() => null);
      if (data && typeof data.used === 'number') setFreeKitsUsed(data.used);
      setKitConsumed(true);
      setRevealed(true);
    } catch (_) {
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
      `Hook (0–3s): If natural light matters to you, watch this.`,
      `Middle (4–20s): ${beds || "?"} bd/${baths || "?"} ba${sqft ? `, ${sqft} sq ft` : ""}; open kitchen; ${toFeatureList[0] || "flex layout"}; primary suite; easy yard.`,
      `CTA (21–30s): Open house Sat 11–1 at ${addr}. Comment "TOUR" and I'll DM details.`,
    ];
    const emailSubject = `Open House ${nearby ? `• ${nearby} ` : ""}${beds || "?"}BR`;
    const emailBody = `Hi there,\n\nWe're opening the doors at ${addr}. Quick look:\n\n• ${beds || "?"} bed / ${baths || "?"} bath${sqft ? ` • ${sqft} sq ft` : ""}\n• ${toFeatureList.length ? toFeatureList.slice(0, 4).join("\n• ") : "Bright, functional, great location"}\n• Near ${nearby} amenities\n\nOpen House: Sat 11–1\nReply to RSVP or request the full photo tour.\n\nBest,\nYour Realtor`;
    return { mlsDesc: styledDesc, igSlides, reelScript, emailSubject, emailBody };
  }, [generated, address, beds, baths, sqft, neighborhood, toFeatureList, tone, propertyType, brandVoice, photos]);

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
