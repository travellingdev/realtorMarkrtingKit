'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings2, Shield, Target, Palette, Share2, HelpCircle } from 'lucide-react';
import NeighborhoodContext from './NeighborhoodContext';
import OutputLengthControls from './OutputLengthControls';

interface AdvancedSettings_v2Props {
  // Neighborhood Context
  schoolDistrict: string;
  setSchoolDistrict: (v: string) => void;
  walkScore: string;
  setWalkScore: (v: string) => void;
  distanceToDowntown: string;
  setDistanceToDowntown: (v: string) => void;
  nearbyAmenities: string[];
  setNearbyAmenities: (v: string[]) => void;
  
  // Output Length Controls
  mlsLength: number;
  setMLSLength: (v: number) => void;
  emailLength: number;
  setEmailLength: (v: number) => void;
  socialLength: number;
  setSocialLength: (v: number) => void;
  
  // Existing Advanced Settings
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
  
  brandVoice: string;
  setBrandVoice: (v: string) => void;
}

interface AdvancedSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  importance: 'high' | 'medium' | 'low';
}

const ADVANCED_SECTIONS: AdvancedSection[] = [
  {
    id: 'location',
    title: 'Location Intelligence',
    description: 'School districts, walkability, and nearby amenities',
    icon: <Target className="h-4 w-4" />,
    importance: 'high',
  },
  {
    id: 'length',
    title: 'Content Length',
    description: 'Customize output length for each marketing channel',
    icon: <Palette className="h-4 w-4" />,
    importance: 'high',
  },
  {
    id: 'marketing',
    title: 'Marketing Details',
    description: 'Open house, calls-to-action, and contact info',
    icon: <Share2 className="h-4 w-4" />,
    importance: 'medium',
  },
  {
    id: 'compliance',
    title: 'Content Policy',
    description: 'Required words and terms to avoid',
    icon: <Shield className="h-4 w-4" />,
    importance: 'medium',
  },
  {
    id: 'style',
    title: 'Style & Format',
    description: 'Reading level, emojis, and formatting options',
    icon: <Palette className="h-4 w-4" />,
    importance: 'low',
  },
];

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
      <div className="flex items-center gap-1 text-sm text-white/80 mb-2">
        {label}
        {tooltip && (
          <div className="group relative">
            <HelpCircle className="h-3 w-3 text-white/40" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
              <div className="rounded-lg bg-black/90 px-2 py-1 text-xs text-white whitespace-nowrap max-w-48">
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
        className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
      />
    </label>
  );
}

export default function AdvancedSettings_v2(props: AdvancedSettings_v2Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getImportanceColor = (importance: 'high' | 'medium' | 'low') => {
    switch (importance) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
    }
  };

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'location':
        return (
          <NeighborhoodContext
            schoolDistrict={props.schoolDistrict}
            setSchoolDistrict={props.setSchoolDistrict}
            walkScore={props.walkScore}
            setWalkScore={props.setWalkScore}
            distanceToDowntown={props.distanceToDowntown}
            setDistanceToDowntown={props.setDistanceToDowntown}
            nearbyAmenities={props.nearbyAmenities}
            setNearbyAmenities={props.setNearbyAmenities}
          />
        );
        
      case 'length':
        return (
          <OutputLengthControls
            mlsLength={props.mlsLength}
            setMLSLength={props.setMLSLength}
            emailLength={props.emailLength}
            setEmailLength={props.setEmailLength}
            socialLength={props.socialLength}
            setSocialLength={props.setSocialLength}
          />
        );
        
      case 'marketing':
        return (
          <div className="space-y-4">
            {/* Open House */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-3">Open House Details</h4>
              <div className="grid sm:grid-cols-3 gap-3">
                <LabeledInput 
                  label="Date" 
                  type="date" 
                  value={props.openHouseDate} 
                  onChange={props.setOpenHouseDate}
                  tooltip="Add if you have an open house scheduled" 
                />
                <LabeledInput 
                  label="Time" 
                  value={props.openHouseTime} 
                  onChange={props.setOpenHouseTime} 
                  placeholder="11–1 PM"
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
            </div>
            
            {/* Call to Action */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-3">Call to Action</h4>
              <div className="grid sm:grid-cols-4 gap-3">
                <label className="block">
                  <div className="text-sm text-white/80 mb-2">CTA Type</div>
                  <select
                    value={props.ctaType}
                    onChange={(e) => props.setCtaType(e.target.value)}
                    className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
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
            
            {/* Social Media */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-3">Social Media</h4>
              <div className="grid sm:grid-cols-3 gap-3">
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
            </div>
          </div>
        );
        
      case 'compliance':
        return (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
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
          </div>
        );
        
      case 'style':
        return (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <label className="block">
                <div className="text-sm text-white/80 mb-2">Reading Level</div>
                <select
                  value={props.readingLevel}
                  onChange={(e) => props.setReadingLevel(e.target.value)}
                  className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
                >
                  <option value="">Default</option>
                  <option value="8th grade">8th Grade</option>
                  <option value="high school">High School</option>
                  <option value="college">College</option>
                  <option value="professional">Professional</option>
                </select>
              </label>
              
              <label className="block">
                <div className="text-sm text-white/80 mb-2">MLS Format</div>
                <select
                  value={props.mlsFormat}
                  onChange={(e) => props.setMlsFormat(e.target.value)}
                  className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
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
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Brand Voice - Always visible */}
      <div className="p-4 rounded-2xl border border-white/10 bg-neutral-900/50">
        <label className="block">
          <div className="text-sm text-white/80 mb-2">Brand Voice</div>
          <textarea
            value={props.brandVoice}
            onChange={(e) => props.setBrandVoice(e.target.value)}
            rows={2}
            placeholder="E.g., 'Friendly, confident, zero fluff. Short sentences.'"
            className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60 text-sm"
          />
          <p className="mt-1 text-xs text-white/40">Paste a past listing to match your style</p>
        </label>
      </div>

      {/* Advanced Settings Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-white/60" />
          <span className="text-sm font-medium text-white">Advanced Settings</span>
          <span className="text-xs text-white/40">(Fine-tune your content)</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-white/60" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/60" />
        )}
      </button>

      {/* Advanced Sections */}
      {isOpen && (
        <div className="space-y-3">
          {ADVANCED_SECTIONS.map(section => (
            <div key={section.id} className="rounded-2xl border border-white/10 bg-neutral-900/50">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className={getImportanceColor(section.importance)}>
                    {section.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{section.title}</div>
                    <div className="text-xs text-white/60">{section.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {section.importance === 'high' && (
                    <span className="text-xs bg-green-400/20 text-green-300 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                  {openSections[section.id] ? (
                    <ChevronUp className="h-3 w-3 text-white/60" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-white/60" />
                  )}
                </div>
              </button>
              
              {openSections[section.id] && (
                <div className="border-t border-white/10 p-4">
                  {renderSectionContent(section.id)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}