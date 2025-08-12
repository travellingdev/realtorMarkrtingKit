"use client";
import React from 'react';
import { Crown, Star, Zap, Users } from 'lucide-react';
import { getTierConfig } from '@/lib/tiers';

interface TierBadgeProps {
  tier: string;
  className?: string;
  showPrice?: boolean;
}

const TIER_ICONS = {
  FREE: null,
  STARTER: Zap,
  PROFESSIONAL: Star,
  PREMIUM: Crown,
  TEAM: Users,
};

const TIER_COLORS = {
  FREE: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  STARTER: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  PROFESSIONAL: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  PREMIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  TEAM: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export default function TierBadge({ tier, className = '', showPrice = false }: TierBadgeProps) {
  const config = getTierConfig(tier);
  const Icon = TIER_ICONS[tier as keyof typeof TIER_ICONS];
  const colors = TIER_COLORS[tier as keyof typeof TIER_COLORS] || TIER_COLORS.FREE;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-sm font-medium ${colors} ${className}`}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span>{config.displayName}</span>
      {showPrice && config.price > 0 && (
        <span className="text-xs opacity-75">
          ${config.price}/mo
        </span>
      )}
    </div>
  );
}