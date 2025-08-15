"use client";
import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Layers, ArrowRight, Play, CheckCircle } from 'lucide-react';

export interface HeroImagePreviewProps {
  isLocked: boolean;
  onUpgrade?: (tier: string) => void;
  className?: string;
}

// Sample overlay styles for preview
const OVERLAY_STYLES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean & minimal',
    color: 'blue',
    preview: 'JUST LISTED',
    bgColor: 'bg-blue-500/90',
    textColor: 'text-white',
    borderColor: 'border-blue-500/20'
  },
  {
    id: 'luxury',
    name: 'Luxury', 
    description: 'Premium gold',
    color: 'yellow',
    preview: 'LUXURY LISTING',
    bgColor: 'bg-yellow-600/90',
    textColor: 'text-white',
    borderColor: 'border-yellow-500/20'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Subtle overlay',
    color: 'gray',
    preview: 'OPEN HOUSE',
    bgColor: 'bg-white/95',
    textColor: 'text-gray-900',
    borderColor: 'border-gray-500/20'
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Eye-catching',
    color: 'red',
    preview: 'PRICE REDUCED',
    bgColor: 'bg-red-500/90',
    textColor: 'text-white',
    borderColor: 'border-red-500/20'
  }
];

const PLATFORM_VARIANTS = [
  { name: 'Facebook', dimensions: '1200×630', icon: '📘' },
  { name: 'Instagram', dimensions: '1080×1080', icon: '📸' },
  { name: 'Stories', dimensions: '1080×1920', icon: '📱' },
  { name: 'Email', dimensions: '600×400', icon: '📧' },
  { name: 'Website', dimensions: '1920×1080', icon: '🌐' },
  { name: 'Print', dimensions: '8.5×11"', icon: '🖨️' }
];

const SAMPLE_FEATURES = [
  'Automatically selects best photo using AI vision',
  'Professional overlays for Just Listed, Open House, Sold',
  'Optimized dimensions for 6+ marketing platforms',
  'Saves 2+ hours of manual design work per listing'
];

export default function HeroImagePreview({ 
  isLocked, 
  onUpgrade, 
  className = '' 
}: HeroImagePreviewProps) {
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [showDemo, setShowDemo] = useState(false);

  const selectedStyleData = OVERLAY_STYLES.find(style => style.id === selectedStyle) || OVERLAY_STYLES[0];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with AI badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg">
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="font-semibold text-cyan-300 flex items-center gap-2">
              AI Hero Image Generator
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
                SMART
              </span>
            </h4>
            <p className="text-xs text-white/60 mt-0.5">
              Professional overlays for all marketing platforms
            </p>
          </div>
        </div>
        
        {isLocked && (
          <button 
            onClick={() => setShowDemo(!showDemo)}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Play className="h-3 w-3" />
            {showDemo ? 'Hide' : 'Demo'}
          </button>
        )}
      </div>

      {/* Interactive Demo Section */}
      {showDemo && (
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-4">
          <h5 className="text-sm font-medium text-white/90 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            How it works:
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="font-medium text-white/90 mb-1">AI Analysis</div>
              <div className="text-white/60">Scans all photos for best composition, lighting & appeal</div>
            </div>
            
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="font-medium text-white/90 mb-1">Smart Selection</div>
              <div className="text-white/60">Chooses hero image based on marketing impact</div>
            </div>
            
            <div className="text-center p-3 bg-white/5 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="font-medium text-white/90 mb-1">Multi-Platform</div>
              <div className="text-white/60">Generates optimized versions for all channels</div>
            </div>
          </div>
        </div>
      )}

      {/* Style Selection Preview */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-white/90 flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Professional Overlay Styles:
        </h5>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {OVERLAY_STYLES.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              disabled={isLocked}
              className={`
                rounded-lg border p-3 text-center transition-all text-xs
                ${selectedStyle === style.id 
                  ? `${style.borderColor} bg-${style.color}-500/10 ring-2 ring-${style.color}-500/20` 
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
                }
                ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
              `}
            >
              {/* Mini preview of overlay text */}
              <div className={`
                ${style.bgColor} ${style.textColor} 
                text-[10px] font-bold px-2 py-1 rounded mb-2 mx-auto w-fit
              `}>
                {style.preview}
              </div>
              <div className={`font-medium text-${style.color}-300`}>{style.name}</div>
              <div className="text-white/50">{style.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Platform Preview */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-white/90">
          Will generate optimized versions for:
        </h5>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {PLATFORM_VARIANTS.map((platform, idx) => (
            <div 
              key={platform.name}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10 text-xs"
            >
              <span className="text-base">{platform.icon}</span>
              <div>
                <div className="font-medium text-white/80">{platform.name}</div>
                <div className="text-white/50">{platform.dimensions}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits List */}
      <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl p-4 border border-cyan-500/20">
        <h5 className="text-sm font-medium text-cyan-300 mb-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          What you get:
        </h5>
        
        <div className="space-y-2">
          {SAMPLE_FEATURES.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <CheckCircle className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span className="text-white/80">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      {isLocked && onUpgrade && (
        <div className="text-center pt-2">
          <button
            onClick={() => onUpgrade('PROFESSIONAL')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
          >
            <Sparkles className="h-4 w-4" />
            Unlock Hero Image Generator
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-2 text-xs text-white/60">
            Available in Professional tier • Generate unlimited hero images
          </p>
        </div>
      )}
    </div>
  );
}