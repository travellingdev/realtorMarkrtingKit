"use client";
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardList, Copy, Instagram, Mail, PlayCircle } from 'lucide-react';
import { canUseFeature } from '@/lib/tiers';
import FeatureLock from './FeatureLock';
import HeroImageModule from './HeroImageModule';
import { HERO_IMAGE_CONFIG } from '@/lib/features/heroImage/config';

function OutputCard({ title, icon: Icon, text, list, revealed, canCopy, disabledLabel, onCopy, onRequestAuth, hashtags, reelHooks, onCopySuccess, kitSample, isLoggedIn }:{
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  text?: string;
  list?: string[];
  revealed: boolean;
  canCopy: boolean;
  disabledLabel?: string;
  onCopy: () => void;
  onRequestAuth: () => void;
  hashtags?: any;
  reelHooks?: string[];
  onCopySuccess?: (message: string) => void;
  kitSample?: boolean;
  isLoggedIn?: boolean;
}){
  const body = text ? (
    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">{text}</pre>
  ) : title.includes('Reel') ? (
    // Use VideoScriptDisplay for structured reel scripts
    <VideoScriptDisplay scriptLines={list} />
  ) : (
    <ul className="list-disc pl-5 space-y-2 text-sm text-white/90">
      {list?.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );

  return (
    <div className="relative rounded-3xl border border-white/10 bg-neutral-900/60 p-5">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <Icon className="h-5 w-5 text-white/80" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <button
          onClick={canCopy ? onCopy : onRequestAuth}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition ${
            canCopy ? 'border-white/10 bg-white text-neutral-900 hover:opacity-90' : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
          }`}
        >
          <Copy className="h-4 w-4" /> {canCopy ? 'Copy' : (disabledLabel || 'Sign in to Copy')}
        </button>
      </div>

      <div className="mt-4 relative">
        {!revealed && (
          <div className="absolute inset-0 z-10 rounded-2xl backdrop-blur-[2px] bg-neutral-950/40 flex items-center justify-center">
            <span className="text-white/70 text-sm">
              {kitSample && !isLoggedIn ? 'Sign in to view full content' : 'Click "Reveal results" to view'}
            </span>
          </div>
        )}
        {body}
        {revealed && hashtags && (
          <HashtagDisplay hashtags={hashtags} onCopySuccess={onCopySuccess} />
        )}
        {revealed && reelHooks && (
          <ReelHooksDisplay hooks={reelHooks} onCopySuccess={onCopySuccess} />
        )}
      </div>
    </div>
  );
}

import SkeletonLoader from './SkeletonLoader';
import HeroImagePreview from './HeroImagePreview';
import HeroImageFunctional from './HeroImageFunctional';
import HeroImageLoader from './HeroImageLoader';
import HashtagDisplay from './HashtagDisplay';
import ReelHooksDisplay from './ReelHooksDisplay';
import VideoScriptDisplay from './VideoScriptDisplay';
import { useState, useEffect } from 'react';

export function getDisabledLabel(revealed: boolean, isLoggedIn: boolean) {
  return !revealed && isLoggedIn ? 'Reveal to Copy' : 'Sign in to Copy';
}

export default function OutputsSection({ outputs, revealed, canCopyAll, onCopyAll, onRequestAuth, handleReveal, kitSample, isLoggedIn, kitStatus, onCopySuccess, onRetry, photoInsights, onGenerateHero, userTier, onUpgrade, onBlockedAttempt, isGeneratingHero = false, photos = [], kitId, beds, baths, price }:{
  outputs: null | { 
    mlsDesc: string; 
    igSlides: string[]; 
    igHashtags?: {
      trending?: string[];
      location?: string[];
      features?: string[];
      targeted?: string[];
      content?: string[];
      all?: string[];
      score?: number;
      tips?: string;
    };
    reelScript: string[];
    reelHooks?: string[]; 
    emailSubject: string; 
    emailBody: string 
  };
  revealed: boolean;
  canCopyAll: boolean;
  onCopyAll: () => void;
  onRequestAuth: () => void;
  handleReveal: () => void;
  kitSample: boolean;
  isLoggedIn: boolean;
  kitStatus: null | 'PROCESSING' | 'READY' | 'FAILED';
  onCopySuccess?: (message: string) => void;
  onRetry?: () => void;
  photoInsights?: any;
  onGenerateHero?: () => void;
  userTier?: string;
  onUpgrade?: (tier: string) => void;
  onBlockedAttempt?: (feature: string) => void;
  isGeneratingHero?: boolean;
  photos?: string[];
  kitId?: string | number;
  beds?: string;
  baths?: string;
  price?: string;
}){
  const isProcessing = kitStatus === 'PROCESSING';
  const isFailed = kitStatus === 'FAILED';
  const copyDisabledLabel = getDisabledLabel(revealed, isLoggedIn);
  
  // State for async hero analysis
  const [heroAnalysis, setHeroAnalysis] = useState<any>(null);
  const [isHeroAnalyzing, setIsHeroAnalyzing] = useState(false);
  
  // Determine if we should show the hero loader
  const shouldShowHeroLoader = HERO_IMAGE_CONFIG.enabled && 
    photos && photos.length > 0 && 
    outputs && // Content is ready
    kitStatus === 'READY' && // Generation complete
    !heroAnalysis && // Hero analysis not yet complete
    !kitSample && // Not a sample kit
    kitId; // Have a kit ID for polling
    
  console.log('[OutputsSection] Hero loader decision', {
    shouldShowHeroLoader,
    kitId,
    kitIdType: typeof kitId,
    hasPhotos: photos && photos.length > 0,
    hasOutputs: !!outputs,
    kitStatus,
    hasHeroAnalysis: !!heroAnalysis,
    kitSample,
    HEROImageConfigEnabled: HERO_IMAGE_CONFIG.enabled
  });

  return (
    <section id="outputs" className="relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Your marketing kit</h2>
            <p className="mt-2 text-white/70">
              {isProcessing
                ? 'Generating your assets now...'
                : isFailed
                ? 'Generation failed. Please try again.'
                : 'MLS description, Instagram carousel, reel script, and email — generated from your details.'
              }
            </p>
          </div>
          {isFailed && onRetry ? (
            <button onClick={onRetry} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow hover:opacity-95">
              Retry Generation
            </button>
          ) : !revealed && outputs && !isProcessing && !isLoggedIn ? (
            <button onClick={handleReveal} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed">
              Sign in to reveal
            </button>
          ) : null}
        </div>

        {/* Hero Image Module - Async Loading or Ready */}
        {shouldShowHeroLoader ? (
          <div className="mt-6">
            <HeroImageLoader
              kitId={kitId?.toString()}
              photoCount={photos.length}
              onComplete={(analysis) => {
                setHeroAnalysis(analysis);
                setIsHeroAnalyzing(false);
              }}
            />
          </div>
        ) : HERO_IMAGE_CONFIG.enabled && photos && photos.length > 0 && outputs && (heroAnalysis || photoInsights?.heroAnalysis) && (
          <div className="mt-6">
            <HeroImageModule
              photos={photos}
              photoInsights={{ ...photoInsights, heroAnalysis: heroAnalysis || photoInsights?.heroAnalysis }}
              userTier={userTier || 'FREE'}
              isLoggedIn={isLoggedIn}
              propertyType="home"
              onUpgrade={() => onUpgrade?.(userTier === 'FREE' ? 'STARTER' : 'PROFESSIONAL')}
              className=""
              kitId={kitId}
              beds={beds}
              baths={baths}
              price={price}
            />
          </div>
        )}
        
        {/* Photo Insights Section (Legacy - can be removed when Hero Module is stable) */}
        {photoInsights && revealed && !HERO_IMAGE_CONFIG.enabled && (
          <div className="mt-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">🔍 AI Photo Analysis</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {photoInsights.features?.length > 0 && (
                <div>
                  <div className="text-white/80 font-medium mb-1">Features Detected:</div>
                  <div className="text-white/60">{photoInsights.features.slice(0, 5).join(', ')}</div>
                </div>
              )}
              {photoInsights.sellingPoints?.length > 0 && (
                <div>
                  <div className="text-white/80 font-medium mb-1">Selling Points:</div>
                  <div className="text-white/60">{photoInsights.sellingPoints.slice(0, 3).join(', ')}</div>
                </div>
              )}
              {photoInsights.heroCandidate && (
                <div>
                  <div className="text-white/80 font-medium mb-1">Recommended Hero:</div>
                  <div className="text-white/60">Photo {photoInsights.heroCandidate.index + 1} - {photoInsights.heroCandidate.reason}</div>
                </div>
              )}
            </div>
            
            {/* Hero Image Generation Section */}
            <div className="mt-6 border-t border-cyan-500/20 pt-4">
              {canUseFeature(userTier || 'FREE', 'heroImages') ? (
                <HeroImageFunctional 
                  onGenerate={onGenerateHero}
                  isGenerating={isGeneratingHero}
                />
              ) : (
                <FeatureLock
                  feature="heroImages"
                  currentTier={userTier || 'FREE'}
                  title="Hero Image Generator"
                  description="AI-powered hero image selection with professional overlays for all marketing platforms"
                  onUpgrade={onUpgrade}
                  onBlockedAttempt={onBlockedAttempt}
                  variant="overlay"
                  showDismiss={false}
                >
                  <HeroImagePreview 
                    isLocked={true}
                    onUpgrade={onUpgrade}
                  />
                </FeatureLock>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {isProcessing ? (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          ) : isFailed ? (
            <div className="md:col-span-2 rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
              <p className="text-white/80">Generation failed. Please try again.</p>
              {onRetry && (
                <button onClick={onRetry} className="mt-4 rounded-xl bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
                  Retry Now
                </button>
              )}
            </div>
          ) : (
            <>
              <OutputCard
                title="MLS Description"
                icon={ClipboardList}
                text={outputs?.mlsDesc}
                revealed={revealed}
                canCopy={kitSample ? isLoggedIn : revealed}
                disabledLabel={copyDisabledLabel}
                onCopy={() => {
                  if (outputs) {
                    navigator.clipboard.writeText(outputs.mlsDesc);
                    onCopySuccess?.('MLS description copied!');
                  }
                }}
                onRequestAuth={onRequestAuth}
                kitSample={kitSample}
                isLoggedIn={isLoggedIn}
              />
              <OutputCard
                title="Instagram Carousel (caption)"
                icon={Instagram}
                list={outputs?.igSlides}
                hashtags={outputs?.igHashtags}
                revealed={revealed}
                canCopy={kitSample ? isLoggedIn : revealed}
                disabledLabel={copyDisabledLabel}
                onCopy={() => {
                  if (outputs) {
                    navigator.clipboard.writeText(outputs.igSlides.join('\n'));
                    onCopySuccess?.('Instagram caption copied!');
                  }
                }}
                onRequestAuth={onRequestAuth}
                onCopySuccess={onCopySuccess}
              />
              <OutputCard
                title="30-Second Reel Script"
                icon={PlayCircle}
                list={outputs?.reelScript}
                reelHooks={outputs?.reelHooks}
                revealed={revealed}
                canCopy={kitSample ? isLoggedIn : revealed}
                disabledLabel={copyDisabledLabel}
                onCopy={() => {
                  if (outputs) {
                    navigator.clipboard.writeText(outputs.reelScript.join('\n'));
                    onCopySuccess?.('Reel script copied!');
                  }
                }}
                onRequestAuth={onRequestAuth}
                onCopySuccess={onCopySuccess}
              />
              <OutputCard
                title="Open House Email"
                icon={Mail}
                text={outputs ? `Subject: ${outputs.emailSubject}\n\n${outputs.emailBody}` : undefined}
                revealed={revealed}
                canCopy={kitSample ? isLoggedIn : revealed}
                disabledLabel={copyDisabledLabel}
                onCopy={() => {
                  if (outputs) {
                    navigator.clipboard.writeText(`Subject: ${outputs.emailSubject}\n\n${outputs.emailBody}`);
                    onCopySuccess?.('Email copied!');
                  }
                }}
                onRequestAuth={onRequestAuth}
                kitSample={kitSample}
                isLoggedIn={isLoggedIn}
              />
            </>
          )}
        </div>

        <AnimatePresence>
          {canCopyAll && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
              <button onClick={onCopyAll} className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-neutral-900 shadow-lg hover:opacity-90">
                <Copy className="h-4 w-4" /> Copy All Assets
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}


