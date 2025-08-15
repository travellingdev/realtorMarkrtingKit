"use client";
import React, { useState } from 'react';
import { Copy, Sparkles, TrendingUp, Eye } from 'lucide-react';

interface ReelHooksDisplayProps {
  hooks?: string[];
  onCopySuccess?: (message: string) => void;
}

export default function ReelHooksDisplay({ hooks, onCopySuccess }: ReelHooksDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedHooks, setExpandedHooks] = useState(false);

  if (!hooks || hooks.length === 0) {
    return null;
  }

  const parseHook = (hook: string) => {
    const voiceMatch = hook.match(/VOICE:\s*([^]*?)(?:\s*TEXT:|$)/);
    const textMatch = hook.match(/TEXT:\s*([^]*?)$/);
    
    return {
      voice: voiceMatch ? voiceMatch[1].trim() : hook,
      text: textMatch ? textMatch[1].trim() : ''
    };
  };

  const handleCopy = (hook: string, index: number) => {
    const parsed = parseHook(hook);
    // Copy just the voice part for easy use
    navigator.clipboard.writeText(parsed.voice);
    setCopiedIndex(index);
    onCopySuccess?.(`Hook ${index + 1} copied!`);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hookIcons = [Sparkles, TrendingUp, Eye];
  const hookLabels = ['Curiosity Hook', 'Social Proof Hook', 'Benefit Hook'];

  return (
    <div className="mt-4 p-3 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/20">
      <button
        onClick={() => setExpandedHooks(!expandedHooks)}
        className="flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors w-full"
      >
        <Sparkles className="h-4 w-4" />
        <span>Alternative Hooks for A/B Testing</span>
        <span className="ml-auto text-xs text-purple-400">
          {expandedHooks ? '▼' : '▶'}
        </span>
      </button>
      
      {expandedHooks && (
        <div className="mt-3 space-y-2">
          {hooks.map((hook, index) => {
            const Icon = hookIcons[index] || Sparkles;
            const label = hookLabels[index] || `Hook ${index + 1}`;
            const parsed = parseHook(hook);
            
            return (
              <div
                key={index}
                className="group flex items-start gap-2 p-2 bg-neutral-800/50 rounded-md hover:bg-neutral-800/70 transition-colors"
              >
                <Icon className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-purple-400 mb-1">{label}</div>
                  <div className="text-sm text-white/80">{parsed.voice}</div>
                  {parsed.text && (
                    <div className="text-xs text-white/50 mt-1">
                      📱 On-screen: {parsed.text}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleCopy(hook, index)}
                  className={`text-xs px-2 py-1 rounded transition-all opacity-0 group-hover:opacity-100 ${
                    copiedIndex === index
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            );
          })}
          
          <div className="text-xs text-purple-300/60 mt-2 italic">
            💡 Test different hooks to see which performs best with your audience
          </div>
        </div>
      )}
    </div>
  );
}