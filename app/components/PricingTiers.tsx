"use client";
import React from 'react';
import { Check, Star, Crown, Users, Zap } from 'lucide-react';
import { TIER_CONFIGS, TIER_COMPARISON_FEATURES, type TierConfig } from '@/lib/tiers';
import TierBadge from './TierBadge';

interface PricingTiersProps {
  currentTier?: string;
  onSelectTier?: (tier: string) => void;
  highlightTier?: string;
}

const TIER_ICONS = {
  STARTER: Zap,
  PROFESSIONAL: Star,
  PREMIUM: Crown,
  TEAM: Users,
};

function TierCard({ 
  config, 
  isCurrent, 
  isRecommended, 
  onSelect 
}: { 
  config: TierConfig; 
  isCurrent?: boolean; 
  isRecommended?: boolean;
  onSelect?: () => void;
}) {
  const Icon = TIER_ICONS[config.name as keyof typeof TIER_ICONS];
  
  return (
    <div className={`relative rounded-3xl border p-8 ${
      isRecommended 
        ? 'border-cyan-500/50 bg-cyan-500/5' 
        : 'border-white/10 bg-neutral-900/60'
    }`}>
      {config.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {Icon && <Icon className="h-6 w-6 text-cyan-400" />}
          <h3 className="text-xl font-semibold">{config.displayName}</h3>
        </div>
        
        <div className="mb-4">
          <span className="text-4xl font-bold">${config.price}</span>
          {config.price > 0 && <span className="text-white/60">/month</span>}
        </div>
        
        <p className="text-white/70 mb-6">{config.description}</p>
        
        <div className="space-y-3 mb-8 text-left">
          <div className="flex items-center gap-3">
            <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
            <span className="text-sm">{config.kitsPerMonth} marketing kits/month</span>
          </div>
          
          {config.features.vision && (
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span className="text-sm">AI photo analysis</span>
            </div>
          )}
          
          {config.features.heroImages && (
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span className="text-sm">Smart hero image generation</span>
            </div>
          )}
          
          {config.features.allPlatforms && (
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span className="text-sm">All platform exports</span>
            </div>
          )}
          
          {config.features.customBranding && (
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span className="text-sm">Custom branding</span>
            </div>
          )}
          
          {config.features.prioritySupport && (
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span className="text-sm">Priority support</span>
            </div>
          )}
          
          {config.features.apiAccess && (
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span className="text-sm">API access</span>
            </div>
          )}
          
          {config.features.multiUser && (
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span className="text-sm">Team collaboration</span>
            </div>
          )}
          
          {config.features.whiteLabel && (
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-cyan-400 flex-shrink-0" />
              <span className="text-sm">White label</span>
            </div>
          )}
        </div>
        
        {isCurrent ? (
          <div className="w-full py-3 px-4 bg-white/10 text-white/70 rounded-xl font-medium">
            Current Plan
          </div>
        ) : (
          <button
            onClick={onSelect}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              isRecommended
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                : 'bg-white text-neutral-900 hover:bg-white/90'
            }`}
          >
            {config.price === 0 ? 'Get Started' : `Upgrade to ${config.displayName}`}
          </button>
        )}
      </div>
    </div>
  );
}

export default function PricingTiers({ 
  currentTier = 'FREE', 
  onSelectTier, 
  highlightTier = 'PROFESSIONAL' 
}: PricingTiersProps) {
  const visibleTiers = Object.values(TIER_CONFIGS).filter(tier => tier.name !== 'FREE');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Choose Your Plan
        </h2>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Unlock the power of AI-driven real estate marketing with visual intelligence
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {visibleTiers.map((config) => (
          <TierCard
            key={config.name}
            config={config}
            isCurrent={currentTier === config.name}
            isRecommended={highlightTier === config.name}
            onSelect={() => onSelectTier?.(config.name)}
          />
        ))}
      </div>
      
      <div className="mt-12 text-center text-sm text-white/60">
        <p>All plans include unlimited text generation, MLS descriptions, and social media content.</p>
        <p className="mt-2">Visual intelligence features (photo analysis & hero images) available in Professional tier and above.</p>
      </div>
    </div>
  );
}