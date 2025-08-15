'use client';
import React, { useState, useEffect } from 'react';
import { Home, Users, MapPin } from 'lucide-react';
import ComplianceBar from './ComplianceBar';
import TargetAudience, { suggestAudiences } from './TargetAudience';
import ChallengeReframing from './ChallengeReframing';
import FeaturePriority from './FeaturePriority';
import QualityDashboard, { calculateQualityScore } from './QualityDashboard';
import PhotoUploadWithPreview from './PhotoUploadWithPreview';
import ChannelSelector from './ChannelSelector';
import AdvancedSettings_v2 from './AdvancedSettings_v2';

interface PropertyType {
  id: string;
  label: string;
  description: string;
  targetPrice: string;
}

const PROPERTY_TYPES: PropertyType[] = [
  {
    id: 'single_family',
    label: 'Single Family Home',
    description: 'Traditional houses with yards',
    targetPrice: '$200K - $2M+',
  },
  {
    id: 'luxury_estate',
    label: 'Luxury Estate',
    description: 'High-end properties $800K+',
    targetPrice: '$800K+',
  },
  {
    id: 'condo_townhome',
    label: 'Condo/Townhome',
    description: 'Shared-wall properties',
    targetPrice: '$150K - $600K',
  },
  {
    id: 'starter_home',
    label: 'Starter/Entry-Level',
    description: 'First-time buyer focused',
    targetPrice: '$100K - $400K',
  },
  {
    id: 'investment_property',
    label: 'Investment Property',
    description: 'Rental/flip opportunities',
    targetPrice: 'Varies',
  },
  {
    id: 'vacant_land',
    label: 'Vacant Land',
    description: 'Buildable lots and acreage',
    targetPrice: 'Varies',
  },
];

interface EnhancedFormProps {
  // Basic property info
  address: string;
  setAddress: (v: string) => void;
  neighborhood: string;
  setNeighborhood: (v: string) => void;
  beds: string;
  setBeds: (v: string) => void;
  baths: string;
  setBaths: (v: string) => void;
  sqft: string;
  setSqft: (v: string) => void;
  
  // Photos
  photos: File[];
  setPhotos: (v: File[]) => void;
  
  // New enhanced fields
  propertyType: string;
  setPropertyType: (v: string) => void;
  targetAudience: string[];
  setTargetAudience: (v: string[]) => void;
  challenges: string[];
  setChallenges: (v: string[]) => void;
  priorityFeatures: Array<{ id: string; value: string; priority: number }>;
  setPriorityFeatures: (v: Array<{ id: string; value: string; priority: number }>) => void;
  mlsCompliance: string;
  setMLSCompliance: (v: string) => void;
  
  // Existing fields
  tone: string;
  setTone: (v: string) => void;
  channels: string[];
  setChannels: (v: string[]) => void;
  brandVoice: string;
  setBrandVoice: (v: string) => void;
  
  // New enhanced advanced settings
  schoolDistrict: string;
  setSchoolDistrict: (v: string) => void;
  walkScore: string;
  setWalkScore: (v: string) => void;
  distanceToDowntown: string;
  setDistanceToDowntown: (v: string) => void;
  nearbyAmenities: string[];
  setNearbyAmenities: (v: string[]) => void;
  mlsLength: number;
  setMLSLength: (v: number) => void;
  emailLength: number;
  setEmailLength: (v: number) => void;
  socialLength: number;
  setSocialLength: (v: number) => void;
  
  // Existing advanced settings
  openHouseDate: string;
  setOpenHouseDate: (v: string) => void;
  openHouseTime: string;
  setOpenHouseTime: (v: string) => void;
  openHouseLink: string;
  setOpenHouseLink: (v: string) => void;
  ctaType: string;
  setCtaType: (v: string) => void;
  ctaPhone: string;
  setCtaPhone: (v: string) => void;
  ctaLink: string;
  setCtaLink: (v: string) => void;
  ctaCustom: string;
  setCtaCustom: (v: string) => void;
  socialHandle: string;
  setSocialHandle: (v: string) => void;
  hashtagStrategy: string;
  setHashtagStrategy: (v: string) => void;
  extraHashtags: string;
  setExtraHashtags: (v: string) => void;
  readingLevel: string;
  setReadingLevel: (v: string) => void;
  useEmojis: boolean;
  setUseEmojis: (v: boolean) => void;
  mlsFormat: string;
  setMlsFormat: (v: string) => void;
  mustInclude: string;
  setMustInclude: (v: string) => void;
  avoidWords: string;
  setAvoidWords: (v: string) => void;
  
  // Actions
  onGenerate: () => void;
  onUseSample: () => void;
  isGenerating?: boolean;
  userTier?: string;
  kitsUsed?: number;
  onUpgrade?: (tier: string) => void;
  onBlockedAttempt?: (feature: string) => void;
  freeKitsUsed?: number;
  freeLimit?: number;
}

export default function EnhancedForm(props: EnhancedFormProps) {
  const [qualityScore, setQualityScore] = useState(0);
  
  // Destructure props for useEffect
  const { propertyType, targetAudience, priorityFeatures, setTargetAudience } = props;

  // Auto-suggest audiences when property type changes
  useEffect(() => {
    if (propertyType && targetAudience.length === 0) {
      const suggestions = suggestAudiences(
        propertyType, 
        '', // priceRange 
        priorityFeatures.map(f => f.value).join(', ')
      );
      if (suggestions.length > 0) {
        setTargetAudience(suggestions);
      }
    }
  }, [propertyType, priorityFeatures, targetAudience.length, setTargetAudience]);

  // Calculate quality score
  useEffect(() => {
    const checks = {
      mlsCompliance: true, // Assuming compliance is good if MLS selected
      mlsSelected: !!props.mlsCompliance,
      targetAudience: props.targetAudience.length > 0,
      hasFeatures: props.priorityFeatures.length > 0,
      hasPhotos: props.photos.length > 0,
      hasChallenges: props.challenges.length > 0,
      hasAddress: !!props.address,
      hasBrandVoice: !!props.brandVoice,
      propertyTypeSelected: !!props.propertyType,
      channelsSelected: props.channels.length > 0,
    };
    
    const score = calculateQualityScore(checks);
    setQualityScore(score);
  }, [
    props.mlsCompliance,
    props.targetAudience,
    props.priorityFeatures,
    props.photos,
    props.challenges,
    props.address,
    props.brandVoice,
    props.propertyType,
    props.channels,
  ]);

  const LabeledInput = ({ label, value, onChange, type = "text", placeholder, required = false }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }) => (
    <label className="block">
      <div className="text-sm text-white/80 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
      />
    </label>
  );

  return (
    <div className="space-y-6">
      {/* MLS Compliance Bar - Always at top */}
      <ComplianceBar
        selectedMLS={props.mlsCompliance}
        onMLSChange={props.setMLSCompliance}
      />

      {/* Main form content */}
      <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6">
        
        {/* Section 1: Basic Property Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Home className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-semibold">Property Details</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <LabeledInput 
              label="Address" 
              value={props.address} 
              onChange={props.setAddress} 
              placeholder="1420 Brookfield Ave"
            />
            <LabeledInput 
              label="Neighborhood" 
              value={props.neighborhood} 
              onChange={props.setNeighborhood} 
              placeholder="Brookfield"
            />
            <LabeledInput 
              label="Beds" 
              value={props.beds} 
              onChange={props.setBeds} 
              type="number" 
              placeholder="3"
            />
            <LabeledInput 
              label="Baths" 
              value={props.baths} 
              onChange={props.setBaths} 
              type="number" 
              placeholder="2"
            />
            <LabeledInput 
              label="Square Feet" 
              value={props.sqft} 
              onChange={props.setSqft} 
              type="number" 
              placeholder="1850"
            />
            
            {/* Enhanced Property Type Dropdown */}
            <div>
              <label className="block">
                <div className="text-sm text-white/80 mb-2">
                  Property Type <span className="text-red-400">*</span>
                </div>
                <select
                  value={props.propertyType}
                  onChange={(e) => props.setPropertyType(e.target.value)}
                  required
                  className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
                >
                  <option value="">Select property type...</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.label} ({type.targetPrice})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Features with Priority */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <FeaturePriority
            features={props.priorityFeatures}
            onChange={props.setPriorityFeatures}
            propertyType={props.propertyType}
            maxFeatures={6}
          />
        </div>

        {/* Section 3: Photos */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <PhotoUploadWithPreview
            photos={props.photos}
            setPhotos={props.setPhotos}
            userTier={props.userTier || 'FREE'}
            kitsUsed={props.kitsUsed || 0}
            onUpgrade={props.onUpgrade}
            onBlockedAttempt={props.onBlockedAttempt}
          />
        </div>

        {/* Section 4: Target Audience */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold">Marketing Strategy</h3>
          </div>
          
          <TargetAudience
            selected={props.targetAudience}
            onChange={props.setTargetAudience}
            maxSelections={3}
          />
        </div>

        {/* Section 5: Challenge Reframing */}
        <div className="mt-6">
          <ChallengeReframing
            challenges={props.challenges}
            onChange={props.setChallenges}
            propertyType={props.propertyType}
            features={props.priorityFeatures.map(f => f.value).join(', ')}
          />
        </div>

        {/* Section 6: Tone & Channels */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="space-y-4">
            {/* Tone Selection */}
            <div>
              <label className="block">
                <div className="text-sm text-white/80 mb-2">Content Tone</div>
                <select
                  value={props.tone}
                  onChange={(e) => props.setTone(e.target.value)}
                  className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
                >
                  <option value="Warm & Lifestyle">Warm & Lifestyle</option>
                  <option value="Professional">Professional</option>
                  <option value="Concise MLS">Concise MLS</option>
                  <option value="Hype for Social">Hype for Social</option>
                  <option value="Data-driven">Data-driven</option>
                </select>
              </label>
            </div>

            {/* Channel Selector */}
            <ChannelSelector
              selected={props.channels}
              onChange={props.setChannels}
              userTier={props.userTier}
              freeKitsUsed={props.freeKitsUsed}
              freeLimit={props.freeLimit}
              onBlockedAttempt={props.onBlockedAttempt}
            />
          </div>
        </div>

        {/* Quality Dashboard */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <QualityDashboard
            checks={{
              mlsCompliance: true,
              mlsSelected: !!props.mlsCompliance,
              targetAudience: props.targetAudience.length > 0,
              hasFeatures: props.priorityFeatures.length > 0,
              hasPhotos: props.photos.length > 0,
              hasChallenges: props.challenges.length > 0,
              hasAddress: !!props.address,
              hasBrandVoice: !!props.brandVoice,
              propertyTypeSelected: !!props.propertyType,
              channelsSelected: props.channels.length > 0,
            }}
          />
        </div>

        {/* Enhanced Advanced Settings */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <AdvancedSettings_v2
            // Neighborhood Context
            schoolDistrict={props.schoolDistrict}
            setSchoolDistrict={props.setSchoolDistrict}
            walkScore={props.walkScore}
            setWalkScore={props.setWalkScore}
            distanceToDowntown={props.distanceToDowntown}
            setDistanceToDowntown={props.setDistanceToDowntown}
            nearbyAmenities={props.nearbyAmenities}
            setNearbyAmenities={props.setNearbyAmenities}
            
            // Output Length Controls
            mlsLength={props.mlsLength}
            setMLSLength={props.setMLSLength}
            emailLength={props.emailLength}
            setEmailLength={props.setEmailLength}
            socialLength={props.socialLength}
            setSocialLength={props.setSocialLength}
            
            // Existing settings
            openHouseDate={props.openHouseDate}
            setOpenHouseDate={props.setOpenHouseDate}
            openHouseTime={props.openHouseTime}
            setOpenHouseTime={props.setOpenHouseTime}
            openHouseLink={props.openHouseLink}
            setOpenHouseLink={props.setOpenHouseLink}
            ctaType={props.ctaType}
            setCtaType={props.setCtaType}
            ctaPhone={props.ctaPhone}
            setCtaPhone={props.setCtaPhone}
            ctaLink={props.ctaLink}
            setCtaLink={props.setCtaLink}
            ctaCustom={props.ctaCustom}
            setCtaCustom={props.setCtaCustom}
            socialHandle={props.socialHandle}
            setSocialHandle={props.setSocialHandle}
            hashtagStrategy={props.hashtagStrategy}
            setHashtagStrategy={props.setHashtagStrategy}
            extraHashtags={props.extraHashtags}
            setExtraHashtags={props.setExtraHashtags}
            readingLevel={props.readingLevel}
            setReadingLevel={props.setReadingLevel}
            useEmojis={props.useEmojis}
            setUseEmojis={props.setUseEmojis}
            mlsFormat={props.mlsFormat}
            setMlsFormat={props.setMlsFormat}
            mustInclude={props.mustInclude}
            setMustInclude={props.setMustInclude}
            avoidWords={props.avoidWords}
            setAvoidWords={props.setAvoidWords}
            brandVoice={props.brandVoice}
            setBrandVoice={props.setBrandVoice}
          />
        </div>

        {/* Generation Buttons */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={props.onGenerate}
              disabled={!props.propertyType || props.isGenerating}
              className={`
                inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold transition-all
                ${props.propertyType && !props.isGenerating
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl"
                  : "bg-white/20 text-white/60 cursor-not-allowed"
                }
              `}
            >
              {props.isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </div>
              ) : (
                `Generate Content (${qualityScore}% optimized)`
              )}
            </button>

            <button 
              onClick={props.onUseSample}
              disabled={props.isGenerating}
              className="text-white/80 hover:text-white underline underline-offset-4 disabled:opacity-50"
            >
              Use a sample listing instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}