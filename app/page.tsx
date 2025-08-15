'use client';
import React, { useRef,useState } from "react";
import {
  Sparkles,
} from "lucide-react";
import GradientDecoration from "./components/GradientDecoration";
import AuthStatus from "./components/AuthStatus";
import Hero from "./components/Hero";
import InstantDemoForm from "./components/InstantDemoForm";
import OutputsSection from "./components/OutputsSection";
import PaywallBanner from "./components/PaywallBanner";
import Pricing from "./components/Pricing";
import AuthModal from "./components/AuthModal";
import SurveyModal from "./components/SurveyModal";
import ContentGenerationProgress from "./components/ContentGenerationProgress";
import { useRealtorKit } from "@/app/hooks/useRealtorKit";
import { PROPERTY_TEMPLATES, TONES, BASE_FREE_LIMIT } from "@/lib/constants";
import { openCheckout } from "@/lib/billing";
import { SmartUpgradeFloating, SmartUpgradeBanner } from "./components/SmartUpgradePrompt";
import "./components/ContentGenerationProgress.css";

export default function RealtorsAIMarketingKit() {
  const {
    address, setAddress,
    beds, setBeds,
    baths, setBaths,
    sqft, setSqft,
    neighborhood, setNeighborhood,
    features, setFeatures,
    photos, setPhotos,
    photoUrls,
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
    kitId,
    kitSample,
    isLoggedIn,
    userTier,
    kitStatus,
    isGenerating,
    freeKitsUsed,
    freeLimit,
    photoInsights,
    showAuth, setShowAuth,
    copyToast, setCopyToast,
    isGeneratingHero,
    usageStats,
    showSmartPrompt,
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

  const handleUpgrade = async (targetTier: string) => {
    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }

    // Map new tier names to existing billing system
    const billingTierMap: Record<string, 'PRO' | 'TEAM'> = {
      'STARTER': 'PRO',
      'PROFESSIONAL': 'PRO', 
      'PREMIUM': 'PRO',
      'TEAM': 'TEAM'
    };

    const billingTier = billingTierMap[targetTier];
    if (!billingTier) {
      console.error('Unknown tier:', targetTier);
      return;
    }

    try {
      setIsCheckingOut(true);
      const result = await openCheckout(billingTier);
      if (result.upgraded) {
        refresh(); // Refresh user data
        setCopyToast(`Successfully upgraded to ${targetTier}!`);
        setTimeout(() => setCopyToast(''), 3000);
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      setCopyToast('Upgrade failed. Please try again.');
      setTimeout(() => setCopyToast(''), 3000);
    } finally {
      setIsCheckingOut(false);
    }
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
            <AuthStatus 
              freeKitsUsed={freeKitsUsed} 
              freeLimit={freeLimit} 
              onSignIn={() => setShowAuth(true)} 
            />
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
                onApplyPreset={applyRecommendedSettings}
                isGenerating={isGenerating}
                userTier={userTier}
                freeKitsUsed={freeKitsUsed}
                freeLimit={freeLimit}
                onUpgrade={handleUpgrade}
                onBlockedAttempt={trackBlockedFeature}
                isLoggedIn={isLoggedIn}
                buttonState={buttonState}
              />
            </div>
          </div>
        </div>
      </section>

      <OutputsSection
        outputs={outputs}
        revealed={revealed}
        kitId={kitId}
        canCopyAll={canCopyAll()}
        photos={photoUrls}
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
        userTier={userTier}
        onUpgrade={handleUpgrade}
        onBlockedAttempt={trackBlockedFeature}
        isGeneratingHero={isGeneratingHero}
      />

      {/* Content Generation Progress Indicator */}
      <ContentGenerationProgress 
        isGenerating={isGenerating}
        photoCount={photos.length}
        propertyType={propertyType}
        isLoggedIn={isLoggedIn}
        onComplete={() => {
          // Optional: Add any completion logic here
          console.log('Content generation complete!');
        }}
      />

      {/* Smart upgrade banner for high-usage users */}
      {usageStats.generationsThisMonth >= 5 && userTier === 'FREE' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <SmartUpgradeBanner
            currentTier={userTier}
            usageStats={usageStats}
            onUpgrade={handleUpgrade}
            showDismiss={false}
          />
        </div>
      )}

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
      
      {/* Smart upgrade prompt - appears when user hits blocks repeatedly */}
      {showSmartPrompt && userTier === 'FREE' && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <SmartUpgradeFloating
            currentTier={userTier}
            usageStats={usageStats}
            onUpgrade={handleUpgrade}
            onDismiss={dismissSmartPrompt}
            showDismiss={true}
          />
        </div>
      )}

      {/* Toast notifications */}
      {copyToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 backdrop-blur-sm border border-cyan-400/30 rounded-xl px-4 py-2 text-sm text-white shadow-2xl">
          {copyToast}
        </div>
      )}
    </div>
  );
}
