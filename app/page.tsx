'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  Image as ImageIcon,
  ChevronDown,
  PlayCircle,
  Mail,
  Instagram,
  ClipboardList,
  ShieldCheck,
  Rocket,
  Star,
  Users,
  LogIn,
  CreditCard,
} from "lucide-react";
import GradientDecoration from "./components/GradientDecoration";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useUser } from "./providers/UserProvider";
import UserMenu from "./components/UserMenu";
import Hero from "./components/Hero";
import InstantDemoForm from "./components/InstantDemoForm";
import OutputsSection from "./components/OutputsSection";
import PaywallBanner from "./components/PaywallBanner";
import { buildPayloadFromForm } from "@/lib/payloadBuilder";
import { loadRazorpaySdk } from "@/lib/loadRazorpay";
import { saveIntent, readIntent, clearIntent } from "@/lib/intent";

// ======================================================
// Realtor's AI Marketing Kit – Single-file React page
// Mobile-first, TailwindCSS, subtle motion, accessible.
// Elegant auth gating & free-tries logic (demo via localStorage)
// ======================================================

// ---- Small pure helpers so we can sanity-test logic ---- //
function computeFreeLimit(base: number, extraUnlocked: boolean) {
  return base + (extraUnlocked ? 1 : 0);
}

// returns one of: 'ok', 'auth', 'paywall' (sample bypasses)
function revealDecision({
  isLoggedIn,
  kitSample,
  freeKitsUsed,
  freeLimit,
}: {
  isLoggedIn: boolean;
  kitSample: boolean;
  freeKitsUsed: number;
  freeLimit: number;
}) {
  if (kitSample) return "ok";
  if (!isLoggedIn) return "auth";
  if (freeKitsUsed >= freeLimit) return "paywall";
  return "ok";
}

export default function RealtorsAIMarketingKit() {
  // --- Auth & gating state ---
  const { user, quota, refresh } = useUser();
  const isLoggedIn = !!user;
  const [showAuth, setShowAuth] = useState(false);
  const BASE_FREE_LIMIT = 2; // 2 custom kits free after login
  const [extraUnlocked, setExtraUnlocked] = useState(false); // +1 via survey
  const [freeKitsUsed, setFreeKitsUsed] = useState(0);

  // React to user/quota changes from context
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
  const [features, setFeatures] = useState(""); // comma-separated
  const [photos, setPhotos] = useState<File[]>([]);
  const [propertyType, setPropertyType] = useState("Starter Home");
  const [tone, setTone] = useState("Warm & Lifestyle");
  const [brandVoice, setBrandVoice] = useState("");

  // --- Output state ---
  const [generated, setGenerated] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [copyToast, setCopyToast] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [serverOutputs, setServerOutputs] = useState<null | {
    mlsDesc: string;
    igSlides: string[];
    reelScript: string[];
    emailSubject: string;
    emailBody: string;
  }>(null);
  const [kitStatus, setKitStatus] = useState<null | 'PROCESSING' | 'READY' | 'FAILED'>(null);

  // current kit metadata
  const [kitId, setKitId] = useState(0);
  const [kitSample, setKitSample] = useState(false);
  const [kitConsumed, setKitConsumed] = useState(false); // counts toward free kits used once revealed

  const topRef = useRef<HTMLDivElement | null>(null);

  const propertyTemplates = [
    "Luxury",
    "Starter Home",
    "Investor Flip",
    "Lakefront",
    "Downtown Condo",
    "New Construction",
    "Fixer-Upper",
  ] as const;

  const tones = [
    "Concise MLS",
    "Warm & Lifestyle",
    "Data-driven",
    "Hype for Social",
  ] as const;

  // Helpers
  const toFeatureList = useMemo(
    () =>
      features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    [features]
  );

  const nearby = neighborhood ? `${neighborhood}` : "the area";

  // Simple tone styles
  const toneStyle = (text: string) => {
    switch (tone) {
      case "Concise MLS":
        return (
          text
            .replaceAll(". ", "; ")
            .replaceAll("..", ".")
            .replace(/\s+/g, " ") + " (MLS-ready)"
        );
      case "Data-driven":
        return (
          text +
          ` Key facts: ${beds || "—"} bd, ${baths || "—"} ba, ${sqft || "—"} sq ft. Energy notes: modern windows; estimated walk to amenities 5–10 min.`
        );
      case "Hype for Social":
        return `🔥 ${text} Tap save + share with a friend who'd love this!`;
      default: // Warm & Lifestyle
        return text + " Imagine slow mornings, sun-lit rooms, and easy evenings.";
    }
  };

  const propertyAngle = (base: string) => {
    switch (propertyType) {
      case "Luxury":
        return `High-spec finishes, generous volume, and curated design moments throughout. ${base}`;
      case "Investor Flip":
        return `Clean numbers and compelling upside. ${base}`;
      case "Lakefront":
        return `Water views and breezy indoor–outdoor flow. ${base}`;
      case "Downtown Condo":
        return `Lock-and-leave living with elevator convenience. ${base}`;
      case "New Construction":
        return `Builder warranty, modern systems, and efficiency. ${base}`;
      case "Fixer-Upper":
        return `Bring vision—great bones, layout potential, and equity on day one. ${base}`;
      default:
        return base;
    }
  };

  const photoHint = photos?.length
    ? ` (${photos.length} photo${photos.length > 1 ? "s" : ""} noted in captions)`
    : "";

  // Client-side sample generator (used only for sample kits)
  const sampleOutputs = useMemo(() => {
    if (!generated) return null;

    const addr = address || "(address withheld)";
    const featLine = toFeatureList.length
      ? `Highlights: ${toFeatureList.slice(0, 6).join(" • ")}. `
      : "";

    const baseDesc = propertyAngle(
      `Sun-filled ${beds || "?"}-bed, ${baths || "?"}-bath${sqft ? `, ${sqft} sq ft` : ""} near ${nearby}. ${featLine}` +
        `Moments to parks, cafés, and daily conveniences in ${nearby}. Newer systems and easy parking.${photoHint}`
    );

    const styledDesc = toneStyle(
      `${baseDesc} ${brandVoice ? `\n\nIn your voice: ${brandVoice}` : ""}`
    );

    const igSlides = [
      `Just Listed${nearby ? ` in ${nearby}` : ""} 🏡`,
      `${beds || "?"} Bed • ${baths || "?"} Bath${sqft ? ` • ${sqft} sq ft` : ""}`,
      toFeatureList.length
        ? `Why it's special: ${toFeatureList.slice(0, 3).join(", ")}`
        : `Why it's special: light, flow, and location`,
      `Open house: Sat 11–1 • ${addr}`,
      `DM "TOUR" for details`,
    ];

    const reelScript = [
      `Hook (0–3s): If natural light matters to you, watch this.`,
      `Middle (4–20s): ${beds || "?"} bd/${baths || "?"} ba${sqft ? `, ${sqft} sq ft` : ""}; open kitchen; ${
        toFeatureList[0] || "flex layout"
      }; primary suite; easy yard.`,
      `CTA (21–30s): Open house Sat 11–1 at ${addr}. Comment "TOUR" and I'll DM details.`,
    ];

    const emailSubject = `Open House ${nearby ? `• ${nearby} ` : ""}${beds || "?"}BR`;
    const emailBody = `Hi there,\n\nWe're opening the doors at ${addr}. Quick look:\n\n• ${
      beds || "?"
    } bed / ${baths || "?"} bath${sqft ? ` • ${sqft} sq ft` : ""}\n• ${
      toFeatureList.length
        ? toFeatureList.slice(0, 4).join("\n• ")
        : "Bright, functional, great location"
    }\n• Near ${nearby} amenities\n\nOpen House: Sat 11–1\nReply to RSVP or request the full photo tour.\n\nBest,\nYour Realtor`;

    return {
      mlsDesc: styledDesc,
      igSlides,
      reelScript,
      emailSubject,
      emailBody,
    };
  }, [
    generated,
    address,
    beds,
    baths,
    sqft,
    neighborhood,
    toFeatureList,
    tone,
    propertyType,
    brandVoice,
    photos,
  ]);

  // Decide which outputs to show: sample uses local generator; custom uses server outputs
  const outputs = kitSample ? sampleOutputs : serverOutputs;

  // Copy helpers
  const promptAuth = () => setShowAuth(true);
  const copy = async (text: string, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyToast(label);
      setTimeout(() => setCopyToast(""), 1600);
    } catch (e) {
      setCopyToast("Couldn't copy. Select manually.");
      setTimeout(() => setCopyToast(""), 1600);
    }
  };

  const copyAll = () => {
    if (!outputs) return;
    const bundle = [
      "MLS Description:\n" + outputs.mlsDesc,
      "\nInstagram Carousel:\n- " + outputs.igSlides.join("\n- "),
      "\n30-sec Reel Script:\n- " + outputs.reelScript.join("\n- "),
      "\nOpen House Email:\nSubject: " + outputs.emailSubject + "\n\n" + outputs.emailBody,
    ].join("\n\n––––––––––––––––\n\n");
    copy(bundle, "All assets copied");
  };

  const onGenerate = async () => {
    // Require auth for custom kits (RLS on insert)
    if (!isLoggedIn) {
      saveIntent({ action: 'generate' });
      setShowAuth(true);
      return;
    }
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const payload = buildPayloadFromForm({
        address,
        beds,
        baths,
        sqft,
        neighborhood,
        features,
        propertyType,
        tone,
        brandVoice,
      });
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
      if (data?.kitId) setKitId(data.kitId);
      setKitSample(false);
      setKitConsumed(false);
      setGenerated(true);
      setRevealed(false);
      setServerOutputs(null);
      setKitStatus('PROCESSING');
      // Start polling for server outputs
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
                return;
              }
              if (j?.status === 'FAILED') {
                setKitStatus('FAILED');
                setCopyToast('Generation failed. Please try again.');
                setTimeout(() => setCopyToast(''), 2000);
                return;
              }
            }
          } catch (_) {
            // ignore and keep polling within time budget
          }
          if (Date.now() - start < 30000) {
            setTimeout(poll, 1000);
          } else {
            setKitStatus('FAILED');
            setCopyToast('Generation timed out. Please try again.');
            setTimeout(() => setCopyToast(''), 2000);
          }
        };
        poll();
      }
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
    setFeatures(
      "Chef's kitchen, Wide-plank oak floors, EV-ready garage, South-facing light, Fenced yard, New roof 2023"
    );
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

  const scrollToDemo = () =>
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });

  const canCopyAll = () => {
    if (!outputs || !revealed) return false;
    if (kitSample) return isLoggedIn;
    return true;
  };

  const [showPaywall, setShowPaywall] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleReveal = async () => {
    if (revealed) return;
    // Sample kits are always viewable
    if (kitSample) {
      setRevealed(true);
      return;
    }
    // Require auth for custom kits
    if (!isLoggedIn) {
      saveIntent({ action: 'reveal' });
      setShowAuth(true);
      return;
    }
    // Already consumed this kit; just reveal without another server call
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
        setShowPaywall(true);
        return;
      }
      if (!res.ok) {
        setShowPaywall(true);
        return;
      }
      const data = await res.json().catch(() => null);
      if (data && typeof data.used === 'number') setFreeKitsUsed(data.used);
      setKitConsumed(true);
      setRevealed(true);
    } catch (_) {
      setShowPaywall(true);
    }
  };

  const unlockOneMore = () => {
    setShowPaywall(false);
    setShowSurvey(true);
  };

  const onSurveySubmit = async () => {
    try {
      const res = await fetch('/api/unlock-extra', { method: 'POST' });
      if (res.status === 401) {
        setShowSurvey(false);
        setShowAuth(true);
        return;
      }
      if (!res.ok) {
        setShowSurvey(false);
        return;
      }
      const data = await res.json().catch(() => null);
      if (data && typeof data.quota_extra === 'number') {
        setExtraUnlocked(data.quota_extra > 0);
      } else {
        setExtraUnlocked(true);
      }
      setShowSurvey(false);
      // After unlocking, try reveal again
      handleReveal();
    } catch (_) {
      setShowSurvey(false);
    }
  };

  const userInitial = "R";

  const startCheckout = async (plan: 'PRO' | 'TEAM') => {
    if (isCheckingOut) return;
    setIsCheckingOut(true);
    try {
      // Must be logged in to checkout
      if (!isLoggedIn) {
        saveIntent({ action: 'reveal' });
        setShowAuth(true);
        return;
      }
      const res = await fetch('/api/razorpay/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const Razorpay = await loadRazorpaySdk();
      const rzp = new Razorpay({
        key: data.key,
        order_id: data.order.id,
      });
      await new Promise<void>((resolve) => {
        rzp.on('payment.failed', () => resolve());
        rzp.on('payment.success', () => resolve());
        rzp.open();
      });
      // Poll /api/me until plan changes from FREE
      const start = Date.now();
      while (Date.now() - start < 30000) {
        const me = await fetch('/api/me');
        if (me.ok) {
          const j = await me.json();
          if (j?.plan && j.plan !== 'FREE') {
            setShowPaywall(false);
            break;
          }
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    } catch (_) {
      // silent
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div ref={topRef} className="min-h-screen bg-neutral-950 text-white">
      <GradientDecoration />

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 bg-neutral-900/80 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="font-semibold tracking-tight">Realtor's AI Marketing Kit</div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#how" className="hover:text-white">
              How it works
            </a>
            <a href="#outputs" className="hover:text-white">
              Outputs
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <button
                onClick={() => setShowAuth(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </button>
            ) : (
              <div className="inline-flex items-center gap-3">
                <span className="text-xs text-white/70">
                  Free kits used: {Math.min(freeKitsUsed, freeLimit)} / {freeLimit}
                </span>
                <UserMenu />
              </div>
            )}
            <button
              onClick={scrollToDemo}
              className="rounded-2xl bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              Generate My First Kit →
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <Hero onScrollToDemo={scrollToDemo} onUseSample={useSample} />

      {/* Instant Demo */}
      <section id="demo" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Instant demo</h2>
              <p className="mt-2 text-white/70">Drop a few details and generate real marketing assets in seconds.</p>

              <InstantDemoForm
                address={address}
                setAddress={setAddress}
                neighborhood={neighborhood}
                setNeighborhood={setNeighborhood}
                beds={beds}
                setBeds={setBeds}
                baths={baths}
                setBaths={setBaths}
                sqft={sqft}
                setSqft={setSqft}
                features={features}
                setFeatures={setFeatures}
                photos={photos}
                setPhotos={setPhotos}
                propertyTemplates={propertyTemplates as unknown as string[]}
                tones={tones as unknown as string[]}
                propertyType={propertyType}
                setPropertyType={setPropertyType}
                tone={tone}
                setTone={setTone}
                brandVoice={brandVoice}
                setBrandVoice={setBrandVoice}
                onGenerate={onGenerate}
                onUseSample={useSample}
                isGenerating={isGenerating}
              />
            </div>
            {/* Right sidebar (How it works) intentionally omitted in Phase 1 extraction */}
          </div>
        </div>
      </section>

      {/* Outputs */}
      <OutputsSection
        outputs={outputs}
        revealed={revealed}
        canCopyAll={canCopyAll()}
        onCopyAll={copyAll}
        onRequestAuth={promptAuth}
        handleReveal={handleReveal}
        kitSample={kitSample}
        isLoggedIn={isLoggedIn}
        generated={generated}
      />

      {/* Paywall banner */}
      <div className="mx-auto max-w-7xl px-4">
        <PaywallBanner show={showPaywall} extraUnlocked={extraUnlocked} onUnlockOneMore={unlockOneMore} onCheckout={startCheckout} busy={isCheckingOut} />
      </div>

      <AuthModal
        open={showAuth}
        onClose={()=>setShowAuth(false)}
        onSuccess={async()=>{
          // Refresh server state after login
          setShowAuth(false);
          try{ await refresh(); }catch(_){/* noop */}
          // Replay any saved intent after login
          const intentRaw = typeof window !== 'undefined' ? sessionStorage.getItem('rk.intent') : null;
          if (intentRaw) {
            try {
              const intent = JSON.parse(intentRaw) as { action: 'reveal'|'generate' };
              sessionStorage.removeItem('rk.intent');
              if (intent.action === 'reveal') handleReveal();
              if (intent.action === 'generate') onGenerate();
            } catch {}
          }
        }}
      />
      <SurveyModal open={showSurvey} onClose={()=>setShowSurvey(false)} onSubmit={onSurveySubmit} />
    </div>
  );
}

// ===================== UI Building Blocks ===================== //

// GradientDecoration now imported as a component

// Minimal stubs for Auth & Survey (same behavior)
function AuthModal({ open, onClose, onSuccess }:{open:boolean; onClose:()=>void; onSuccess:()=>void}){
  if(!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60" onClick={onClose} />
    <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/90 p-6">
      <div className="text-lg font-semibold">Sign in to continue</div>
      <p className="mt-1 text-sm text-white/70">Copy & download are unlocked after a quick sign-in.</p>
      <div className="mt-5 space-y-3">
        <button onClick={async()=>{
          try {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
            if (!url || !key) {
              alert('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
              return;
            }
            const sb = supabaseBrowser();
            const { data, error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
            if (error) {
              alert(`Google sign-in error: ${error.message}`);
              return;
            }
            if (data?.url) {
              window.location.href = data.url;
              return;
            }
            // Fallback: let caller refresh state
            onSuccess();
          } catch (e:any) {
            alert(`Google sign-in failed`);
          }
        }} className="w-full rounded-2xl bg-white text-neutral-900 px-4 py-2 font-semibold hover:opacity-90">Continue with Google</button>
        <button onClick={async()=>{
          const email = prompt('Enter your email for magic link');
          if(!email) return;
          const sb = supabaseBrowser();
          const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
          if (!error) alert('Magic link sent. Check your email.');
        }} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10">Email magic link</button>
      </div>
      <button onClick={onClose} className="mt-4 w-full text-center text-sm text-white/60 hover:text-white">Maybe later</button>
    </div>
  </div>;
}

function SurveyModal({ open, onClose, onSubmit }:{open:boolean; onClose:()=>void; onSubmit:()=>void}){
  const [answer, setAnswer] = useState('');
  if(!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60" onClick={onClose} />
    <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/90 p-6">
      <div className="text-lg font-semibold">Quick 10‑second survey</div>
      <p className="mt-1 text-sm text-white/70">Unlock 1 more free kit when you answer one question.</p>
      <label className="mt-4 block text-sm text-white/80">How do you usually create listing copy?</label>
      <select value={answer} onChange={(e)=>setAnswer(e.target.value)} className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60">
        <option value="">Select an option</option>
        <option>Write it myself</option>
        <option>My team writes it</option>
        <option>Freelancer / agency</option>
        <option>Templates or previous listings</option>
      </select>
      <div className="mt-5 flex gap-3">
        <button onClick={onClose} className="w-1/3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10">Cancel</button>
        <button disabled={!answer} onClick={onSubmit} className={answer?'w-2/3 rounded-2xl px-4 py-2 font-semibold bg-white text-neutral-900 hover:opacity-90':'w-2/3 rounded-2xl px-4 py-2 font-semibold bg-white/20 text-white/60'}>Unlock 1 more free kit</button>
      </div>
    </div>
  </div>;
}
