"use client";
import React, { useCallback, useEffect } from 'react';
import { Lock, ArrowRight, Crown, X } from 'lucide-react';
import { getTierConfig, getUpgradeRecommendation, FEATURE_DESCRIPTIONS, type TierFeatures } from '@/lib/tiers';
import TierBadge from './TierBadge';
import InlineFeatureTeaser from './InlineFeatureTeaser';
import OverlayFeatureTeaser from './OverlayFeatureTeaser';

interface FeatureLockProps {
  feature: keyof TierFeatures;
  currentTier: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onUpgrade?: (targetTier: string) => void;
  onBlockedAttempt?: (feature: string) => void;
  showDismiss?: boolean;
  onDismiss?: () => void;
  variant?: 'inline' | 'overlay' | 'modal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FeatureLock({ 
  feature, 
  currentTier, 
  title, 
  description, 
  children,
  onUpgrade,
  onBlockedAttempt,
  showDismiss = false,
  onDismiss,
  variant = 'modal', // Default to modal for backward compatibility
  size = 'md',
  className = ''
}: FeatureLockProps) {
  const currentConfig = getTierConfig(currentTier);
  const recommendation = getUpgradeRecommendation(currentTier, feature);
  
  // Handle escape key for dismissing modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && onDismiss) {
      onDismiss();
    }
  }, [onDismiss]);

  useEffect(() => {
    if (onDismiss) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, onDismiss]);
  
  // Track blocked feature attempt (must be called before early return)
  React.useEffect(() => {
    if (!currentConfig.features[feature] && onBlockedAttempt) {
      onBlockedAttempt(feature);
    }
  }, [feature, onBlockedAttempt, currentConfig.features]);

  if (currentConfig.features[feature]) {
    // Feature is available, render children
    return <>{children}</>;
  }

  // Use new teaser variants based on variant prop
  switch (variant) {
    case 'inline':
      return (
        <InlineFeatureTeaser
          feature={feature}
          currentTier={currentTier}
          title={title}
          description={description}
          onUpgrade={onUpgrade}
          size={size}
          className={className}
        />
      );

    case 'overlay':
      return (
        <OverlayFeatureTeaser
          feature={feature}
          currentTier={currentTier}
          title={title}
          description={description}
          onUpgrade={onUpgrade}
          dismissible={showDismiss}
          className={className}
        >
          {children}
        </OverlayFeatureTeaser>
      );

    case 'modal':
    default:
      // Keep the original modal behavior for backward compatibility
      break;
  }

  return (
    <div className="relative isolate">
      {/* Blurred/disabled content */}
      {children && (
        <div className="relative isolate">
          {/* Enhanced backdrop overlay with better positioning */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-neutral-900/90 via-neutral-800/85 to-neutral-900/90 backdrop-blur-lg rounded-2xl flex items-center justify-center p-4 sm:p-6"
            style={{ zIndex: 100 }}
            role="dialog"
            aria-labelledby="feature-lock-title"
            aria-describedby="feature-lock-description"
            aria-modal="true"
          >
            {/* Modal content with improved spacing and responsive design */}
            <div className="bg-neutral-800/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center max-w-sm sm:max-w-md w-full mx-4 relative shadow-2xl border border-white/10 animate-in fade-in-0 slide-in-from-bottom-6 duration-300">
              {/* Dismiss button */}
              {showDismiss && onDismiss && (
                <button
                  onClick={onDismiss}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Dismiss feature preview"
                >
                  <X className="h-4 w-4 text-white/60" />
                </button>
              )}
              
              {/* Lock icon with improved visual hierarchy */}
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-2xl blur-lg"></div>
                  <Lock className="h-7 w-7 text-cyan-400 relative z-10" />
                </div>
              </div>
              
              {/* Enhanced title and description */}
              <h3 id="feature-lock-title" className="text-lg font-bold text-white mb-3 leading-tight">
                {title}
              </h3>
              <p id="feature-lock-description" className="text-sm text-white/80 mb-6 leading-relaxed">
                {description || FEATURE_DESCRIPTIONS[feature]}
              </p>
              
              {/* Improved tier information */}
              <div className="flex items-center justify-center gap-3 mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-sm font-medium text-white/70">Available in</span>
                {recommendation && (
                  <TierBadge tier={recommendation.name} showPrice />
                )}
              </div>
              
              {/* Enhanced CTA button */}
              {recommendation && onUpgrade && (
                <button
                  onClick={() => onUpgrade(recommendation.name)}
                  className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-neutral-800"
                  aria-label={`Upgrade to ${recommendation.displayName} to unlock ${title}`}
                >
                  <span>Upgrade to {recommendation.displayName}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              
              {/* Alternative action for users who want to learn more */}
              <button className="mt-3 text-xs text-white/60 hover:text-white/80 transition-colors underline">
                Learn more about this feature
              </button>
            </div>
          </div>
          
          {/* Improved locked content display with better accessibility */}
          <div 
            className="pointer-events-none opacity-40 select-none"
            aria-hidden="true"
            role="presentation"
          >
            {children}
          </div>
          
          {/* Screen reader description for locked content */}
          <div className="sr-only">
            This feature is locked and requires {recommendation?.displayName} tier or higher. 
            {description || FEATURE_DESCRIPTIONS[feature]}
          </div>
        </div>
      )}
      
      {/* If no children, show standalone upgrade prompt */}
      {!children && (
        <>
        <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-neutral-900/80 to-neutral-800/60 backdrop-blur-sm p-8 text-center shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="p-5 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-2xl blur-lg animate-pulse"></div>
              <Crown className="h-10 w-10 text-cyan-400 relative z-10" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3 leading-tight">{title}</h3>
          <p className="text-white/80 mb-8 max-w-md mx-auto leading-relaxed">
            {description || FEATURE_DESCRIPTIONS[feature]}
          </p>
          
          {/* Enhanced tier progression display */}
          <div className="flex items-center justify-center gap-4 mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-xs text-white/60 mb-1">Current</span>
              <TierBadge tier={currentTier} />
            </div>
            <ArrowRight className="h-5 w-5 text-white/40 flex-shrink-0" />
            <div className="flex flex-col items-center">
              <span className="text-xs text-cyan-400 mb-1">Upgrade to</span>
              {recommendation && <TierBadge tier={recommendation.name} showPrice />}
            </div>
          </div>
          
          {/* Enhanced standalone CTA */}
          {recommendation && onUpgrade && (
            <div className="space-y-3">
              <button
                onClick={() => onUpgrade(recommendation.name)}
                className="w-full max-w-xs bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 mx-auto shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-neutral-800"
                aria-label={`Upgrade to ${recommendation.displayName} to unlock ${title}`}
              >
                <span>Upgrade to {recommendation.displayName}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <p className="text-xs text-white/60">
                Unlock this feature and more with a {recommendation.displayName} plan
              </p>
            </div>
          )}
        </div>
        </>
      )}
    </div>
  );
}