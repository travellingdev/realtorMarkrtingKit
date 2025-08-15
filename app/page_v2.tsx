'use client';
import React, { useRef, useState } from "react";
import { Sparkles, LogIn } from "lucide-react";
import GradientDecoration from "./components/GradientDecoration";
import UserMenu from "./components/UserMenu";
import Hero_v2 from "./components/Hero_v2";
import InstantDemoForm_v2 from "./components/InstantDemoForm_v2";
import OutputsSection from "./components/OutputsSection";
import PaywallBanner from "./components/PaywallBanner";
import Pricing from "./components/Pricing";
import AuthModal from "./components/AuthModal";
import SurveyModal from "./components/SurveyModal";
import { useRealtorKit } from "@/app/hooks/useRealtorKit";
import { BASE_FREE_LIMIT } from "@/lib/constants";
import { openCheckout } from "@/lib/billing";
import { SmartUpgradeFloating, SmartUpgradeBanner } from "./components/SmartUpgradePrompt";
import { 
  generateContentStrategy, 
  validateEssentials,
  getStrategySummary,
  type EssentialInputs 
} from "@/lib/contentStrategies_v2";
import { type RealtorPersona } from "@/lib/personaDetector";

export default function RealtorAIMarketingKit_v2() {
  const {
    // V2 will use minimal state - most comes from smart generation
    photos, setPhotos,
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
    useSample,
    handleReveal,
    generateHeroImages,
    trackBlockedFeature,
    dismissSmartPrompt,
    refresh,
  } = useRealtorKit();

  // V2-specific state
  const [address, setAddress] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null);

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
    try {
      const res = await fetch('/api/unlock-extra', { method: 'POST' });
      if (res.status === 401) {
        setShowSurvey(false);
        setShowAuth(true);
        return;
      }
      if (!res.ok) {
        console.warn('[page_v2] survey submit failed', { status: res.status });
        return;
      }
      setShowSurvey(false);
      refresh();
    } catch (err) {
      console.warn('[page_v2] survey submit error', err);
    }
  };

  const startCheckout = async (plan: 'PRO' | 'TEAM') => {
    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }
    try {
      setIsCheckingOut(true);
      const result = await openCheckout(plan);
      if (result.upgraded) {
        refresh();
        setCopyToast('Welcome to your upgraded plan!');
        setTimeout(() => setCopyToast(''), 3000);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      setCopyToast('Checkout failed. Please try again.');
      setTimeout(() => setCopyToast(''), 3000);
    } finally {
      setIsCheckingOut(false);
    }
  };

  // V2 Smart Generation Handler
  const handleSmartGenerate = async (essentials: EssentialInputs, contentTypes: string[], persona: RealtorPersona) => {
    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }

    // Validate inputs
    const validation = validateEssentials(essentials);
    if (!validation.valid) {
      setCopyToast(`Please fix: ${validation.errors.join(', ')}`);
      setTimeout(() => setCopyToast(''), 3000);
      return;
    }

    try {
      // Generate smart content strategy
      const strategy = generateContentStrategy(essentials, contentTypes, persona);
      setGeneratedStrategy(strategy);
      
      setCopyToast(`Smart strategy: ${getStrategySummary(strategy)}`);
      setTimeout(() => setCopyToast(''), 4000);

      // Here we would call the actual generation API with the smart strategy
      // For now, we'll simulate by calling the existing sample function
      // Note: In a real implementation, this would be an API call
      // useSample(); // TODO: Replace with actual API call
      
      // Scroll to outputs after brief delay
      setTimeout(() => {
        const el = document.getElementById('outputs');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);

    } catch (error) {
      console.error('Smart generation failed:', error);
      setCopyToast('Generation failed. Please try again.');
      setTimeout(() => setCopyToast(''), 3000);
    }
  };

  return (
    <div ref={topRef} className="min-h-screen bg-neutral-950 text-white">
      <GradientDecoration />
      
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 bg-neutral-900/80 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="font-semibold tracking-tight">Realtor&rsquo;s AI Marketing Kit</div>
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
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/60">
                  Free kits used: {Math.min(freeKitsUsed, freeLimit)} / {freeLimit}
                </span>
                <UserMenu />
              </div>
            )}
            <button
              onClick={scrollToDemo}
              className="rounded-2xl bg-white text-neutral-900 px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
            >
              Create Content →
            </button>
          </div>
        </div>
      </header>

      <Hero_v2 onScrollToDemo={scrollToDemo} onUseSample={useSample} />

      <section id="demo" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Smart Content Creation</h2>
              <p className="mt-2 text-white/70">Answer a few questions, get professional content in minutes.</p>
              
              <InstantDemoForm_v2
                address={address}
                setAddress={setAddress}
                photos={photos}
                setPhotos={setPhotos}
                onSmartGenerate={handleSmartGenerate}
                onUseSample={useSample}
                isGenerating={isGenerating}
                userTier={userTier}
                onUpgrade={handleUpgrade}
                onBlockedAttempt={trackBlockedFeature}
              />
            </div>
            
            {/* Preview/Status Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
                  <h3 className="font-semibold mb-3">Content Preview</h3>
                  
                  {generatedStrategy ? (
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-cyan-400/10 rounded-lg">
                        <p className="text-cyan-300 font-medium">Strategy Applied</p>
                        <p className="text-cyan-200/80 text-xs mt-1">
                          {getStrategySummary(generatedStrategy)}
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-xs text-white/70">
                        <p><span className="text-white/90">Property:</span> {generatedStrategy.propertyTemplate}</p>
                        <p><span className="text-white/90">Target:</span> {generatedStrategy.targetBuyer.replace('_', ' ')}</p>
                        <p><span className="text-white/90">Channels:</span> {generatedStrategy.channels.join(', ')}</p>
                        <p><span className="text-white/90">Tone:</span> {generatedStrategy.tone}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-white/60 text-center py-6">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 text-white/40" />
                      <p>Fill out the form to see your personalized content strategy</p>
                    </div>
                  )}
                </div>
                
                {/* Tips based on current inputs */}
                <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
                  <h3 className="font-semibold mb-3 text-sm">💡 Pro Tips</h3>
                  <ul className="space-y-2 text-xs text-white/70">
                    <li>• Add 3-5 photos for better AI analysis</li>
                    <li>• Be specific with your key feature</li>
                    <li>• Choose content types that match your goals</li>
                    <li>• Preview before generating for best results</li>
                  </ul>
                </div>
              </div>
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
        onRetry={() => console.log('Retry with current strategy')} // Would re-run smart generation
        photoInsights={photoInsights}
        onGenerateHero={generateHeroImages}
        userTier={userTier}
        onUpgrade={handleUpgrade}
        onBlockedAttempt={trackBlockedFeature}
        isGeneratingHero={isGeneratingHero}
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