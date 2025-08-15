'use client';
import React from 'react';
import { Type, Sliders, Info } from 'lucide-react';

interface OutputLengthControlsProps {
  mlsLength: number;
  setMLSLength: (v: number) => void;
  emailLength: number;
  setEmailLength: (v: number) => void;
  socialLength: number;
  setSocialLength: (v: number) => void;
  className?: string;
}

interface LengthConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  optimal: number;
  unit: string;
  description: string;
}

const LENGTH_CONFIGS: LengthConfig[] = [
  {
    id: 'mls',
    label: 'MLS Description',
    min: 50,
    max: 500,
    optimal: 200,
    unit: 'words',
    description: 'Professional property description for MLS listing',
  },
  {
    id: 'email',
    label: 'Email Content',
    min: 100,
    max: 300,
    unit: 'words',
    optimal: 180,
    description: 'Email newsletter and marketing content',
  },
  {
    id: 'social',
    label: 'Social Media',
    min: 50,
    max: 150,
    optimal: 100,
    unit: 'words',
    description: 'Instagram, Facebook posts and captions',
  },
];

function LengthSlider({ 
  config, 
  value, 
  onChange 
}: { 
  config: LengthConfig; 
  value: number; 
  onChange: (v: number) => void; 
}) {
  const percentage = ((value - config.min) / (config.max - config.min)) * 100;
  const optimalPercentage = ((config.optimal - config.min) / (config.max - config.min)) * 100;
  
  const getLengthLabel = (val: number) => {
    if (val <= config.optimal * 0.8) return 'Concise';
    if (val <= config.optimal * 1.2) return 'Optimal';
    return 'Detailed';
  };

  const getLengthColor = (val: number) => {
    if (val <= config.optimal * 0.8) return 'text-yellow-400';
    if (val <= config.optimal * 1.2) return 'text-green-400';
    return 'text-blue-400';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white/90">{config.label}</div>
          <div className="text-xs text-white/60">{config.description}</div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-semibold ${getLengthColor(value)}`}>
            {value} {config.unit}
          </div>
          <div className="text-xs text-white/60">
            {getLengthLabel(value)}
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          {/* Progress */}
          <div 
            className="h-full transition-all duration-200 rounded-full"
            style={{ 
              width: `${percentage}%`,
              background: value <= config.optimal * 0.8 ? '#fbbf24' : 
                         value <= config.optimal * 1.2 ? '#10b981' : '#3b82f6'
            }}
          />
        </div>
        
        {/* Optimal marker */}
        <div 
          className="absolute top-0 w-0.5 h-2 bg-white/60"
          style={{ left: `${optimalPercentage}%` }}
        />
        
        {/* Slider input */}
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-white/40">
        <span>{config.min}</span>
        <span className="text-white/60">Optimal: {config.optimal}</span>
        <span>{config.max}</span>
      </div>
    </div>
  );
}

export default function OutputLengthControls({
  mlsLength,
  setMLSLength,
  emailLength,
  setEmailLength,
  socialLength,
  setSocialLength,
  className = '',
}: OutputLengthControlsProps) {
  const configs = LENGTH_CONFIGS;
  const values = [mlsLength, emailLength, socialLength];
  const setters = [setMLSLength, setEmailLength, setSocialLength];

  const averageOptimality = configs.reduce((acc, config, index) => {
    const value = values[index];
    const optimal = config.optimal;
    const optimality = Math.max(0, 100 - Math.abs(value - optimal) / optimal * 100);
    return acc + optimality;
  }, 0) / configs.length;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-medium text-white/80">Content Length</h3>
          <div className="group relative">
            <Info className="h-3 w-3 text-white/40" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="rounded-lg bg-black/90 px-3 py-2 text-xs text-white whitespace-nowrap">
                <p className="font-semibold mb-1">Content Length Control</p>
                <p>Customize output length for each channel.</p>
                <p>Optimal ranges provide the best engagement.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-white/60">Overall Optimality</div>
          <div className={`text-sm font-semibold ${
            averageOptimality >= 80 ? 'text-green-400' :
            averageOptimality >= 60 ? 'text-yellow-400' : 'text-orange-400'
          }`}>
            {Math.round(averageOptimality)}%
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4 bg-neutral-950 rounded-xl border border-white/10">
        {configs.map((config, index) => (
          <LengthSlider
            key={config.id}
            config={config}
            value={values[index]}
            onChange={setters[index]}
          />
        ))}
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMLSLength(150);
            setEmailLength(120);
            setSocialLength(80);
          }}
          className="px-3 py-1.5 text-xs rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
        >
          📝 Concise (Quick reads)
        </button>
        <button
          type="button"
          onClick={() => {
            setMLSLength(200);
            setEmailLength(180);
            setSocialLength(100);
          }}
          className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
        >
          🎯 Optimal (Recommended)
        </button>
        <button
          type="button"
          onClick={() => {
            setMLSLength(300);
            setEmailLength(250);
            setSocialLength(130);
          }}
          className="px-3 py-1.5 text-xs rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
        >
          📖 Detailed (Comprehensive)
        </button>
      </div>

      {/* Length impact preview */}
      {averageOptimality < 70 && (
        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-400/20">
          <p className="text-xs text-yellow-300 flex items-start gap-1">
            <Sliders className="h-3 w-3 mt-0.5" />
            <span>
              <strong>Length Tip:</strong> {
                values.some((v, i) => v < configs[i].optimal * 0.8) ? 
                  'Consider longer content for better engagement and SEO.' :
                  'Consider shorter content for better readability and engagement.'
              }
            </span>
          </p>
        </div>
      )}
    </div>
  );
}