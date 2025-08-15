"use client";
import React, { useState } from 'react';
import { Sparkles, Download, Settings, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export interface HeroImageFunctionalProps {
  onGenerate?: () => void;
  isGenerating?: boolean;
  className?: string;
}

// Overlay options for functional interface
const OVERLAY_OPTIONS = [
  { value: 'just_listed', label: 'Just Listed', description: 'Perfect for new listings' },
  { value: 'open_house', label: 'Open House', description: 'Drive attendance' },
  { value: 'price_reduced', label: 'Price Reduced', description: 'Highlight savings' },
  { value: 'pending', label: 'Pending', description: 'Under contract' },
  { value: 'sold', label: 'Sold', description: 'Celebrate success' },
  { value: 'coming_soon', label: 'Coming Soon', description: 'Build anticipation' }
];

const STYLE_OPTIONS = [
  { value: 'modern', label: 'Modern', color: 'blue' },
  { value: 'luxury', label: 'Luxury', color: 'yellow' },
  { value: 'minimal', label: 'Minimal', color: 'gray' },
  { value: 'bold', label: 'Bold', color: 'red' }
];

export default function HeroImageFunctional({ 
  onGenerate,
  isGenerating = false,
  className = ''
}: HeroImageFunctionalProps) {
  const [selectedOverlay, setSelectedOverlay] = useState('just_listed');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [customPrice, setCustomPrice] = useState('');
  const [customText, setCustomText] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate();
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg">
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="font-semibold text-cyan-300 flex items-center gap-2">
              Hero Image Generator
              <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                ACTIVE
              </span>
            </h4>
            <p className="text-xs text-white/60 mt-0.5">
              Generate professional overlays for all platforms
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 text-xs text-white/60 hover:text-white/80 transition-colors"
        >
          <Settings className="h-3 w-3" />
          {showAdvanced ? 'Simple' : 'Advanced'}
        </button>
      </div>

      {/* Overlay Type Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/90 block">
          Overlay Type:
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {OVERLAY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedOverlay(option.value)}
              disabled={isGenerating}
              className={`
                text-left p-3 rounded-lg border transition-all text-xs
                ${selectedOverlay === option.value
                  ? 'border-cyan-500/50 bg-cyan-500/10 ring-2 ring-cyan-500/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
                }
                ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="font-medium text-white/90 mb-1">{option.label}</div>
              <div className="text-white/60">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/90 block">
          Overlay Style:
        </label>
        
        <div className="grid grid-cols-4 gap-2">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              disabled={isGenerating}
              className={`
                p-2 rounded-lg border text-center transition-all text-xs
                ${selectedStyle === style.value
                  ? `border-${style.color}-500/50 bg-${style.color}-500/10`
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
                }
                ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className={`font-medium text-${style.color}-300`}>{style.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <h5 className="text-sm font-medium text-white/90">Advanced Options:</h5>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/70 block mb-1">
                Custom Price (optional):
              </label>
              <input
                type="text"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="$650,000"
                disabled={isGenerating}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder:text-white/40 focus:border-cyan-500/50 focus:outline-none disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="text-xs text-white/70 block mb-1">
                Custom Text (optional):
              </label>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="3BD | 2BA"
                disabled={isGenerating}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder:text-white/40 focus:border-cyan-500/50 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Platform Information */}
      <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl p-4 border border-cyan-500/20">
        <h5 className="text-sm font-medium text-cyan-300 mb-2 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Will generate for all platforms:
        </h5>
        <div className="flex flex-wrap gap-1">
          {['Facebook', 'Instagram', 'Stories', 'Email', 'Website', 'Print'].map(platform => (
            <span key={platform} className="bg-white/10 rounded px-2 py-1 text-white/60 text-xs">
              {platform}
            </span>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center pt-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`
            inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg
            ${isGenerating
              ? 'bg-gray-500/20 text-white/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white hover:shadow-cyan-500/25'
            }
          `}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Generating Hero Images...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Hero Images
            </>
          )}
        </button>
        
        {!isGenerating && (
          <p className="mt-2 text-xs text-white/60">
            AI will select the best photo and create professional overlays
          </p>
        )}
      </div>

      {/* Status Messages */}
      {isGenerating && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="text-sm">
            <div className="text-blue-300 font-medium">Processing your images...</div>
            <div className="text-white/60 text-xs mt-1">
              This may take 30-60 seconds depending on the number of photos
            </div>
          </div>
        </div>
      )}
    </div>
  );
}