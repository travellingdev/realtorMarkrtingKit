'use client';
import { useMemo, useState, useEffect } from 'react';
import { useUser } from '@/app/providers/UserProvider';
import { buildPayloadFromForm } from '@/lib/payloadBuilder';
import { saveIntent } from '@/lib/intent';
import { BASE_FREE_LIMIT } from '@/lib/constants';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { uploadPhotos } from '@/lib/uploadPhotos';
import { getSmartDefaults, detectBestPreset } from '@/lib/smartDefaults';

// Usage tracking types
interface UsageStats {
  photoUploads: number;
  generationsThisMonth: number;
  mostUsedChannels: string[];
  blockedFeatureAttempts: { [feature: string]: number };
  lastUpgradePromptDismissed?: Date;
}

function computeFreeLimit(base: number, extraUnlocked: boolean) {
  return base + (extraUnlocked ? 1 : 0);
}

export function useRealtorKit() {
  // --- Auth & gating state ---
  const { user, plan, quota, refresh, isInitialized } = useUser();
  const isLoggedIn = !!user;
  const userTier = plan || 'FREE';
  const [showAuth, setShowAuth] = useState(false);
  const [extraUnlocked, setExtraUnlocked] = useState(false);
  const [freeKitsUsed, setFreeKitsUsed] = useState(quota?.used || 0);
  
  // With server-side auth, we're always initialized
  const authInitialized = isInitialized;

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
  const [photoUrls, setPhotoUrls] = useState<string[]>([]); // Persistent URLs for photos
  const [propertyType, setPropertyType] = useState("Starter Home");
  const [tone, setTone] = useState("Warm & Lifestyle");
  
  // --- New enhanced fields ---
  const [mlsCompliance, setMLSCompliance] = useState("");
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [priorityFeatures, setPriorityFeatures] = useState<Array<{ id: string; value: string; priority: number }>>([]);
  
  // Additional enhanced fields for v3
  const [schoolDistrict, setSchoolDistrict] = useState("");
  const [walkScore, setWalkScore] = useState("");
  const [distanceToDowntown, setDistanceToDowntown] = useState("");
  const [nearbyAmenities, setNearbyAmenities] = useState<string[]>([]);
  const [mlsLength, setMLSLength] = useState(200);
  const [emailLength, setEmailLength] = useState(180);
  const [socialLength, setSocialLength] = useState(100);
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
  const [kitId, setKitId] = useState<string | number>(0);
  const [kitSample, setKitSample] = useState(false);
  const [kitConsumed, setKitConsumed] = useState(false);
  const [photoInsights, setPhotoInsights] = useState<any>(null);
  
  // hero image generation state
  const [isGeneratingHero, setIsGeneratingHero] = useState(false);
  
  // Create persistent photo URLs when photos change
  useEffect(() => {
    if (photos.length > 0) {
      const urls = photos.map(file => URL.createObjectURL(file));
      setPhotoUrls(urls);
      
      // Cleanup old URLs to prevent memory leaks
      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setPhotoUrls([]);
    }
  }, [photos]);

  // Usage tracking state
  const [usageStats, setUsageStats] = useState<UsageStats>({
    photoUploads: 0,
    generationsThisMonth: 0,
    mostUsedChannels: [],
    blockedFeatureAttempts: {}
  });
  const [showSmartPrompt, setShowSmartPrompt] = useState(false);
  
  // State to track button text (to avoid hydration mismatch)
  const [buttonState, setButtonState] = useState({ 
    enabled: true, 
    text: isLoggedIn ? 'Generate from these details' : 'Generate your preview',
    requiresAuth: false 
  });

  // Update button state after mount to check sessionStorage
  useEffect(() => {
    if (!isLoggedIn && typeof window !== 'undefined') {
      try {
        const anonGenerations = parseInt(sessionStorage.getItem('anonGenerations') || '0');
        if (anonGenerations >= 1) {
          setButtonState({ 
            enabled: true, 
            text: 'Sign in to continue',
            requiresAuth: true 
          });
        }
      } catch (e) {
        // SessionStorage not available
      }
    } else if (isLoggedIn) {
      setButtonState({ 
        enabled: true, 
        text: 'Generate from these details',
        requiresAuth: false 
      });
    }
  }, [isLoggedIn]);

  // Load usage stats from localStorage on component mount
  useEffect(() => {
    const loadUsageStats = () => {
      try {
        const saved = localStorage.getItem('realtorkit_usage_stats');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Convert lastUpgradePromptDismissed back to Date if it exists
          if (parsed.lastUpgradePromptDismissed) {
            parsed.lastUpgradePromptDismissed = new Date(parsed.lastUpgradePromptDismissed);
          }
          setUsageStats(parsed);
        }
      } catch (error) {
        console.warn('Failed to load usage stats:', error);
      }
    };
    
    loadUsageStats();
  }, []);

  // Save usage stats to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('realtorkit_usage_stats', JSON.stringify(usageStats));
    } catch (error) {
      console.warn('Failed to save usage stats:', error);
    }
  }, [usageStats]);

  // Usage tracking functions
  const trackPhotoUpload = (count: number) => {
    setUsageStats(prev => ({
      ...prev,
      photoUploads: prev.photoUploads + count
    }));
  };

  const trackGeneration = () => {
    setUsageStats(prev => ({
      ...prev,
      generationsThisMonth: prev.generationsThisMonth + 1,
      mostUsedChannels: channels // Update most used channels
    }));
  };

  const trackBlockedFeature = (feature: string) => {
    setUsageStats(prev => ({
      ...prev,
      blockedFeatureAttempts: {
        ...prev.blockedFeatureAttempts,
        [feature]: (prev.blockedFeatureAttempts[feature] || 0) + 1
      }
    }));
    
    // Show smart upgrade prompt if user has been blocked multiple times
    const totalAttempts = Object.values(usageStats.blockedFeatureAttempts).reduce((sum, count) => sum + count, 0);
    if (totalAttempts >= 2 && !showSmartPrompt) {
      setShowSmartPrompt(true);
    }
  };

  const dismissSmartPrompt = () => {
    setShowSmartPrompt(false);
    setUsageStats(prev => ({
      ...prev,
      lastUpgradePromptDismissed: new Date()
    }));
  };

  // Helpers
  const toFeatureList = useMemo(() => features.split(",").map((f) => f.trim()).filter(Boolean), [features]);
  const nearby = neighborhood ? `${neighborhood}` : "the area";

  const onGenerate = async () => {
    // Check anonymous generation limit
    if (!isLoggedIn) {
      try {
        const anonGenerations = parseInt(sessionStorage.getItem('anonGenerations') || '0');
        
        if (anonGenerations >= 1) {
          // Already used free generation, require sign-in
          saveIntent({ action: 'generate' });
          setShowAuth(true);
          setCopyToast('Sign in to generate more content');
          setTimeout(() => setCopyToast(''), 3000);
          return;
        }
        
        // Allow first anonymous generation
        sessionStorage.setItem('anonGenerations', String(anonGenerations + 1));
        
        // Update button state for next time
        setTimeout(() => {
          setButtonState({ 
            enabled: true, 
            text: 'Sign in to continue',
            requiresAuth: true 
          });
        }, 100);
      } catch (e) {
        // SessionStorage might not be available (e.g., in some privacy modes)
        // Allow generation but warn user
        console.warn('SessionStorage not available, allowing generation');
      }
    }
    
    if (isGenerating) return;
    
    // Clear previous outputs before starting new generation
    setServerOutputs(null);
    setKitStatus('PROCESSING');
    setGenerated(false);
    // Auto-reveal for logged-in users during generation
    setRevealed(isLoggedIn);
    setKitConsumed(false);
    
    setIsGenerating(true);
    try {
      console.log('[useRealtorKit] onGenerate begin');
      let photoUrls: string[] = [];
      
      // Upload photos for both logged-in and anonymous users
      try {
        if (photos.length) {
          setCopyToast(`Uploading ${photos.length} photo${photos.length > 1 ? 's' : ''}...`);
          const sb = supabaseBrowser();
          
          // Use appropriate user ID and flag for anonymous
          const uploadUserId = isLoggedIn ? user!.id : `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const isAnonymous = !isLoggedIn;
          
          photoUrls = await uploadPhotos(sb, photos, uploadUserId, isAnonymous);
          
          // Track photo uploads
          trackPhotoUpload(photos.length);
          
          if (photoUrls.length === 0) {
            setCopyToast('All photo uploads failed - continuing without photos');
            setTimeout(() => setCopyToast(''), 4000);
          } else if (photoUrls.length < photos.length) {
            setCopyToast(`${photoUrls.length}/${photos.length} photos uploaded - continuing with available photos`);
            setTimeout(() => setCopyToast(''), 4000);
          } else {
            setCopyToast('All photos uploaded successfully');
            setTimeout(() => setCopyToast(''), 2000);
          }
          
          if (!isLoggedIn) {
            console.log('[useRealtorKit] Anonymous photos uploaded to temporary bucket');
          }
        }
      } catch (err) {
        console.error('[useRealtorKit] photo upload failed', err);
        setCopyToast('Photo upload failed - continuing without photos');
        setTimeout(() => setCopyToast(''), 4000);
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
        // New enhanced fields
        mlsCompliance,
        targetAudience,
        challenges,
        priorityFeatures,
        
        // Additional v3 enhanced fields
        schoolDistrict,
        walkScore,
        distanceToDowntown,
        nearbyAmenities,
        mlsLength,
        emailLength,
        socialLength,
      });
      console.log('[useRealtorKit] payload', {
        hasAddress: Boolean(address), hasBeds: Boolean(beds), hasBaths: Boolean(baths), hasSqft: Boolean(sqft), hasNeighborhood: Boolean(neighborhood),
        featuresCount: features.split(',').filter(Boolean).length,
        propertyType, tone,
      });
      
      // Add anonymous ID if user is not logged in
      const requestBody: any = { payload, controls };
      if (!isLoggedIn) {
        requestBody.anonymousId = `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        console.warn('[useRealtorKit] /api/generate failed', { status: res.status });
        setCopyToast('Failed to generate. Please try again.');
        setTimeout(() => setCopyToast(''), 1600);
        setKitStatus('FAILED');
        return;
      }
      const data = await res.json().catch(() => null);
      console.log('[useRealtorKit] /api/generate ok', { 
        kitId: data?.kitId,
        kitIdType: typeof data?.kitId,
        dataReceived: data,
        isAnonymous: !isLoggedIn
      });
      if (data?.kitId) {
        console.log('[useRealtorKit] Setting kitId:', data.kitId);
        setKitId(data.kitId);
      }
      
      // Track successful generation
      trackGeneration();
      
      setKitSample(false);
      setKitConsumed(false);
      setGenerated(true);
      // Don't hide content for logged-in users
      setRevealed(isLoggedIn);
      setServerOutputs(null);
      
      // Check if we got outputs directly (for anonymous users)
      if (data?.outputs) {
        // Anonymous user - got outputs directly
        setServerOutputs(data.outputs);
        setPhotoInsights(data.photo_insights);
        setKitStatus('READY');
        console.log('[useRealtorKit] anonymous kit ready immediately');
      } else {
        // Authenticated user - need to poll
        setKitStatus('PROCESSING');
      }
      
      if (data?.kitId && !data?.outputs) {
        const start = Date.now();
        const poll = async () => {
          try {
            const r = await fetch(`/api/kits/${data.kitId}`);
            if (r.ok) {
              const j = await r.json();
              if (j?.status === 'READY' && j.outputs) {
                setServerOutputs(j.outputs);
                setPhotoInsights(j.photo_insights);
                // Use server photo URLs from photo_insights if available
                if (j.photo_insights?.photos && j.photo_insights.photos.length > 0) {
                  setPhotoUrls(j.photo_insights.photos);
                }
                setKitStatus('READY');
                console.log('[useRealtorKit] kit ready', { ms: Date.now() - start });
                
                // Auto-reveal for logged-in users (always, not just non-sample)
                if (isLoggedIn) {
                  setRevealed(true);
                  setKitConsumed(true);
                }
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
          if (Date.now() - start < 90000) { // Increased from 30s to 90s
            setTimeout(poll, 1000);
          } else {
            setKitStatus('FAILED');
            setCopyToast('Generation timed out. Please try again with fewer photos.');
            setTimeout(() => setCopyToast(''), 3000);
            console.warn('[useRealtorKit] poll timeout after 90 seconds');
          }
        };
        poll();
      }
      // Only scroll to outputs after generation starts
      setTimeout(() => {
        const el = document.getElementById('outputs');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
    setKitId((k) => typeof k === 'number' ? k + 1 : 1);
    setKitSample(true);
    setKitConsumed(true);
    setGenerated(true);
    // Auto-reveal sample for logged-in users, otherwise require reveal
    setRevealed(isLoggedIn);
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
      `Hook (0–3s): If natural light matters to you, watch this.`,
      `Middle (4–20s): ${beds || "?"} bd/${baths || "?"} ba${sqft ? `, ${sqft} sq ft` : ""}; open kitchen; ${toFeatureList[0] || "flex layout"}; primary suite; easy yard.`,
      `CTA (21–30s): Open house Sat 11–1 at ${addr}. Comment "TOUR" and I'll DM details.`,
    ];
    const emailSubject = `Open House ${nearby ? `• ${nearby} ` : ""}${beds || "?"}BR`;
    const emailBody = `Hi there,\n\nWe're opening the doors at ${addr}. Quick look:\n\n• ${beds || "?"} bed / ${baths || "?"} bath${sqft ? ` • ${sqft} sq ft` : ""}\n• ${toFeatureList.length ? toFeatureList.slice(0, 4).join("\n• ") : "Bright, functional, great location"}\n• Near ${nearby} amenities\n\nOpen House: Sat 11–1\nReply to RSVP or request the full photo tour.\n\nBest,\nYour Realtor`;
    return { mlsDesc: styledDesc, igSlides, reelScript, emailSubject, emailBody };
  }, [generated, address, beds, baths, sqft, toFeatureList, brandVoice, nearby]);

  const applyRecommendedSettings = (preset?: 'starter' | 'luxury' | 'investor' | 'condo' | 'family' | 'fixer') => {
    // Auto-detect if no preset provided
    const selectedPreset = preset || detectBestPreset({
      sqft,
      features,
      propertyType,
      neighborhood
    });
    
    const defaults = getSmartDefaults(selectedPreset);
    
    // Apply all recommended settings
    setPropertyType(defaults.propertyType);
    setTone(defaults.tone);
    setChannels(defaults.channels);
    setMlsFormat(defaults.mlsFormat);
    setReadingLevel(defaults.readingLevel);
    setUseEmojis(defaults.useEmojis);
    setHashtagStrategy(defaults.hashtagStrategy);
    
    // Only set brand voice if it's empty
    if (!brandVoice) {
      setBrandVoice(defaults.brandVoice);
    }
    
    // Provide feedback to user
    setCopyToast(`Applied ${selectedPreset} property settings`);
    setTimeout(() => setCopyToast(''), 2000);
  };

  const generateHeroImages = async () => {
    if (!kitId || kitSample || isGeneratingHero) return;
    
    setIsGeneratingHero(true);
    try {
      setCopyToast('Generating hero images...');
      
      const response = await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kitId,
          options: {
            overlay: 'just_listed',
            price: '$650,000', // You can make this dynamic
            bedsBaths: `${beds}BD | ${baths}BA`,
            style: 'modern'
          }
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setCopyToast('Hero images generated! Check downloads below.');
        setTimeout(() => setCopyToast(''), 3000);
        console.log('Hero images generated:', result);
      } else {
        const errorData = await response.json().catch(() => null);
        console.error('Hero generation failed:', errorData);
        setCopyToast(errorData?.details?.message || 'Failed to generate hero images');
        setTimeout(() => setCopyToast(''), 3000);
      }
    } catch (error) {
      console.error('Hero generation error:', error);
      setCopyToast('Error generating hero images');
      setTimeout(() => setCopyToast(''), 3000);
    } finally {
      setIsGeneratingHero(false);
    }
  };

  // Helper to get current button state (returns the state, not computing it)
  const getGenerateButtonState = () => {
    return buttonState;
  };

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
    photoUrls, // Export persistent photo URLs
    propertyType, setPropertyType,
    tone, setTone,
    brandVoice, setBrandVoice,
    channels, setChannels,
    
    // New enhanced fields
    mlsCompliance, setMLSCompliance,
    targetAudience, setTargetAudience,
    challenges, setChallenges,
    priorityFeatures, setPriorityFeatures,
    
    // Additional v3 enhanced fields
    schoolDistrict, setSchoolDistrict,
    walkScore, setWalkScore,
    distanceToDowntown, setDistanceToDowntown,
    nearbyAmenities, setNearbyAmenities,
    mlsLength, setMLSLength,
    emailLength, setEmailLength,
    socialLength, setSocialLength,
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
    kitId,
    kitSample,
    isLoggedIn,
    authInitialized,
    userTier,
    freeKitsUsed,
    freeLimit,
    outputs,
    photoInsights,
    showAuth, setShowAuth,
    isGeneratingHero,
    usageStats,
    showSmartPrompt,

    // Functions
    onGenerate,
    useSample,
    handleReveal,
    generateHeroImages,
    applyRecommendedSettings,
    trackBlockedFeature,
    dismissSmartPrompt,
    refresh,
    getGenerateButtonState,
    buttonState,
  };
}
