'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings2, HelpCircle } from 'lucide-react';

interface AdvancedSettingsProps {
  // Open House
  openHouseDate: string;
  setOpenHouseDate: (v: string) => void;
  openHouseTime: string;
  setOpenHouseTime: (v: string) => void;
  openHouseLink: string;
  setOpenHouseLink: (v: string) => void;
  
  // CTA
  ctaType: string;
  setCtaType: (v: string) => void;
  ctaPhone: string;
  setCtaPhone: (v: string) => void;
  ctaLink: string;
  setCtaLink: (v: string) => void;
  ctaCustom: string;
  setCtaCustom: (v: string) => void;
  
  // Social
  socialHandle: string;
  setSocialHandle: (v: string) => void;
  hashtagStrategy: string;
  setHashtagStrategy: (v: string) => void;
  extraHashtags: string;
  setExtraHashtags: (v: string) => void;
  
  // Format
  readingLevel: string;
  setReadingLevel: (v: string) => void;
  useEmojis: boolean;
  setUseEmojis: (v: boolean) => void;
  mlsFormat: string;
  setMlsFormat: (v: string) => void;
  
  // Policy
  mustInclude: string;
  setMustInclude: (v: string) => void;
  avoidWords: string;
  setAvoidWords: (v: string) => void;
  
  // Brand
  brandVoice: string;
  setBrandVoice: (v: string) => void;
}

function LabeledInput({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder,
  tooltip 
}: {
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  type?: string; 
  placeholder?: string;
  tooltip?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-1 text-sm text-white/80">
        {label}
        {tooltip && (
          <div className="group relative">
            <HelpCircle className="h-3 w-3 text-white/40" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
              <div className="rounded-lg bg-black/90 px-2 py-1 text-xs text-white whitespace-nowrap">
                {tooltip}
              </div>
            </div>
          </div>
        )}
      </div>
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

export default function AdvancedSettings(props: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    marketing: false,
    social: false,
    format: false,
    policy: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-white/60" />
          <span className="text-sm font-medium text-white">Advanced Settings</span>
          <span className="text-xs text-white/40">(Optional)</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-white/60" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/60" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 rounded-2xl border border-white/10 bg-neutral-900/50 p-4">
          
          {/* Brand Voice - Always visible in advanced */}
          <div>
            <label className="text-sm text-white/80">Brand Voice</label>
            <textarea
              value={props.brandVoice}
              onChange={(e) => props.setBrandVoice(e.target.value)}
              rows={2}
              placeholder="E.g., 'Friendly, confident, zero fluff. Short sentences.'"
              className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60 text-sm"
            />
            <p className="mt-1 text-xs text-white/40">Paste a past listing to match your style</p>
          </div>

          {/* Marketing Section */}
          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => toggleSection('marketing')}
              className="w-full flex items-center justify-between text-sm text-white/80 hover:text-white"
            >
              <span>Marketing Details</span>
              {openSections.marketing ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            
            {openSections.marketing && (
              <div className="mt-3 space-y-3">
                <div className="grid sm:grid-cols-3 gap-3">
                  <LabeledInput 
                    label="Open House Date" 
                    type="date" 
                    value={props.openHouseDate} 
                    onChange={props.setOpenHouseDate}
                    tooltip="Add if you have an open house scheduled" 
                  />
                  <LabeledInput 
                    label="Open House Time" 
                    value={props.openHouseTime} 
                    onChange={props.setOpenHouseTime} 
                    placeholder="11–1"
                    tooltip="Time range for the open house" 
                  />
                  <LabeledInput 
                    label="RSVP Link" 
                    value={props.openHouseLink} 
                    onChange={props.setOpenHouseLink} 
                    placeholder="https://..."
                    tooltip="Link for visitors to RSVP" 
                  />
                </div>
                
                <div className="grid sm:grid-cols-3 gap-3">
                  <label className="block">
                    <div className="flex items-center gap-1 text-sm text-white/80">
                      CTA Type
                      <HelpCircle className="h-3 w-3 text-white/40" />
                    </div>
                    <select
                      value={props.ctaType}
                      onChange={(e) => props.setCtaType(e.target.value)}
                      className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
                    >
                      <option value="">None</option>
                      <option value="phone">Phone</option>
                      <option value="link">Link</option>
                      <option value="custom">Custom</option>
                    </select>
                  </label>
                  
                  {props.ctaType === 'phone' && (
                    <LabeledInput label="Phone" value={props.ctaPhone} onChange={props.setCtaPhone} placeholder="555-1234" />
                  )}
                  {props.ctaType === 'link' && (
                    <LabeledInput label="Link" value={props.ctaLink} onChange={props.setCtaLink} placeholder="https://..." />
                  )}
                  {props.ctaType === 'custom' && (
                    <LabeledInput label="Custom Text" value={props.ctaCustom} onChange={props.setCtaCustom} placeholder="Call for details" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Social Section */}
          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => toggleSection('social')}
              className="w-full flex items-center justify-between text-sm text-white/80 hover:text-white"
            >
              <span>Social Media</span>
              {openSections.social ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            
            {openSections.social && (
              <div className="mt-3 grid sm:grid-cols-3 gap-3">
                <LabeledInput 
                  label="Social Handle" 
                  value={props.socialHandle} 
                  onChange={props.setSocialHandle} 
                  placeholder="@yourhandle"
                  tooltip="Your Instagram/TikTok handle" 
                />
                <LabeledInput 
                  label="Hashtag Strategy" 
                  value={props.hashtagStrategy} 
                  onChange={props.setHashtagStrategy} 
                  placeholder="neighborhood"
                  tooltip="Focus for hashtags (neighborhood, luxury, etc.)" 
                />
                <LabeledInput 
                  label="Extra Hashtags" 
                  value={props.extraHashtags} 
                  onChange={props.setExtraHashtags} 
                  placeholder="#custom #tags"
                  tooltip="Additional hashtags to include" 
                />
              </div>
            )}
          </div>

          {/* Format Section */}
          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => toggleSection('format')}
              className="w-full flex items-center justify-between text-sm text-white/80 hover:text-white"
            >
              <span>Format & Style</span>
              {openSections.format ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            
            {openSections.format && (
              <div className="mt-3 space-y-3">
                <div className="grid sm:grid-cols-3 gap-3">
                  <label className="block">
                    <div className="text-sm text-white/80">Reading Level</div>
                    <select
                      value={props.readingLevel}
                      onChange={(e) => props.setReadingLevel(e.target.value)}
                      className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
                    >
                      <option value="">Default</option>
                      <option value="8th grade">8th Grade</option>
                      <option value="high school">High School</option>
                      <option value="college">College</option>
                      <option value="professional">Professional</option>
                    </select>
                  </label>
                  
                  <label className="block">
                    <div className="text-sm text-white/80">MLS Format</div>
                    <select
                      value={props.mlsFormat}
                      onChange={(e) => props.setMlsFormat(e.target.value)}
                      className="mt-2 w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
                    >
                      <option value="paragraph">Paragraph</option>
                      <option value="bullets">Bullet Points</option>
                    </select>
                  </label>
                  
                  <label className="flex items-center gap-2 mt-8">
                    <input
                      type="checkbox"
                      checked={props.useEmojis}
                      onChange={(e) => props.setUseEmojis(e.target.checked)}
                      className="rounded border-white/10 bg-neutral-950"
                    />
                    <span className="text-sm text-white/80">Use Emojis</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Policy Section */}
          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => toggleSection('policy')}
              className="w-full flex items-center justify-between text-sm text-white/80 hover:text-white"
            >
              <span>Content Policy</span>
              {openSections.policy ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            
            {openSections.policy && (
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <LabeledInput 
                  label="Must Include Words" 
                  value={props.mustInclude} 
                  onChange={props.setMustInclude} 
                  placeholder="broker, team name"
                  tooltip="Comma-separated words that must appear" 
                />
                <LabeledInput 
                  label="Avoid Words" 
                  value={props.avoidWords} 
                  onChange={props.setAvoidWords} 
                  placeholder="cozy, cute"
                  tooltip="Comma-separated words to avoid" 
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}