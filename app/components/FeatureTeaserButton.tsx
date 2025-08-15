'use client';
import React from 'react';
import { ArrowRight, Crown, Sparkles, Zap } from 'lucide-react';
import { getTierConfig } from '@/lib/tiers';

interface FeatureTeaserButtonProps {
  targetTier: string;
  onClick: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'minimal';
  fullWidth?: boolean;
  showIcon?: boolean;
  showPrice?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function FeatureTeaserButton({
  targetTier,
  onClick,
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  showIcon = true,
  showPrice = false,
  children,
  className = '',
  disabled = false
}: FeatureTeaserButtonProps) {
  const tierConfig = getTierConfig(targetTier);
  
  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-sm'
  };
  
  // Icon sizes
  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3 w-3', 
    md: 'h-4 w-4',
    lg: 'h-4 w-4'
  };
  
  // Variant styles
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl',
    outline: 'border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 hover:text-cyan-200',
    minimal: 'bg-white/10 hover:bg-white/20 text-white'
  };
  
  // Get appropriate icon for tier
  const getTierIcon = () => {
    switch (targetTier) {
      case 'PREMIUM':
      case 'TEAM':
        return Crown;
      case 'PROFESSIONAL':
        return Sparkles;
      case 'STARTER':
        return Zap;
      default:
        return ArrowRight;
    }
  };
  
  const TierIcon = getTierIcon();
  
  // Default text if no children provided
  const defaultText = children || (
    <>
      Upgrade to {tierConfig.displayName}
      {showPrice && tierConfig.price > 0 && (
        <span className="opacity-80"> (${tierConfig.price}/mo)</span>
      )}
    </>
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all
        ${sizeClasses[size]}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
        ${className}
      `}
      aria-label={`Upgrade to ${tierConfig.displayName} tier`}
    >
      {/* Tier Icon */}
      {showIcon && variant !== 'minimal' && (
        <TierIcon className={iconSizes[size]} />
      )}
      
      {/* Button Text */}
      <span className="flex items-center gap-1">
        {defaultText}
      </span>
      
      {/* Arrow Icon */}
      {showIcon && (
        <ArrowRight className={`${iconSizes[size]} ${variant === 'minimal' ? 'opacity-60' : ''}`} />
      )}
    </button>
  );
}

// Convenience components for common use cases
export function PrimaryUpgradeButton(props: Omit<FeatureTeaserButtonProps, 'variant'>) {
  return <FeatureTeaserButton {...props} variant="primary" />;
}

export function SecondaryUpgradeButton(props: Omit<FeatureTeaserButtonProps, 'variant'>) {
  return <FeatureTeaserButton {...props} variant="secondary" />;
}

export function OutlineUpgradeButton(props: Omit<FeatureTeaserButtonProps, 'variant'>) {
  return <FeatureTeaserButton {...props} variant="outline" />;
}

export function MinimalUpgradeButton(props: Omit<FeatureTeaserButtonProps, 'variant'>) {
  return <FeatureTeaserButton {...props} variant="minimal" showIcon={false} />;
}