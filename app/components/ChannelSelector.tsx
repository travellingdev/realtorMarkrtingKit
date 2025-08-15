'use client';
import React from 'react';
import { 
  FileText, 
  Instagram, 
  Video, 
  Mail, 
  Facebook,
  Lock,
  Check
} from 'lucide-react';
import { canUseFeature } from '@/lib/tiers';

interface Channel {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  tierRequired?: string;
}

const CHANNELS: Channel[] = [
  {
    id: 'mls',
    name: 'MLS Description',
    icon: <FileText className="h-4 w-4" />,
    description: 'Professional MLS listing copy'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <Instagram className="h-4 w-4" />,
    description: 'Carousel slides for Instagram',
    tierRequired: 'STARTER'
  },
  {
    id: 'reel',
    name: 'Reels/TikTok',
    icon: <Video className="h-4 w-4" />,
    description: 'Short-form video script',
    tierRequired: 'PROFESSIONAL'
  },
  {
    id: 'email',
    name: 'Email',
    icon: <Mail className="h-4 w-4" />,
    description: 'Email campaign copy'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook className="h-4 w-4" />,
    description: 'Facebook post content',
    tierRequired: 'PROFESSIONAL'
  }
];

interface ChannelSelectorProps {
  selected: string[];
  onChange: (channels: string[]) => void;
  userTier?: string;
  freeKitsUsed?: number;
  freeLimit?: number;
  onBlockedAttempt?: (feature: string) => void;
  className?: string;
}

export default function ChannelSelector({ 
  selected, 
  onChange, 
  userTier = 'FREE',
  freeKitsUsed = 0,
  freeLimit = 0,
  onBlockedAttempt,
  className = ''
}: ChannelSelectorProps) {
  // Check if user has free kits remaining
  const hasFreeKitsRemaining = freeKitsUsed < freeLimit;
  const toggleChannel = (channelId: string) => {
    const channel = CHANNELS.find(c => c.id === channelId);
    
    // Allow all channels if user has free kits remaining
    if (hasFreeKitsRemaining) {
      // User can use all channels during free trial
      if (selected.includes(channelId)) {
        onChange(selected.filter(id => id !== channelId));
      } else {
        onChange([...selected, channelId]);
      }
      return;
    }
    
    // Check if channel is locked for current tier
    if (channel?.tierRequired && !canUseFeature(userTier, 'allPlatforms')) {
      // Track blocked feature attempt
      if (onBlockedAttempt) {
        onBlockedAttempt('allPlatforms');
      }
      return;
    }
    
    if (selected.includes(channelId)) {
      onChange(selected.filter(id => id !== channelId));
    } else {
      onChange([...selected, channelId]);
    }
  };

  const isChannelLocked = (channel: Channel) => {
    // All channels available during free trial
    if (hasFreeKitsRemaining) return false;
    
    if (!channel.tierRequired) return false;
    
    // For FREE tier, lock all premium channels
    if (userTier === 'FREE' && channel.tierRequired) return true;
    
    // For STARTER tier, lock PROFESSIONAL features
    if (userTier === 'STARTER' && channel.tierRequired === 'PROFESSIONAL') return true;
    
    return false;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm text-white/80">
            Select Content Channels
          </label>
          {hasFreeKitsRemaining && (
            <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full">
              All channels available ({freeLimit - freeKitsUsed} free kits left)
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            // Select all available channels
            const available = CHANNELS
              .filter(c => !isChannelLocked(c))
              .map(c => c.id);
            onChange(available);
          }}
          className="text-xs text-cyan-400 hover:text-cyan-300"
        >
          Select All Available
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CHANNELS.map((channel) => {
          const isSelected = selected.includes(channel.id);
          const isLocked = isChannelLocked(channel);
          
          return (
            <button
              key={channel.id}
              type="button"
              onClick={() => toggleChannel(channel.id)}
              disabled={isLocked}
              className={`
                relative rounded-xl border p-3 transition-all
                ${isLocked 
                  ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed' 
                  : isSelected
                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                    : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10'
                }
              `}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1">
                  {channel.icon}
                  {isLocked && <Lock className="h-3 w-3 text-yellow-400" />}
                  {isSelected && !isLocked && <Check className="h-3 w-3 text-cyan-400" />}
                </div>
                <div className="text-xs font-medium">
                  {channel.name}
                </div>
                <div className="text-[10px] text-white/60 text-center leading-tight">
                  {channel.description}
                </div>
              </div>
              
              {/* Show lock icon for locked channels */}
              {isLocked && channel.tierRequired && (
                <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-yellow-400/20 text-yellow-400 text-[9px] font-medium rounded-full">
                  {channel.tierRequired}
                </div>
              )}
              
              {/* Show FREE TRIAL badge for premium channels available during trial */}
              {!isLocked && hasFreeKitsRemaining && channel.tierRequired && (
                <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-cyan-400/20 text-cyan-400 text-[9px] font-medium rounded-full animate-pulse">
                  FREE TRIAL
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {selected.length === 0 && (
        <p className="text-xs text-red-400/80 text-center">
          Please select at least one content channel
        </p>
      )}
    </div>
  );
}