'use client';
import React from 'react';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { getTierConfig, getUpgradeRecommendation, type TierFeatures } from '@/lib/tiers';
import TierBadge from './TierBadge';
import FeatureTeaserButton from './FeatureTeaserButton';

interface UsageStats {
  photoUploads: number;
  generationsThisMonth: number;
  mostUsedChannels: string[];
  blockedFeatureAttempts: { [feature: string]: number };
  lastUpgradePromptDismissed?: Date;
}

interface SmartUpgradePromptProps {
  currentTier: string;
  usageStats: UsageStats;
  onUpgrade: (targetTier: string) => void;
  onDismiss?: () => void;
  className?: string;
  variant?: 'banner' | 'card' | 'sidebar' | 'floating';
  showDismiss?: boolean;
}

export default function SmartUpgradePrompt({
  currentTier,
  usageStats,
  onUpgrade,
  onDismiss,
  className = '',
  variant = 'card',
  showDismiss = true
}: SmartUpgradePromptProps) {
  // Analyze usage patterns to determine best upgrade recommendation
  const getSmartRecommendation = () => {
    const currentConfig = getTierConfig(currentTier);
    
    // Identify most blocked feature
    const mostBlockedFeature = Object.entries(usageStats.blockedFeatureAttempts)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (mostBlockedFeature) {
      const [feature, attempts] = mostBlockedFeature;
      const recommendation = getUpgradeRecommendation(currentTier, feature as keyof TierFeatures);
      
      if (recommendation && attempts >= 2) {
        return {
          reason: 'blocked_feature',
          feature,
          attempts,
          targetTier: recommendation.name,
          confidence: Math.min(attempts * 25, 100)
        };
      }
    }
    
    // Check if user is hitting limits
    if (currentTier === 'FREE' && usageStats.generationsThisMonth >= 2) {
      return {
        reason: 'generation_limit',
        targetTier: 'STARTER',
        confidence: 90
      };
    }
    
    if (currentTier === 'STARTER' && usageStats.photoUploads >= 3) {
      return {
        reason: 'photo_limit',
        targetTier: 'PROFESSIONAL',
        confidence: 85
      };
    }
    
    // High usage pattern suggests upgrade value
    if (usageStats.generationsThisMonth >= 10) {
      const nextTier = currentTier === 'FREE' ? 'STARTER' : 
                      currentTier === 'STARTER' ? 'PROFESSIONAL' : 'PREMIUM';
      return {
        reason: 'high_usage',
        targetTier: nextTier,
        confidence: 75
      };
    }
    
    // Default recommendation
    const defaultNext = currentTier === 'FREE' ? 'STARTER' : 'PROFESSIONAL';
    return {
      reason: 'general',
      targetTier: defaultNext,
      confidence: 50
    };
  };

  const recommendation = getSmartRecommendation();
  const targetTierConfig = getTierConfig(recommendation.targetTier);
  
  // Generate personalized messaging based on usage
  const getPersonalizedMessage = () => {
    switch (recommendation.reason) {
      case 'blocked_feature':
        return {
          title: `Unlock ${recommendation.feature.charAt(0).toUpperCase() + recommendation.feature.slice(1)}`,
          description: `You've tried to use this ${recommendation.attempts} times. Upgrade to access it instantly.`,
          urgency: 'high' as const
        };
      
      case 'generation_limit':
        return {
          title: 'You\'re generating lots of content!',
          description: 'Upgrade for unlimited generations and keep your momentum going.',
          urgency: 'medium' as const
        };
      
      case 'photo_limit':
        return {
          title: 'Ready for more photos?',
          description: 'Get 10 photos per listing and advanced AI analysis.',
          urgency: 'medium' as const
        };
      
      case 'high_usage':
        return {
          title: 'Power user detected! 🚀',
          description: 'Unlock advanced features to maximize your listing success.',
          urgency: 'low' as const
        };
      
      default:
        return {
          title: 'Unlock your potential',
          description: 'Get access to professional marketing tools.',
          urgency: 'low' as const
        };
    }
  };

  const message = getPersonalizedMessage();
  
  // Calculate potential value/savings
  const getValueProposition = () => {
    const monthlyGenerations = usageStats.generationsThisMonth;
    if (monthlyGenerations >= 5) {
      const timesSaved = monthlyGenerations * 1.5; // 1.5 hours per generation
      return `Save ~${Math.round(timesSaved)} hours/month`;
    }
    return null;
  };

  const valueProposition = getValueProposition();
  
  // Variant-specific styling
  const variantStyles = {
    banner: 'w-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-xl p-4',
    card: 'bg-neutral-900/90 border border-cyan-400/30 rounded-2xl p-6 shadow-2xl',
    sidebar: 'bg-neutral-800/50 border border-white/10 rounded-xl p-4',
    floating: 'bg-neutral-900/95 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-4 shadow-2xl'
  };

  const urgencyColors = {
    high: 'from-red-500 to-orange-500',
    medium: 'from-cyan-500 to-blue-500', 
    low: 'from-purple-500 to-cyan-500'
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${urgencyColors[message.urgency]}`}>
            {recommendation.reason === 'blocked_feature' && <Target className="h-5 w-5 text-white" />}
            {recommendation.reason === 'generation_limit' && <Clock className="h-5 w-5 text-white" />}
            {recommendation.reason === 'photo_limit' && <TrendingUp className="h-5 w-5 text-white" />}
            {recommendation.reason === 'high_usage' && <Zap className="h-5 w-5 text-white" />}
            {recommendation.reason === 'general' && <CheckCircle className="h-5 w-5 text-white" />}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{message.title}</h3>
            <p className="text-xs text-white/70 mt-1">{message.description}</p>
          </div>
        </div>
        
        {showDismiss && onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/40 hover:text-white/60 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* Usage insights */}
      {variant !== 'banner' && (
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-white/60">This month</div>
            <div className="text-white font-medium">{usageStats.generationsThisMonth} generations</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-white/60">Photos uploaded</div>
            <div className="text-white font-medium">{usageStats.photoUploads}</div>
          </div>
        </div>
      )}

      {/* Value proposition */}
      {valueProposition && (
        <div className="mb-4 p-2 bg-cyan-400/10 rounded-lg border border-cyan-400/20">
          <div className="text-xs text-cyan-300 font-medium">⏱️ {valueProposition}</div>
        </div>
      )}

      {/* Tier comparison */}
      <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">Current:</span>
          <TierBadge tier={currentTier} />
        </div>
        <ArrowRight className="h-4 w-4 text-white/40" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-cyan-400">Upgrade to:</span>
          <TierBadge tier={recommendation.targetTier} showPrice />
        </div>
      </div>

      {/* Key benefits preview */}
      {variant === 'card' && (
        <div className="mb-4 space-y-1">
          <div className="text-xs text-white/60 mb-2">You&rsquo;ll unlock:</div>
          {recommendation.targetTier === 'STARTER' && (
            <>
              <div className="text-xs text-white/80">✓ Unlimited generations</div>
              <div className="text-xs text-white/80">✓ Instagram & social content</div>
              <div className="text-xs text-white/80">✓ 3 photos per listing</div>
            </>
          )}
          {recommendation.targetTier === 'PROFESSIONAL' && (
            <>
              <div className="text-xs text-white/80">✓ 10 photos + AI analysis</div>
              <div className="text-xs text-white/80">✓ Hero image generation</div>
              <div className="text-xs text-white/80">✓ Video scripts</div>
            </>
          )}
          {recommendation.targetTier === 'PREMIUM' && (
            <>
              <div className="text-xs text-white/80">✓ Priority AI processing</div>
              <div className="text-xs text-white/80">✓ Advanced customization</div>
              <div className="text-xs text-white/80">✓ White-label options</div>
            </>
          )}
        </div>
      )}

      {/* CTA */}
      <FeatureTeaserButton
        targetTier={recommendation.targetTier}
        onClick={() => onUpgrade(recommendation.targetTier)}
        size={variant === 'banner' ? 'sm' : 'md'}
        variant={message.urgency === 'high' ? 'secondary' : 'primary'}
        fullWidth={variant !== 'banner'}
        showPrice={variant === 'card'}
      >
        {recommendation.reason === 'blocked_feature' ? 'Unlock Now' : 
         recommendation.reason === 'generation_limit' ? 'Get Unlimited' :
         'Upgrade Now'}
      </FeatureTeaserButton>

      {/* Confidence indicator (for testing/debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-white/40">
          Confidence: {recommendation.confidence}% | Reason: {recommendation.reason}
        </div>
      )}
    </div>
  );
}

// Convenience components for common use cases
export function SmartUpgradeBanner(props: Omit<SmartUpgradePromptProps, 'variant'>) {
  return <SmartUpgradePrompt {...props} variant="banner" />;
}

export function SmartUpgradeCard(props: Omit<SmartUpgradePromptProps, 'variant'>) {
  return <SmartUpgradePrompt {...props} variant="card" />;
}

export function SmartUpgradeSidebar(props: Omit<SmartUpgradePromptProps, 'variant'>) {
  return <SmartUpgradePrompt {...props} variant="sidebar" />;
}

export function SmartUpgradeFloating(props: Omit<SmartUpgradePromptProps, 'variant'>) {
  return <SmartUpgradePrompt {...props} variant="floating" />;
}