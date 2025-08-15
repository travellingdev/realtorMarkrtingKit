"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Wand2, ChevronDown } from 'lucide-react';
import ContentTypeSelector_v2 from './ContentTypeSelector_v2';
import PhotoUploadWithPreview from './PhotoUploadWithPreview';
import { detectPersona, getPersonaContentStrategy, type RealtorPersona } from '@/lib/personaDetector';

// Essential fields only - everything else becomes smart defaults
interface EssentialFields {
  address: string;
  propertyType: string;
  priceRange: string;
  keyFeature: string;
  photos: File[];
}

interface InstantDemoFormV2Props {
  // Essential fields
  address: string;
  setAddress: (v: string) => void;
  photos: File[];
  setPhotos: (v: File[]) => void;
  
  // Generated from smart defaults
  onSmartGenerate: (essentials: EssentialFields, contentTypes: string[], persona: RealtorPersona) => void;
  onUseSample: () => void;
  
  // UI state
  isGenerating?: boolean;
  generationStage?: 'uploading' | 'analyzing' | 'selecting' | 'generating' | 'complete';
  userTier?: string;
  onUpgrade?: (tier: string) => void;
  onBlockedAttempt?: (feature: string) => void;
}

// Smart property type options with auto-detection hints
const PROPERTY_TYPES = [
  { value: 'starter_home', label: 'Family Home (3-4BR)', priceHint: '$300-600K', features: ['family', 'schools', 'yard'] },
  { value: 'luxury_home', label: 'Luxury Home (4-6BR)', priceHint: '$600K+', features: ['luxury', 'premium', 'high-end'] },
  { value: 'condo_townhome', label: 'Condo/Townhome', priceHint: '$200-500K', features: ['urban', 'maintenance-free', 'amenities'] },
  { value: 'starter_condo', label: 'Starter Condo/Apartment', priceHint: '$150-350K', features: ['affordable', 'first-time', 'investment'] },
  { value: 'investment_property', label: 'Investment/Rental Property', priceHint: 'Any', features: ['ROI', 'cash flow', 'rental'] },
  { value: 'fixer_upper', label: 'Fixer-Upper/Renovation', priceHint: 'Below market', features: ['potential', 'renovation', 'value-add'] }
];

const PRICE_RANGES = [
  { value: 'under_300k', label: 'Under $300K', buyer: 'First-time buyers' },
  { value: '300k_500k', label: '$300K - $500K', buyer: 'Growing families' }, 
  { value: '500k_800k', label: '$500K - $800K', buyer: 'Move-up buyers' },
  { value: '800k_plus', label: '$800K+', buyer: 'Luxury buyers' },
  { value: 'varies', label: 'Varies/Multiple units', buyer: 'Investors' }
];

function SmartField({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder,
  hint,
  options,
  required = false 
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'select';
  placeholder?: string;
  hint?: string;
  options?: Array<{ value: string; label: string; [key: string]: any }>;
  required?: boolean;
}) {
  if (type === 'select' && options) {
    return (
      <div className="space-y-2">
        <label className="block">
          <div className="text-sm text-white/80 mb-2">
            {label} {required && <span className="text-red-400">*</span>}
          </div>
          <div className="relative">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-cyan-400/60 appearance-none text-white"
              required={required}
            >
              <option value="" className="bg-neutral-950">Choose an option...</option>
              {options.map((option) => (
                <option key={option.value} value={option.value} className="bg-neutral-950">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 pointer-events-none" />
          </div>
        </label>
        {hint && <p className="text-xs text-white/60">{hint}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block">
        <div className="text-sm text-white/80 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="text"
          placeholder={placeholder}
          className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
          required={required}
        />
      </label>
      {hint && <p className="text-xs text-white/60">{hint}</p>}
    </div>
  );
}

function getGenerationMessage(stage?: 'uploading' | 'analyzing' | 'selecting' | 'generating' | 'complete'): string {
  switch (stage) {
    case 'uploading':
      return 'Uploading photos...';
    case 'analyzing':
      return 'Reading your photos...';
    case 'selecting':
      return 'Applying smart defaults...';
    case 'generating':
      return 'Creating your content...';
    case 'complete':
      return 'Finalizing...';
    default:
      return 'Generating...';
  }
}

export default function InstantDemoForm_v2(props: InstantDemoFormV2Props) {
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [keyFeature, setKeyFeature] = useState("");
  const [contentTypes, setContentTypes] = useState<string[]>(['listing_package']); // Default selection
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [persona, setPersona] = useState<RealtorPersona>('experienced');

  // Auto-detect persona on mount
  useEffect(() => {
    const detected = detectPersona({
      url: window.location.pathname + window.location.search,
    });
    setPersona(detected.persona);

    // Set smart defaults based on persona
    const strategy = getPersonaContentStrategy(detected.persona);
    if (strategy.defaultChannels) {
      // Auto-select appropriate content types based on persona
      const defaultContentTypes = detected.persona === 'new_agent' 
        ? ['listing_package']
        : detected.persona === 'luxury'
        ? ['listing_package', 'buyer_attraction'] 
        : ['listing_package'];
      
      setContentTypes(defaultContentTypes);
    }
  }, []);

  const handleSmartGenerate = () => {
    const essentials: EssentialFields = {
      address: props.address,
      propertyType,
      priceRange,
      keyFeature,
      photos: props.photos
    };

    props.onSmartGenerate(essentials, contentTypes, persona);
  };

  const canGenerate = propertyType && priceRange && contentTypes.length > 0;

  // Get contextual help based on selections
  const getContextualHelp = () => {
    if (!propertyType || !priceRange) {
      return "Select property type and price range to see personalized content options";
    }
    
    const selectedType = PROPERTY_TYPES.find(t => t.value === propertyType);
    const selectedPrice = PRICE_RANGES.find(p => p.value === priceRange);
    
    return `Perfect! Creating content for ${selectedType?.label.toLowerCase()} targeting ${selectedPrice?.buyer.toLowerCase()}`;
  };

  return (
    <div className="space-y-6">
      {/* Simplified Essential Form */}
      <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h3 className="text-lg font-semibold">Tell us about your listing</h3>
          <span className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded-full">
            30 seconds
          </span>
        </div>

        <div className="space-y-4">
          {/* Row 1: Address (optional) + Property Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <SmartField
              label="Property Address"
              value={props.address}
              onChange={props.setAddress}
              placeholder="123 Main St (optional)"
              hint="Helps personalize neighborhood references"
            />
            <SmartField
              label="Property Type"
              value={propertyType}
              onChange={setPropertyType}
              type="select"
              options={PROPERTY_TYPES}
              required
              hint="This determines your content strategy"
            />
          </div>

          {/* Row 2: Price Range + Key Feature */}
          <div className="grid md:grid-cols-2 gap-4">
            <SmartField
              label="Price Range"
              value={priceRange}
              onChange={setPriceRange}
              type="select"
              options={PRICE_RANGES}
              required
              hint="Helps target the right buyers"
            />
            <SmartField
              label="Best Feature"
              value={keyFeature}
              onChange={setKeyFeature}
              placeholder="Chef's kitchen, Great location, Pool..."
              hint="What makes this property special?"
            />
          </div>

          {/* Photos */}
          <div>
            <PhotoUploadWithPreview
              photos={props.photos}
              setPhotos={props.setPhotos}
              userTier={props.userTier || 'FREE'}
              onUpgrade={props.onUpgrade}
              onBlockedAttempt={props.onBlockedAttempt}
            />
          </div>
        </div>

        {/* Contextual Help */}
        <div className="mt-4 p-3 bg-white/5 rounded-xl">
          <p className="text-xs text-white/70">
            💡 {getContextualHelp()}
          </p>
        </div>
      </div>

      {/* Content Type Selection */}
      <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6">
        <ContentTypeSelector_v2
          selected={contentTypes}
          onChange={setContentTypes}
          userPersona={persona}
        />
      </div>

      {/* Advanced Options (Collapsed by Default) */}
      <div className="rounded-3xl border border-white/10 bg-neutral-900/60">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-white/60" />
            <span className="text-sm font-medium text-white">Fine-tune Your Content</span>
            <span className="text-xs text-white/40">(Optional)</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>
        
        {showAdvanced && (
          <div className="border-t border-white/10 p-6">
            <div className="text-center py-8 text-white/60">
              <p>Advanced customization options would go here</p>
              <p className="text-xs mt-2">(Brand voice, specific channels, advanced settings, etc.)</p>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="flex flex-wrap items-center gap-4">
        <button 
          onClick={handleSmartGenerate}
          disabled={!canGenerate || props.isGenerating}
          className={`
            inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition-all
            ${canGenerate && !props.isGenerating
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl"
              : "bg-white/20 text-white/60 cursor-not-allowed"
            }
          `}
        >
          {props.isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {getGenerationMessage(props.generationStage)}
            </div>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Create My Content ({contentTypes.length} type{contentTypes.length > 1 ? 's' : ''})
            </>
          )}
        </button>

        <button 
          onClick={props.onUseSample}
          disabled={props.isGenerating}
          className="text-white/80 hover:text-white underline underline-offset-4 disabled:opacity-50"
        >
          See a sample first
        </button>

        {canGenerate && (
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Clock className="h-3 w-3" />
            ~2 minutes to complete
          </div>
        )}
      </div>

      {/* Smart Defaults Info */}
      {canGenerate && (
        <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-xl">
          <div className="flex items-start gap-2">
            <Wand2 className="h-4 w-4 text-cyan-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-cyan-300">Smart defaults applied</p>
              <p className="text-xs text-cyan-200/80 mt-1">
                We&rsquo;ll automatically configure tone, channels, and formatting based on your property type and target buyers. 
                You can always customize after generation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}