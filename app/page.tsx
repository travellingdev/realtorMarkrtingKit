'use client';
import React, { useRef,useState } from "react";
import {
  Sparkles,
  LogIn,
} from "lucide-react";
import GradientDecoration from "./components/GradientDecoration";
import UserMenu from "./components/UserMenu";
import Hero from "./components/Hero";
import InstantDemoForm from "./components/InstantDemoForm";
import OutputsSection from "./components/OutputsSection";
import PaywallBanner from "./components/PaywallBanner";
import Pricing from "./components/Pricing";
import AuthModal from "./components/AuthModal";
import SurveyModal from "./components/SurveyModal";
import { useRealtorKit } from "@/app/hooks/useRealtorKit";
import { PROPERTY_TEMPLATES, TONES, BASE_FREE_LIMIT } from "@/lib/constants";

export default function RealtorsAIMarketingKit() {
  const {
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
    outputs,
    revealed,
    kitSample,
    isLoggedIn,
    kitStatus,
    isGenerating,
    freeKitsUsed,
    freeLimit,
    photoInsights,
    showAuth, setShowAuth,
    copyToast, setCopyToast,
    onGenerate,
    useSample,
    handleReveal,
    generateHeroImages,
    refresh,
  } = useRealtorKit();

  const [showPaywall, setShowPaywall] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const topRef = useRef<HTMLDivElement | null>(null);

  const propertyTemplates = PROPERTY_TEMPLATES;
  const tones = TONES;

  const scrollToDemo = () =>
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });

  const canCopyAll = () => {
    if (!outputs || !revealed) return false;
    if (kitSample) return isLoggedIn;
    return true;
  };

  const unlockOneMore = () => {
    setShowPaywall(false);
    setShowSurvey(true);
  };

  const onSurveySubmit = async () => {
    // This logic remains here as it deals with UI state (modals)
    // that is not part of the core kit generation logic.
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
      await refresh(); // Refresh user data after unlocking
      setShowSurvey(false);
      handleReveal();
    } catch (_) {
      setShowSurvey(false);
    }
  };

  const startCheckout = async (plan: 'PRO' | 'TEAM') => {
    // This logic also remains here as it's UI-specific
    if (isCheckingOut) return;
    setIsCheckingOut(true);
    // ...
    setIsCheckingOut(false);
  };

  return (
    <div ref={topRef} className="min-h-screen bg-neutral-950 text-white">
      <GradientDecoration />
      
      {/* Copy Toast Notification */}
      {copyToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="rounded-2xl bg-white text-neutral-900 px-4 py-2 shadow-lg">
            {copyToast}
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 bg-neutral-900/80 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="font-semibold tracking-tight">Realtor&apos;s AI Marketing Kit</div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#outputs" className="hover:text-white">Outputs</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
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

      <Hero onScrollToDemo={scrollToDemo} onUseSample={useSample} />

      <section id="demo" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Instant demo</h2>
              <p className="mt-2 text-white/70">Drop a few details and generate real marketing assets in seconds.</p>
              <InstantDemoForm
                address={address} setAddress={setAddress}
                neighborhood={neighborhood} setNeighborhood={setNeighborhood}
                beds={beds} setBeds={setBeds}
                baths={baths} setBaths={setBaths}
                sqft={sqft} setSqft={setSqft}
                features={features} setFeatures={setFeatures}
                photos={photos} setPhotos={setPhotos}
                propertyTemplates={propertyTemplates as unknown as string[]}
                tones={tones as unknown as string[]}
                propertyType={propertyType} setPropertyType={setPropertyType}
                tone={tone} setTone={setTone}
                brandVoice={brandVoice} setBrandVoice={setBrandVoice}
                channels={channels} setChannels={setChannels}
                openHouseDate={openHouseDate} setOpenHouseDate={setOpenHouseDate}
                openHouseTime={openHouseTime} setOpenHouseTime={setOpenHouseTime}
                openHouseLink={openHouseLink} setOpenHouseLink={setOpenHouseLink}
                ctaType={ctaType} setCtaType={setCtaType}
                ctaPhone={ctaPhone} setCtaPhone={setCtaPhone}
                ctaLink={ctaLink} setCtaLink={setCtaLink}
                ctaCustom={ctaCustom} setCtaCustom={setCtaCustom}
                socialHandle={socialHandle} setSocialHandle={setSocialHandle}
                hashtagStrategy={hashtagStrategy} setHashtagStrategy={setHashtagStrategy}
                extraHashtags={extraHashtags} setExtraHashtags={setExtraHashtags}
                readingLevel={readingLevel} setReadingLevel={setReadingLevel}
                useEmojis={useEmojis} setUseEmojis={setUseEmojis}
                mlsFormat={mlsFormat} setMlsFormat={setMlsFormat}
                mustInclude={mustInclude} setMustInclude={setMustInclude}
                avoidWords={avoidWords} setAvoidWords={setAvoidWords}
                onGenerate={onGenerate}
                onUseSample={useSample}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </section>

      <OutputsSection
        outputs={outputs}
        revealed={revealed}
        canCopyAll={canCopyAll()}
        onCopyAll={() => {
          if (!outputs) return;
          const allContent = [
            '=== MLS DESCRIPTION ===',
            outputs.mlsDesc,
            '',
            '=== INSTAGRAM CAROUSEL ===',
            outputs.igSlides.join('\n'),
            '',
            '=== REEL SCRIPT ===',
            outputs.reelScript.join('\n'),
            '',
            '=== EMAIL ===',
            `Subject: ${outputs.emailSubject}`,
            '',
            outputs.emailBody
          ].join('\n');
          navigator.clipboard.writeText(allContent);
          setCopyToast('All assets copied!');
          setTimeout(() => setCopyToast(''), 2000);
        }}
        onRequestAuth={() => setShowAuth(true)}
        handleReveal={handleReveal}
        kitSample={kitSample}
        isLoggedIn={isLoggedIn}
        kitStatus={kitStatus}
        onCopySuccess={(message) => {
          setCopyToast(message);
          setTimeout(() => setCopyToast(''), 2000);
        }}
        onRetry={onGenerate}
        photoInsights={photoInsights}
        onGenerateHero={generateHeroImages}
      />

      <Pricing />

      <div className="mx-auto max-w-7xl px-4">
        <PaywallBanner show={showPaywall} extraUnlocked={freeLimit > BASE_FREE_LIMIT} onUnlockOneMore={unlockOneMore} onCheckout={startCheckout} busy={isCheckingOut} />
      </div>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={async () => {
          setShowAuth(false);
          await refresh();
        }}
      />
      <SurveyModal open={showSurvey} onClose={() => setShowSurvey(false)} onSubmit={onSurveySubmit} />
    </div>
  );
}
