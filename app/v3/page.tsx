'use client';
import React, { useRef, useState } from "react";
import { Sparkles, Crown, Zap, Shield, Target } from "lucide-react";
import GradientDecoration from "../components/GradientDecoration";
import AuthStatus from "../components/AuthStatus";
import Hero from "../components/Hero";
import EnhancedForm from "../components/EnhancedForm";
import OutputsSection from "../components/OutputsSection";
import PaywallBanner from "../components/PaywallBanner";
import Pricing from "../components/Pricing";
import AuthModal from "../components/AuthModal";
import SurveyModal from "../components/SurveyModal";
import { useRealtorKit } from "@/app/hooks/useRealtorKit";
import { PROPERTY_TEMPLATES, TONES, BASE_FREE_LIMIT } from "@/lib/constants";
import { openCheckout } from "@/lib/billing";
import { SmartUpgradeFloating, SmartUpgradeBanner } from "../components/SmartUpgradePrompt";

export default function RealtorsAIMarketingKit_v3() {
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
    
    // New enhanced fields from hook
    mlsCompliance, setMLSCompliance,
    targetAudience, setTargetAudience,
    challenges, setChallenges,
    priorityFeatures, setPriorityFeatures,
    
    outputs,
    revealed,
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
  } = useRealtorKit();

  // Additional state for new enhanced fields not in the hook yet
  const [schoolDistrict, setSchoolDistrict] = useState("");
  const [walkScore, setWalkScore] = useState("");
  const [distanceToDowntown, setDistanceToDowntown] = useState("");
  const [nearbyAmenities, setNearbyAmenities] = useState<string[]>([]);
  const [mlsLength, setMLSLength] = useState(200);
  const [emailLength, setEmailLength] = useState(180);
  const [socialLength, setSocialLength] = useState(100);

  const [showPaywall, setShowPaywall] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const topRef = useRef<HTMLDivElement | null>(null);

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

    const billingTier = billingTierMap[targetTier] || 'PRO';
    
    setIsCheckingOut(true);
    try {
      await openCheckout(billingTier);
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div ref={topRef} className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white relative overflow-hidden">
      <GradientDecoration />

      {/* Header */}
      <header className="relative z-10 px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-cyan-400" />
          <span className="text-xl font-bold">RealtorKit</span>
          <span className="text-xs bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
            v3.0 ENHANCED
          </span>
        </div>
        <div className="flex items-center gap-4">
          {userTier === 'FREE' && isLoggedIn && (
            <button
              onClick={() => handleUpgrade('STARTER')}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-medium hover:from-cyan-600 hover:to-blue-600 transition-all"
            >
              <Crown className="h-3 w-3" />
              Upgrade
            </button>
          )}
          <AuthStatus 
            freeKitsUsed={freeKitsUsed} 
            freeLimit={freeLimit} 
            onSignIn={() => setShowAuth(true)} 
          />
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-16">
        <div className="text-center space-y-6">
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-green-300 text-sm">
              <Shield className="h-4 w-4" />
              MLS Compliant
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm">
              <Target className="h-4 w-4" />
              Smart Targeting
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm">
              <Zap className="h-4 w-4" />
              AI Enhanced
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Professional Real Estate
            </span>
            <br />
            <span className="text-white">Marketing in Seconds</span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Generate MLS-compliant, buyer-targeted marketing content with our enhanced AI platform. 
            Features intelligent challenge reframing, priority feature highlighting, and smart compliance checking.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={scrollToDemo}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
            >
              Try Enhanced Generator
            </button>
            <button
              onClick={useSample}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-semibold transition-colors border border-white/10"
            >
              View Sample Output
            </button>
          </div>

          {/* Enhanced Features Preview */}
          <div className="mt-16 grid md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <Shield className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">MLS Compliance</h3>
              <p className="text-white/70 text-sm">
                Automatic Fair Housing compliance checking and MLS-specific rule validation. 
                Prevents violations before they happen.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <Target className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Smart Targeting</h3>
              <p className="text-white/70 text-sm">
                Multi-select buyer persona targeting with intelligent content adaptation. 
                Reach the right buyers with personalized messaging.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <Zap className="h-8 w-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Challenge Reframing</h3>
              <p className="text-white/70 text-sm">
                AI transforms property challenges into selling points. 
                &ldquo;Small rooms&rdquo; becomes &ldquo;cozy and efficient spaces.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Demo Section */}
      <section id="demo" className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Enhanced AI Marketing Generator
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Experience the power of intelligent real estate marketing with MLS compliance, 
            buyer targeting, and challenge reframing built right in.
          </p>
        </div>

        <EnhancedForm
          // Basic property info
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
          
          // Photos
          photos={photos}
          setPhotos={setPhotos}
          
          // Enhanced fields
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
          challenges={challenges}
          setChallenges={setChallenges}
          priorityFeatures={priorityFeatures}
          setPriorityFeatures={setPriorityFeatures}
          mlsCompliance={mlsCompliance}
          setMLSCompliance={setMLSCompliance}
          
          // Existing fields
          tone={tone}
          setTone={setTone}
          channels={channels}
          setChannels={setChannels}
          brandVoice={brandVoice}
          setBrandVoice={setBrandVoice}
          
          // New advanced settings
          schoolDistrict={schoolDistrict}
          setSchoolDistrict={setSchoolDistrict}
          walkScore={walkScore}
          setWalkScore={setWalkScore}
          distanceToDowntown={distanceToDowntown}
          setDistanceToDowntown={setDistanceToDowntown}
          nearbyAmenities={nearbyAmenities}
          setNearbyAmenities={setNearbyAmenities}
          mlsLength={mlsLength}
          setMLSLength={setMLSLength}
          emailLength={emailLength}
          setEmailLength={setEmailLength}
          socialLength={socialLength}
          setSocialLength={setSocialLength}
          
          // Existing advanced settings
          openHouseDate={openHouseDate}
          setOpenHouseDate={setOpenHouseDate}
          openHouseTime={openHouseTime}
          setOpenHouseTime={setOpenHouseTime}
          openHouseLink={openHouseLink}
          setOpenHouseLink={setOpenHouseLink}
          ctaType={ctaType}
          setCtaType={setCtaType}
          ctaPhone={ctaPhone}
          setCtaPhone={setCtaPhone}
          ctaLink={ctaLink}
          setCtaLink={setCtaLink}
          ctaCustom={ctaCustom}
          setCtaCustom={setCtaCustom}
          socialHandle={socialHandle}
          setSocialHandle={setSocialHandle}
          hashtagStrategy={hashtagStrategy}
          setHashtagStrategy={setHashtagStrategy}
          extraHashtags={extraHashtags}
          setExtraHashtags={setExtraHashtags}
          readingLevel={readingLevel}
          setReadingLevel={setReadingLevel}
          useEmojis={useEmojis}
          setUseEmojis={setUseEmojis}
          mlsFormat={mlsFormat}
          setMlsFormat={setMlsFormat}
          mustInclude={mustInclude}
          setMustInclude={setMustInclude}
          avoidWords={avoidWords}
          setAvoidWords={setAvoidWords}
          
          // Actions
          onGenerate={onGenerate}
          onUseSample={useSample}
          isGenerating={isGenerating}
          userTier={userTier}
          kitsUsed={freeKitsUsed}
          freeKitsUsed={freeKitsUsed}
          freeLimit={freeLimit}
          onUpgrade={handleUpgrade}
          onBlockedAttempt={trackBlockedFeature}
        />
      </section>

      {/* Outputs Section */}
      {(outputs || kitStatus === 'PROCESSING') && (
        <OutputsSection
          outputs={outputs}
          revealed={revealed}
          kitSample={kitSample}
          isLoggedIn={isLoggedIn}
          userTier={userTier}
          kitStatus={kitStatus}
          canCopyAll={canCopyAll()}
          photos={photoUrls}
          onCopyAll={() => {}} // Add required prop
          onRequestAuth={() => setShowAuth(true)} // Add required prop
          handleReveal={handleReveal}
          onGenerateHero={generateHeroImages}
          isGeneratingHero={isGeneratingHero}
          photoInsights={photoInsights}
        />
      )}

      {/* Pricing Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <Pricing />
      </section>

      {/* Modals */}
      {showAuth && <AuthModal open={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); refresh(); }} />}
      {showSurvey && <SurveyModal open={showSurvey} onClose={() => setShowSurvey(false)} onSubmit={() => setShowSurvey(false)} />}
      {showPaywall && (
        <PaywallBanner
          show={showPaywall}
          extraUnlocked={false}
          onUnlockOneMore={unlockOneMore}
          onCheckout={handleUpgrade}
          busy={isCheckingOut}
        />
      )}

      {/* Smart upgrade prompts */}
      {showSmartPrompt && (
        <SmartUpgradeFloating
          usageStats={usageStats}
          currentTier={userTier || 'FREE'}
          onUpgrade={handleUpgrade}
          onDismiss={dismissSmartPrompt}
        />
      )}
      
      <SmartUpgradeBanner
        usageStats={usageStats}
        currentTier={userTier || 'FREE'}
        onUpgrade={handleUpgrade}
      />

      {/* Toast */}
      {copyToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {copyToast}
        </div>
      )}
    </div>
  );
}