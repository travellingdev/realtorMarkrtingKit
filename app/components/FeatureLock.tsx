"use client";
import React from 'react';
import { Lock, ArrowRight, Crown } from 'lucide-react';
import { getTierConfig, getUpgradeRecommendation, FEATURE_DESCRIPTIONS, type TierFeatures } from '@/lib/tiers';
import TierBadge from './TierBadge';

interface FeatureLockProps {
  feature: keyof TierFeatures;
  currentTier: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onUpgrade?: (targetTier: string) => void;
}

export default function FeatureLock({ 
  feature, 
  currentTier, 
  title, 
  description, 
  children,
  onUpgrade 
}: FeatureLockProps) {
  const currentConfig = getTierConfig(currentTier);
  const recommendation = getUpgradeRecommendation(currentTier, feature);
  
  if (currentConfig.features[feature]) {
    // Feature is available, render children
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred/disabled content */}
      {children && (
        <div className="relative">
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
            <div className="bg-neutral-800/90 rounded-xl p-6 text-center max-w-sm">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full">
                  <Lock className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
              
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/70 mb-4">
                {description || FEATURE_DESCRIPTIONS[feature]}
              </p>
              
              <div className="flex items-center justify-center gap-2 mb-4 text-sm text-white/60">
                <span>Available in</span>
                {recommendation && (
                  <TierBadge tier={recommendation.name} showPrice />
                )}
              </div>
              
              {recommendation && onUpgrade && (
                <button
                  onClick={() => onUpgrade(recommendation.name)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Upgrade Now
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="pointer-events-none opacity-30">
            {children}
          </div>
        </div>
      )}
      
      {/* If no children, show standalone upgrade prompt */}
      {!children && (
        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full">
              <Crown className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            {description || FEATURE_DESCRIPTIONS[feature]}
          </p>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-sm text-white/60">Currently on</span>
            <TierBadge tier={currentTier} />
            <ArrowRight className="h-4 w-4 text-white/40" />
            {recommendation && <TierBadge tier={recommendation.name} showPrice />}
          </div>
          
          {recommendation && onUpgrade && (
            <button
              onClick={() => onUpgrade(recommendation.name)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              Upgrade to {recommendation.displayName}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}