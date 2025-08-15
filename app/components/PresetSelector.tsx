'use client';
import React from 'react';
import { 
  Home, 
  Gem, 
  TrendingUp, 
  Building2, 
  Users, 
  Hammer,
  Sparkles,
  Wand2
} from 'lucide-react';

interface Preset {
  id: 'starter' | 'luxury' | 'investor' | 'condo' | 'family' | 'fixer';
  name: string;
  icon: React.ReactNode;
  description: string;
  bestFor: string;
}

const PRESETS: Preset[] = [
  {
    id: 'starter',
    name: 'Starter Home',
    icon: <Home className="h-4 w-4" />,
    description: 'First-time buyers, value focus',
    bestFor: 'Entry-level homes under $500K'
  },
  {
    id: 'luxury',
    name: 'Luxury Property',
    icon: <Gem className="h-4 w-4" />,
    description: 'Premium features, sophisticated tone',
    bestFor: 'High-end homes over $1M'
  },
  {
    id: 'investor',
    name: 'Investment',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'ROI focused, data-driven',
    bestFor: 'Rental properties, flips'
  },
  {
    id: 'condo',
    name: 'Urban Condo',
    icon: <Building2 className="h-4 w-4" />,
    description: 'City lifestyle, modern amenities',
    bestFor: 'Downtown condos, lofts'
  },
  {
    id: 'family',
    name: 'Family Home',
    icon: <Users className="h-4 w-4" />,
    description: 'Schools, community, warmth',
    bestFor: 'Suburban homes for families'
  },
  {
    id: 'fixer',
    name: 'Fixer-Upper',
    icon: <Hammer className="h-4 w-4" />,
    description: 'Potential focused, honest tone',
    bestFor: 'Properties needing renovation'
  }
];

interface PresetSelectorProps {
  onSelectPreset: (preset: Preset['id']) => void;
  className?: string;
}

export default function PresetSelector({ 
  onSelectPreset,
  className = ''
}: PresetSelectorProps) {
  const [showPresets, setShowPresets] = React.useState(false);
  
  return (
    <div className={`space-y-3 ${className}`}>
      {!showPresets ? (
        <button
          type="button"
          onClick={() => setShowPresets(true)}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 p-4 text-left transition hover:border-cyan-400/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 p-2">
                <Wand2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-white">Use Recommended Settings</div>
                <div className="text-xs text-white/60">Auto-configure based on property type</div>
              </div>
            </div>
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </div>
        </button>
      ) : (
        <div className="rounded-2xl border border-cyan-400/30 bg-neutral-900/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Choose Property Type</h3>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-xs text-white/60 hover:text-white"
            >
              Cancel
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onSelectPreset(preset.id);
                  setShowPresets(false);
                }}
                className="group rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-cyan-400/50 hover:bg-cyan-400/10"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-lg bg-white/10 p-1.5 group-hover:bg-cyan-400/20">
                    {preset.icon}
                  </div>
                  <div className="text-xs font-medium text-white">
                    {preset.name}
                  </div>
                </div>
                <div className="text-[10px] text-white/60 leading-tight">
                  {preset.description}
                </div>
                <div className="mt-1 text-[9px] text-cyan-400/60">
                  {preset.bestFor}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-3 rounded-lg bg-cyan-400/10 p-2">
            <div className="flex items-start gap-2">
              <Sparkles className="h-3 w-3 text-cyan-400 mt-0.5" />
              <div className="text-[10px] text-cyan-300/80">
                Settings will be optimized for your chosen property type including tone, channels, format, and marketing approach
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}