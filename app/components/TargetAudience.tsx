'use client';
import React, { useState } from 'react';
import { Users, Info, Check } from 'lucide-react';

interface TargetAudienceProps {
  selected: string[];
  onChange: (audiences: string[]) => void;
  maxSelections?: number;
  className?: string;
}

export interface AudienceOption {
  id: string;
  label: string;
  description: string;
  keywords: string[]; // Keywords that trigger this audience
}

const AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    id: 'first_time_buyers',
    label: 'First-time Buyers',
    description: 'New to homeownership, need guidance',
    keywords: ['starter', 'affordable', 'entry-level', 'first home'],
  },
  {
    id: 'growing_families',
    label: 'Growing Families',
    description: 'Need space, schools, family-friendly',
    keywords: ['family', 'schools', 'bedrooms', 'yard', 'safe'],
  },
  {
    id: 'empty_nesters',
    label: 'Empty Nesters',
    description: 'Downsizing, less maintenance',
    keywords: ['downsize', 'single-story', 'low maintenance', 'retirement'],
  },
  {
    id: 'investors',
    label: 'Investors',
    description: 'ROI focused, rental potential',
    keywords: ['investment', 'rental', 'cash flow', 'ROI', 'flip'],
  },
  {
    id: 'remote_workers',
    label: 'Remote Workers',
    description: 'Home office, good internet, flexible',
    keywords: ['office', 'remote', 'workspace', 'internet', 'quiet'],
  },
  {
    id: 'luxury_buyers',
    label: 'Luxury Buyers',
    description: 'High-end features, exclusivity',
    keywords: ['luxury', 'premium', 'high-end', 'exclusive', 'custom'],
  },
  {
    id: 'cash_buyers',
    label: 'Cash Buyers',
    description: 'Quick close, no financing',
    keywords: ['cash', 'quick close', 'as-is', 'immediate'],
  },
  {
    id: 'urban_professionals',
    label: 'Urban Professionals',
    description: 'Location, convenience, modern',
    keywords: ['downtown', 'walkable', 'transit', 'urban', 'convenient'],
  },
];

export default function TargetAudience({
  selected,
  onChange,
  maxSelections = 3,
  className = '',
}: TargetAudienceProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const toggleAudience = (audienceId: string) => {
    if (selected.includes(audienceId)) {
      onChange(selected.filter(id => id !== audienceId));
    } else if (selected.length < maxSelections) {
      onChange([...selected, audienceId]);
    }
  };

  const isSelected = (audienceId: string) => selected.includes(audienceId);
  const canSelectMore = selected.length < maxSelections;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-white/60" />
        <label className="text-sm text-white/80">Target Buyers</label>
        <span className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full">
          Select up to {maxSelections}
        </span>
        {selected.length > 0 && (
          <span className="text-xs text-white/60">
            ({selected.length} selected)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {AUDIENCE_OPTIONS.map(audience => {
          const selected = isSelected(audience.id);
          const disabled = !selected && !canSelectMore;

          return (
            <div
              key={audience.id}
              className="relative"
              onMouseEnter={() => setShowTooltip(audience.id)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <button
                type="button"
                onClick={() => toggleAudience(audience.id)}
                disabled={disabled}
                className={`
                  w-full flex items-center gap-2 p-2.5 rounded-xl border transition-all
                  ${selected
                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                    : disabled
                    ? 'border-white/5 bg-white/5 text-white/30 cursor-not-allowed'
                    : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <div className={`
                  w-4 h-4 rounded border flex items-center justify-center
                  ${selected ? 'bg-cyan-400 border-cyan-400' : 'border-white/30'}
                `}>
                  {selected && <Check className="h-3 w-3 text-black" />}
                </div>
                <span className="text-sm text-left flex-1">{audience.label}</span>
              </button>

              {/* Tooltip */}
              {showTooltip === audience.id && (
                <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-black/90 rounded-lg text-xs text-white/80 z-50 pointer-events-none">
                  <p className="font-semibold mb-1">{audience.label}</p>
                  <p className="text-white/60">{audience.description}</p>
                  <p className="text-cyan-400/60 mt-1">
                    Keywords: {audience.keywords.slice(0, 3).join(', ')}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Smart suggestions based on selections */}
      {selected.length > 0 && (
        <div className="mt-3 p-2 bg-white/5 rounded-xl">
          <p className="text-xs text-white/60">
            💡 Content will be optimized for:{' '}
            {selected
              .map(id => AUDIENCE_OPTIONS.find(a => a.id === id)?.label)
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to suggest audiences based on property data
export function suggestAudiences(
  propertyType: string,
  priceRange: string,
  features: string
): string[] {
  const suggestions: string[] = [];
  const lowerFeatures = features.toLowerCase();

  // Based on property type
  if (propertyType.toLowerCase().includes('starter')) {
    suggestions.push('first_time_buyers');
  }
  if (propertyType.toLowerCase().includes('luxury')) {
    suggestions.push('luxury_buyers');
  }
  if (propertyType.toLowerCase().includes('investment')) {
    suggestions.push('investors');
  }
  if (propertyType.toLowerCase().includes('condo')) {
    suggestions.push('urban_professionals');
  }

  // Based on features
  if (lowerFeatures.includes('school') || lowerFeatures.includes('yard')) {
    suggestions.push('growing_families');
  }
  if (lowerFeatures.includes('office') || lowerFeatures.includes('workspace')) {
    suggestions.push('remote_workers');
  }
  if (lowerFeatures.includes('downtown') || lowerFeatures.includes('walkable')) {
    suggestions.push('urban_professionals');
  }
  if (lowerFeatures.includes('single story') || lowerFeatures.includes('low maintenance')) {
    suggestions.push('empty_nesters');
  }

  // Based on price (you'd need to parse price range)
  if (priceRange === 'under_300k') {
    suggestions.push('first_time_buyers');
  }
  if (priceRange === '800k_plus') {
    suggestions.push('luxury_buyers');
  }

  // Return unique suggestions (max 3)
  return [...new Set(suggestions)].slice(0, 3);
}