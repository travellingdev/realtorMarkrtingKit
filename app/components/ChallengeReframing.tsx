'use client';
import React, { useState, useEffect } from 'react';
import { Wand2, Plus, X, HelpCircle, RefreshCw } from 'lucide-react';
import { 
  reframeChallenge, 
  getSuggestedChallenges, 
  CHALLENGE_CATEGORIES,
  detectChallenges 
} from '@/lib/challengeReframing';

interface ChallengeReframingProps {
  challenges: string[];
  onChange: (challenges: string[]) => void;
  propertyType?: string;
  features?: string; // To detect challenges in existing features
  className?: string;
}

export default function ChallengeReframing({
  challenges,
  onChange,
  propertyType = '',
  features = '',
  className = '',
}: ChallengeReframingProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [reframes, setReframes] = useState<Record<string, string>>({});

  // Generate suggestions based on property type
  useEffect(() => {
    const suggested = getSuggestedChallenges(propertyType);
    setSuggestions(suggested);
    
    // Detect challenges in features
    if (features) {
      const detected = detectChallenges(features);
      if (detected.length > 0) {
        setSuggestions(prev => [...new Set([...detected.slice(0, 3), ...prev])].slice(0, 5));
      }
    }
  }, [propertyType, features]);

  // Calculate reframes for current challenges
  useEffect(() => {
    const newReframes: Record<string, string> = {};
    challenges.forEach(challenge => {
      newReframes[challenge] = reframeChallenge(challenge);
    });
    setReframes(newReframes);
  }, [challenges]);

  const addChallenge = (challenge: string) => {
    if (challenge && !challenges.includes(challenge)) {
      onChange([...challenges, challenge]);
      setInputValue('');
      // Remove from suggestions if it was there
      setSuggestions(prev => prev.filter(s => s !== challenge));
    }
  };

  const removeChallenge = (challenge: string) => {
    onChange(challenges.filter(c => c !== challenge));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addChallenge(inputValue);
    }
  };

  const getRandomSuggestions = () => {
    // Get random suggestions from different categories
    const allSuggestions: string[] = [];
    Object.values(CHALLENGE_CATEGORIES).forEach(category => {
      const random = category[Math.floor(Math.random() * category.length)];
      if (random && !challenges.includes(random)) {
        allSuggestions.push(random);
      }
    });
    setSuggestions(allSuggestions.slice(0, 5));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-purple-400" />
          <label className="text-sm text-white/80">Property Challenges</label>
          <span className="text-xs text-white/40">(optional)</span>
        </div>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="text-white/40 hover:text-white/60"
        >
          <HelpCircle className="h-3 w-3" />
        </button>
      </div>

      {showHelp && (
        <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-400/20 text-xs text-white/70">
          <p className="font-semibold text-purple-300 mb-1">Why add challenges?</p>
          <p>Every property has aspects that might seem negative. Our AI transforms these into positive selling points, turning potential objections into unique features that appeal to the right buyers.</p>
          <p className="mt-2 text-purple-300">Example: &ldquo;small rooms&rdquo; → &ldquo;cozy and efficient spaces&rdquo;</p>
        </div>
      )}

      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
        {/* Quick suggestion chips */}
        {suggestions.length > 0 && challenges.length < 5 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addChallenge(suggestion)}
                className="text-xs px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <Plus className="inline h-3 w-3 mr-1" />
                {suggestion}
              </button>
            ))}
            <button
              type="button"
              onClick={getRandomSuggestions}
              className="text-xs px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300"
            >
              <RefreshCw className="inline h-3 w-3 mr-1" />
              More
            </button>
          </div>
        )}

        {/* Current challenges with reframes */}
        {challenges.length > 0 && (
          <div className="space-y-2 mb-3">
            {challenges.map(challenge => (
              <div key={challenge} className="flex items-start gap-2 p-2 bg-white/5 rounded-lg">
                <button
                  type="button"
                  onClick={() => removeChallenge(challenge)}
                  className="text-white/40 hover:text-red-400 mt-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="flex-1">
                  <div className="text-sm text-white/80">{challenge}</div>
                  <div className="text-xs text-purple-400 mt-1">
                    ✨ → {reframes[challenge]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input field */}
        {challenges.length < 5 && (
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                challenges.length === 0
                  ? "e.g., 'busy street' → AI will reframe as 'convenient location'"
                  : "Add another challenge..."
              }
              className="w-full bg-transparent border-0 text-sm outline-none placeholder-white/40"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => addChallenge(inputValue)}
                className="absolute right-0 top-0 text-cyan-400 hover:text-cyan-300"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {challenges.length >= 5 && (
          <p className="text-xs text-white/40">Maximum 5 challenges reached</p>
        )}
      </div>

      {/* Preview of how challenges will be addressed */}
      {challenges.length > 0 && (
        <div className="p-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
          <p className="text-xs text-white/60">
            <span className="text-purple-300">AI Preview:</span> These aspects will be reframed positively in your marketing content to attract the right buyers who see them as benefits.
          </p>
        </div>
      )}
    </div>
  );
}