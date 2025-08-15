"use client";
import React, { useState } from 'react';
import { Copy, Hash, TrendingUp, MapPin, Star, Target, Info } from 'lucide-react';

interface HashtagDisplayProps {
  hashtags?: {
    trending?: string[];
    location?: string[];
    features?: string[];
    targeted?: string[];
    content?: string[];
    all?: string[];
    score?: number;
    tips?: string;
  };
  onCopySuccess?: (message: string) => void;
}

export default function HashtagDisplay({ hashtags, onCopySuccess }: HashtagDisplayProps) {
  const [copiedCategory, setCopiedCategory] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);

  if (!hashtags || !hashtags.all || hashtags.all.length === 0) {
    return null;
  }

  const handleCopy = (tags: string[], categoryName: string) => {
    const tagString = tags.join(' ');
    navigator.clipboard.writeText(tagString);
    setCopiedCategory(categoryName);
    onCopySuccess?.(`${categoryName} hashtags copied!`);
    setTimeout(() => setCopiedCategory(null), 2000);
  };

  const categories = [
    { key: 'content', label: 'Content-Based', icon: Hash, color: 'text-pink-400' },
    { key: 'trending', label: 'Trending', icon: TrendingUp, color: 'text-cyan-400' },
    { key: 'location', label: 'Location', icon: MapPin, color: 'text-blue-400' },
    { key: 'features', label: 'Features', icon: Star, color: 'text-purple-400' },
    { key: 'targeted', label: 'Targeted', icon: Target, color: 'text-green-400' }
  ];

  return (
    <div className="mt-4 p-4 bg-neutral-800/50 rounded-xl border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-white/60" />
          <h4 className="text-sm font-medium text-white/80">Smart Hashtags</h4>
          {hashtags.score && (
            <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full">
              Score: {hashtags.score}/10
            </span>
          )}
        </div>
        <button
          onClick={() => handleCopy(hashtags.all!, 'All')}
          className={`text-xs px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
            copiedCategory === 'All' 
              ? 'bg-green-500/20 text-green-300' 
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          <Copy className="h-3 w-3" />
          {copiedCategory === 'All' ? 'Copied!' : 'Copy All 30'}
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {categories.map(({ key, label, icon: Icon, color }) => {
          const tags = hashtags[key as keyof typeof hashtags] as string[] | undefined;
          if (!tags || tags.length === 0) return null;

          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-3 w-3 ${color}`} />
                  <span className="text-xs text-white/60">{label}</span>
                  <span className="text-xs text-white/40">({tags.length})</span>
                </div>
                <button
                  onClick={() => handleCopy(tags, label)}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-0.5 rounded ${
                    copiedCategory === label
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-white/10 text-white/50 hover:bg-white/20'
                  }`}
                >
                  {copiedCategory === label ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-neutral-700/50 text-white/70 rounded-md hover:bg-neutral-700 transition-colors cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(tag);
                      onCopySuccess?.(`Copied: ${tag}`);
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      {hashtags.tips && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Info className="h-3 w-3" />
            {showTips ? 'Hide Tips' : 'Show Tips'}
          </button>
          {showTips && (
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              💡 {hashtags.tips}
            </p>
          )}
        </div>
      )}

      {/* Strategy Note */}
      <div className="mt-3 text-xs text-white/50">
        Using 9-3-9-9 strategy: 9 popular • 3 branded • 9 medium • 9 niche
      </div>
    </div>
  );
}