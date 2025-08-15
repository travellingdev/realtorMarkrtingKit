'use client';
import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Crown,
  Zap,
  Star,
  Camera,
  Palette,
  Settings,
  Users,
  Globe
} from 'lucide-react';
import { 
  getTierConfig, 
  getUpgradeRecommendation, 
  FEATURE_DESCRIPTIONS,
  type TierFeatures 
} from '@/lib/tiers';
import TierBadge from './TierBadge';

const FEATURE_ICONS: Record<keyof TierFeatures, React.ComponentType<{ className?: string }>> = {
  // Photo Analysis Features
  vision: Camera,
  photoUpload: Camera,
  photoPreview: Camera,
  visionLimit: Camera,
  advancedAnalysis: Star,
  
  // Image Generation Features
  heroImages: Palette,
  heroSelection: Sparkles,
  basicOverlays: Palette,
  customOverlays: Palette,
  
  // Platform & Support Features
  allPlatforms: Globe,
  prioritySupport: Zap,
  apiAccess: Settings,
  multiUser: Users,
  whiteLabel: Crown,
  customBranding: Palette,
};

interface InlineFeatureTeaserProps {
  feature: keyof TierFeatures;
  currentTier: string;
  title?: string;
  description?: string;
  onUpgrade?: (targetTier: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'prominent';
}

export default function InlineFeatureTeaser({
  feature,
  currentTier,
  title,
  description,
  onUpgrade,
  className = '',
  size = 'md',
  variant = 'default'
}: InlineFeatureTeaserProps) {
  const recommendation = getUpgradeRecommendation(currentTier, feature);
  const featureDescription = description || FEATURE_DESCRIPTIONS[feature];
  const Icon = FEATURE_ICONS[feature] || Sparkles;

  if (!recommendation) {
    return null; // Feature is already available or no upgrade path
  }

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4', 
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const variants = {
    default: 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-400/20',
    minimal: 'bg-white/5 border-white/10',
    prominent: 'bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 border-purple-400/30'
  };

  return (
    <div className={`rounded-lg border ${variants[variant]} ${sizeClasses[size]} ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 p-2 rounded-lg ${
          variant === 'prominent' 
            ? 'bg-gradient-to-br from-purple-400/20 to-cyan-400/20' 
            : 'bg-cyan-400/20'
        }`}>
          <Icon className={`${iconSizes[size]} ${
            variant === 'prominent' ? 'text-purple-400' : 'text-cyan-400'
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className={`font-medium text-white ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
            }`}>
              {title || `Unlock ${feature}`}
            </h3>
            
            {/* Tier Badge */}
            <TierBadge 
              tier={recommendation.name} 
              showPrice={size !== 'sm'}
              className="flex-shrink-0"
            />
          </div>

          <p className={`text-white/70 mb-3 ${
            size === 'sm' ? 'text-xs' : 'text-sm'
          } leading-relaxed`}>
            {featureDescription}
          </p>

          {/* CTA Button */}
          {onUpgrade && (
            <button
              onClick={() => onUpgrade(recommendation.name)}
              className={`inline-flex items-center gap-2 rounded-lg font-medium transition-all ${
                variant === 'prominent'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white'
                  : 'bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300'
              } ${
                size === 'sm' 
                  ? 'px-3 py-1.5 text-xs' 
                  : size === 'lg' 
                    ? 'px-4 py-2.5 text-sm' 
                    : 'px-3 py-2 text-sm'
              }`}
              aria-label={`Upgrade to ${recommendation.displayName} to unlock ${title || feature}`}
            >
              <span>Upgrade to {recommendation.displayName}</span>
              <ArrowRight className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
            </button>
          )}
        </div>
      </div>

      {/* Optional feature highlights for larger sizes */}
      {size === 'lg' && variant === 'prominent' && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Star className="h-3 w-3 text-yellow-400" />
            <span>
              Includes all {currentTier} features plus advanced {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}