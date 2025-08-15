'use client';
import React, { useState } from 'react';
import { 
  Lock, 
  ArrowRight, 
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  getUpgradeRecommendation, 
  FEATURE_DESCRIPTIONS,
  type TierFeatures 
} from '@/lib/tiers';
import TierBadge from './TierBadge';

interface OverlayFeatureTeaserProps {
  feature: keyof TierFeatures;
  currentTier: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  onUpgrade?: (targetTier: string) => void;
  dismissible?: boolean;
  className?: string;
}

export default function OverlayFeatureTeaser({
  feature,
  currentTier,
  title,
  description,
  children,
  onUpgrade,
  dismissible = false,
  className = ''
}: OverlayFeatureTeaserProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  const recommendation = getUpgradeRecommendation(currentTier, feature);
  const featureDescription = description || FEATURE_DESCRIPTIONS[feature];

  if (!recommendation || isDismissed) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Background Content */}
      <div 
        className={`transition-all duration-300 ${
          showContent ? 'opacity-100' : 'opacity-30 pointer-events-none select-none'
        }`}
        aria-hidden={!showContent}
      >
        {children}
      </div>
      
      {/* Floating Upgrade Prompt */}
      {!showContent && (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-neutral-900/95 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-4 max-w-sm w-full text-center shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            {/* Dismiss button */}
            {dismissible && (
              <button
                onClick={() => setIsDismissed(true)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Dismiss feature preview"
              >
                <X className="h-3 w-3 text-white/60" />
              </button>
            )}
            
            {/* Lock Icon */}
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-xl">
                <Lock className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            
            {/* Content */}
            <h3 className="font-medium text-white mb-2 text-sm">
              {title || `${feature} Feature`}
            </h3>
            
            <p className="text-xs text-white/70 mb-3 leading-relaxed">
              {featureDescription}
            </p>
            
            {/* Tier Badge */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <span className="text-xs text-white/70">Available in</span>
                <TierBadge tier={recommendation.name} showPrice />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              {onUpgrade && (
                <button
                  onClick={() => onUpgrade(recommendation.name)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                  aria-label={`Upgrade to ${recommendation.displayName} to unlock ${title || feature}`}
                >
                  <span>Upgrade to {recommendation.displayName}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowContent(true)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  <span>Preview</span>
                </button>
                
                {dismissible && (
                  <button
                    onClick={() => setIsDismissed(true)}
                    className="flex-1 text-white/60 hover:text-white px-3 py-2 rounded-lg text-xs transition-colors"
                  >
                    Not Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Content Preview Controls */}
      {showContent && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur-sm rounded-lg p-2 border border-white/10">
            <button
              onClick={() => setShowContent(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Hide preview"
            >
              <EyeOff className="h-3 w-3 text-white/60" />
            </button>
            
            {onUpgrade && (
              <button
                onClick={() => onUpgrade(recommendation.name)}
                className="px-2 py-1 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 rounded text-xs transition-colors"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Screen reader content */}
      <div className="sr-only">
        This feature ({title || feature}) requires {recommendation.displayName} tier or higher. 
        {featureDescription}
      </div>
    </div>
  );
}