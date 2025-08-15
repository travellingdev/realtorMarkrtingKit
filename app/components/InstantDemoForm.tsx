"use client";
import React from 'react';
import { Image as ImageIcon, Crown, Lock } from 'lucide-react';
import { canUseFeature } from '@/lib/tiers';
import ChannelSelector from './ChannelSelector';
import PresetSelector from './PresetSelector';
import AdvancedSettings from './AdvancedSettings';
import PhotoUploadWithPreview from './PhotoUploadWithPreview';

type InstantDemoFormProps = {
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
  features: string;
  setFeatures: (v: string) => void;
  photos: File[];
  setPhotos: (v: File[]) => void;
  propertyTemplates: readonly string[];
  tones: readonly string[];
  propertyType: string;
  setPropertyType: (v: string) => void;
  tone: string;
  setTone: (v: string) => void;
  brandVoice: string;
  setBrandVoice: (v: string) => void;
  channels: string[];
  setChannels: (v: string[]) => void;
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
  onGenerate: () => void;
  onUseSample: () => void;
  onApplyPreset?: (preset: 'starter' | 'luxury' | 'investor' | 'condo' | 'family' | 'fixer') => void;
  isGenerating?: boolean;
  generationStage?: 'uploading' | 'analyzing' | 'selecting' | 'generating' | 'complete';
  userTier?: string;
  onUpgrade?: (tier: string) => void;
  onBlockedAttempt?: (feature: string) => void;
  freeKitsUsed?: number;
  freeLimit?: number;
  isLoggedIn?: boolean;
  buttonState?: { enabled: boolean; text: string; requiresAuth: boolean };
};

function LabeledInput({ label, value, onChange, type = "text", placeholder }:{label:string; value:string; onChange:(v:string)=>void; type?:string; placeholder?:string;}){
  return (
    <label className="block">
      <div className="text-sm text-white/80">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
      />
    </label>
  );
}

function ChipGroup({ label, options, value, onChange }:{label:string; options:readonly string[]; value:string; onChange:(v:string)=>void;}){
  return (
    <div>
      <div className="text-sm text-white/80">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={
              "rounded-2xl border px-3 py-1.5 text-sm transition " +
              (value === opt
                ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                : "border-white/10 bg-white/5 text-white/80 hover:text-white")
            }
          >
            {opt}
          </button>
        ))}
      </div>
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
      return 'Choosing best marketing photo...';
    case 'generating':
      return 'Creating your marketing kit...';
    case 'complete':
      return 'Finalizing...';
    default:
      return 'Generating...';
  }
}

export default function InstantDemoForm(props: InstantDemoFormProps){
  const {
    address, setAddress,
    neighborhood, setNeighborhood,
    beds, setBeds,
    baths, setBaths,
    sqft, setSqft,
    features, setFeatures,
    photos, setPhotos,
    propertyTemplates, tones,
    propertyType, setPropertyType,
    tone, setTone,
    brandVoice, setBrandVoice,
    channels, setChannels,
    openHouseDate, setOpenHouseDate,
    openHouseTime, setOpenHouseTime,
    openHouseLink, setOpenHouseLink,
    ctaType, setCtaType,
    ctaPhone, setCtaPhone,
    ctaLink, setCtaLink,
    ctaCustom, setCtaCustom,
    socialHandle, setSocialHandle,
    hashtagStrategy, setHashtagStrategy,
    extraHashtags, setExtraHashtags,
    readingLevel, setReadingLevel,
    useEmojis, setUseEmojis,
    mlsFormat, setMlsFormat,
    mustInclude, setMustInclude,
    avoidWords, setAvoidWords,
    onGenerate, onUseSample, onApplyPreset,
    isGenerating,
  } = props;

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-neutral-900/60 p-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <LabeledInput label="Address (optional)" value={address} onChange={setAddress} placeholder="1420 Brookfield Ave" />
        <LabeledInput label="Neighborhood" value={neighborhood} onChange={setNeighborhood} placeholder="Brookfield" />
        <LabeledInput label="Beds" value={beds} onChange={setBeds} type="number" placeholder="3" />
        <LabeledInput label="Baths" value={baths} onChange={setBaths} type="number" placeholder="2" />
        <LabeledInput label="Square Feet" value={sqft} onChange={setSqft} type="number" placeholder="1850" />
        <LabeledInput label="Key features (comma-separated)" value={features} onChange={setFeatures} placeholder="Chef's kitchen, Wide-plank floors, EV garage" />
      </div>

      {/* Smart Defaults Selector */}
      {onApplyPreset && (
        <div className="mt-6">
          <PresetSelector onSelectPreset={onApplyPreset} />
        </div>
      )}

      <div className="mt-4">
        <PhotoUploadWithPreview
          photos={photos}
          setPhotos={setPhotos}
          userTier={props.userTier || 'FREE'}
          onUpgrade={props.onUpgrade}
          onBlockedAttempt={props.onBlockedAttempt}
        />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <ChipGroup label="Property template" options={propertyTemplates} value={propertyType} onChange={setPropertyType} />
        <ChipGroup label="Tone" options={tones} value={tone} onChange={setTone} />
      </div>

      <div className="mt-6">
        <ChannelSelector
          selected={channels}
          onChange={setChannels}
          userTier={props.userTier}
          freeKitsUsed={props.freeKitsUsed}
          freeLimit={props.freeLimit}
          onBlockedAttempt={props.onBlockedAttempt}
        />
      </div>

      {/* Advanced Settings - All optional fields in collapsible sections */}
      <AdvancedSettings
        openHouseDate={openHouseDate}
        setOpenHouseDate={setOpenHouseDate}
        openHouseTime={openHouseTime}
        setOpenHouseTime={setOpenHouseTime}
        openHouseLink={openHouseLink}
        setOpenHouseLink={setOpenHouseLink}
        ctaType={ctaType}
        setCtaType={setCtaType}
        ctaPhone={ctaPhone}
        setCtaPhone={setCtaPhone}
        ctaLink={ctaLink}
        setCtaLink={setCtaLink}
        ctaCustom={ctaCustom}
        setCtaCustom={setCtaCustom}
        socialHandle={socialHandle}
        setSocialHandle={setSocialHandle}
        hashtagStrategy={hashtagStrategy}
        setHashtagStrategy={setHashtagStrategy}
        extraHashtags={extraHashtags}
        setExtraHashtags={setExtraHashtags}
        readingLevel={readingLevel}
        setReadingLevel={setReadingLevel}
        useEmojis={useEmojis}
        setUseEmojis={setUseEmojis}
        mlsFormat={mlsFormat}
        setMlsFormat={setMlsFormat}
        mustInclude={mustInclude}
        setMustInclude={setMustInclude}
        avoidWords={avoidWords}
        setAvoidWords={setAvoidWords}
        brandVoice={brandVoice}
        setBrandVoice={setBrandVoice}
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button onClick={onGenerate} disabled={!!isGenerating} className={
          (isGenerating?
            "inline-flex items-center gap-2 rounded-2xl bg-white/60 text-neutral-900/70 px-5 py-3 font-semibold cursor-not-allowed"
            :
            "inline-flex items-center gap-2 rounded-2xl bg-white text-neutral-900 px-5 py-3 font-semibold hover:opacity-90"
          )
        }>
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-neutral-900/30 border-t-neutral-900 rounded-full animate-spin"></div>
              {getGenerationMessage(props.generationStage)}
            </div>
          ) : (props.buttonState?.text || 'Generate from these details')}
        </button>
        <button onClick={onUseSample} disabled={isGenerating} className="text-white/80 hover:text-white underline underline-offset-4 disabled:opacity-50">
          Use a sample listing instead
        </button>
      </div>
    </div>
  );
}


