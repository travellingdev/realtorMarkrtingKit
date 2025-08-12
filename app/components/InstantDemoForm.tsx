"use client";
import React from 'react';
import { Image as ImageIcon, Crown, Lock } from 'lucide-react';
import { canUseFeature } from '@/lib/tiers';
import FeatureLock from './FeatureLock';

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
  isGenerating?: boolean;
  generationStage?: 'uploading' | 'analyzing' | 'selecting' | 'generating' | 'complete';
  userTier?: string;
  onUpgrade?: (tier: string) => void;
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
    onGenerate, onUseSample,
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

      <div className="mt-4">
        <FeatureLock
          feature="vision"
          currentTier={props.userTier || 'FREE'}
          title="AI Photo Analysis"
          description="Upload property photos for enhanced AI analysis and smart content generation"
          onUpgrade={props.onUpgrade}
        >
          <label className="block">
            <div className="text-sm text-white/80 mb-2">
              <ImageIcon className="h-4 w-4 inline mr-2" />
              Photos (for enhanced AI analysis)
              {!canUseFeature(props.userTier || 'FREE', 'vision') && (
                <Lock className="h-4 w-4 inline ml-2 text-yellow-400" />
              )}
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-950/50 p-4">
              <input
                aria-label="Upload photos"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => props.setPhotos(Array.from(e.target.files || []))}
                className="block w-full text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-neutral-900 hover:file:opacity-90"
                disabled={!canUseFeature(props.userTier || 'FREE', 'vision')}
              />
              {photos?.length && canUseFeature(props.userTier || 'FREE', 'vision') ? (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs">
                      ✓
                    </span>
                    {photos.length} photo{photos.length > 1 ? 's' : ''} ready for AI analysis
                  </div>
                  <div className="text-xs text-white/60">
                    AI will analyze your photos to create enhanced descriptions that highlight your property&apos;s best features
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-xs text-white/60">
                  <div className="mb-1">💡 Pro tip: Include these photos for best AI results:</div>
                  <div className="grid grid-cols-2 gap-1 text-white/50">
                    <span>• Front exterior</span>
                    <span>• Kitchen</span>
                    <span>• Living room</span>
                    <span>• Master bedroom</span>
                    <span>• Best feature (pool, view, etc.)</span>
                    <span>• Any unique selling points</span>
                  </div>
                </div>
              )}
            </div>
          </label>
        </FeatureLock>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <ChipGroup label="Property template" options={propertyTemplates} value={propertyType} onChange={setPropertyType} />
        <ChipGroup label="Tone" options={tones} value={tone} onChange={setTone} />
      </div>

      <div className="mt-6">
        <div className="text-sm text-white/80">Channels</div>
        <div className="mt-2 flex flex-wrap gap-4">
          {['mls', 'instagram', 'reel', 'email'].map((ch) => (
            <label key={ch} className="inline-flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={channels.includes(ch)}
                onChange={(e) =>
                  setChannels(
                    e.target.checked
                      ? [...channels, ch]
                      : channels.filter((c) => c !== ch)
                  )
                }
                className="rounded border-white/10 bg-neutral-950"
              />
              {ch === 'mls' ? 'MLS' : ch === 'instagram' ? 'Instagram' : ch === 'reel' ? 'Reel' : 'Email'}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm text-white/80">Brand voice (paste a past listing — optional)</label>
        <textarea
          value={brandVoice}
          onChange={(e) => setBrandVoice(e.target.value)}
          rows={3}
          placeholder="E.g., 'Calm, confident tone. Short sentences. Avoid jargon.'"
          className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
        />
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <LabeledInput label="Open house date" type="date" value={openHouseDate} onChange={setOpenHouseDate} />
        <LabeledInput label="Open house time" value={openHouseTime} onChange={setOpenHouseTime} placeholder="11–1" />
        <LabeledInput label="RSVP link" value={openHouseLink} onChange={setOpenHouseLink} placeholder="https://…" />
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <label className="block">
          <div className="text-sm text-white/80">CTA type</div>
          <select
            value={ctaType}
            onChange={(e) => setCtaType(e.target.value)}
            className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
          >
            <option value="">None</option>
            <option value="phone">Phone</option>
            <option value="link">Link</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        {ctaType === 'phone' && (
          <LabeledInput label="Phone" value={ctaPhone} onChange={setCtaPhone} placeholder="555-1234" />
        )}
        {ctaType === 'link' && (
          <LabeledInput label="Link" value={ctaLink} onChange={setCtaLink} placeholder="https://…" />
        )}
        {ctaType === 'custom' && (
          <LabeledInput label="Custom text" value={ctaCustom} onChange={setCtaCustom} placeholder="Call me for details" />
        )}
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <LabeledInput label="Social handle" value={socialHandle} onChange={setSocialHandle} placeholder="@handle" />
        <LabeledInput label="Hashtag strategy" value={hashtagStrategy} onChange={setHashtagStrategy} placeholder="local + trending" />
        <LabeledInput label="Extra hashtags" value={extraHashtags} onChange={setExtraHashtags} placeholder="#homes, #realestate" />
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <LabeledInput label="Reading level" value={readingLevel} onChange={setReadingLevel} placeholder="8th grade" />
        <label className="flex items-center gap-2 text-sm text-white/80 mt-6 sm:mt-0">
          <input type="checkbox" checked={useEmojis} onChange={(e) => setUseEmojis(e.target.checked)} className="rounded border-white/10 bg-neutral-950" />
          Use emojis
        </label>
        <label className="block">
          <div className="text-sm text-white/80">MLS format</div>
          <select
            value={mlsFormat}
            onChange={(e) => setMlsFormat(e.target.value)}
            className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
          >
            <option value="paragraph">Paragraph</option>
            <option value="bullets">Bullets</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <label className="block">
          <div className="text-sm text-white/80">Must include</div>
          <textarea
            value={mustInclude}
            onChange={(e) => setMustInclude(e.target.value)}
            rows={3}
            placeholder="e.g., pool, views"
            className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
          />
        </label>
        <label className="block">
          <div className="text-sm text-white/80">Avoid words</div>
          <textarea
            value={avoidWords}
            onChange={(e) => setAvoidWords(e.target.value)}
            rows={3}
            placeholder="e.g., fixer-upper, noisy"
            className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
          />
        </label>
      </div>

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
          ) : 'Generate from these details'}
        </button>
        <button onClick={onUseSample} disabled={isGenerating} className="text-white/80 hover:text-white underline underline-offset-4 disabled:opacity-50">
          Use a sample listing instead
        </button>
      </div>
    </div>
  );
}


