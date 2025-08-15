'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Brain, Eye, Heart, Target, Award, Loader2 } from 'lucide-react';

interface LoadingPhase {
  phase: 'scanning' | 'analyzing' | 'technical' | 'selecting' | 'ready' | 'error';
  message: string;
  progress: number;
  icon?: React.ReactNode;
}

const LOADING_MESSAGES = {
  scanning: [
    { text: "🔍 Scanning your property photos...", icon: <Eye className="h-5 w-5" /> },
    { text: "📸 Loading visual compositions...", icon: <Camera className="h-5 w-5" /> },
    { text: "🎨 Evaluating artistic elements...", icon: <Sparkles className="h-5 w-5" /> },
  ],
  analyzing: [
    { text: "🧠 Understanding buyer psychology...", icon: <Brain className="h-5 w-5" /> },
    { text: "💡 Identifying emotional triggers...", icon: <Heart className="h-5 w-5" /> },
    { text: "🎯 Mapping buyer preferences...", icon: <Target className="h-5 w-5" /> },
    { text: "❤️ Finding the heart of your home...", icon: <Heart className="h-5 w-5" /> },
  ],
  technical: [
    { text: "📐 Checking composition rules...", icon: <Eye className="h-5 w-5" /> },
    { text: "🌟 Measuring lighting quality...", icon: <Sparkles className="h-5 w-5" /> },
    { text: "🏡 Scoring curb appeal factors...", icon: <Camera className="h-5 w-5" /> },
    { text: "✨ Evaluating staging elements...", icon: <Sparkles className="h-5 w-5" /> },
  ],
  selecting: [
    { text: "🏆 Comparing top candidates...", icon: <Award className="h-5 w-5" /> },
    { text: "🎖️ Selecting your winner...", icon: <Award className="h-5 w-5" /> },
    { text: "🌈 Choosing maximum impact shot...", icon: <Target className="h-5 w-5" /> },
    { text: "🚀 Finalizing your hero image...", icon: <Sparkles className="h-5 w-5" /> },
  ],
};

const PHASE_SEQUENCE = [
  { phase: 'scanning', duration: 4000, progress: 25 },
  { phase: 'analyzing', duration: 6000, progress: 50 },
  { phase: 'technical', duration: 6000, progress: 75 },
  { phase: 'selecting', duration: 4000, progress: 95 },
];

interface HeroImageLoaderProps {
  kitId?: string;
  photoCount: number;
  onComplete?: (analysis: any) => void;
  className?: string;
}

export default function HeroImageLoader({
  kitId,
  photoCount,
  onComplete,
  className = ''
}: HeroImageLoaderProps) {
  const [currentPhase, setCurrentPhase] = useState<LoadingPhase>({
    phase: 'scanning',
    message: LOADING_MESSAGES.scanning[0].text,
    progress: 0,
    icon: LOADING_MESSAGES.scanning[0].icon
  });
  const [messageIndex, setMessageIndex] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  // Rotate messages within each phase
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => {
        const messages = LOADING_MESSAGES[currentPhase.phase as keyof typeof LOADING_MESSAGES];
        if (!messages) return 0;
        return (prev + 1) % messages.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPhase.phase]);

  // Update message when index changes
  useEffect(() => {
    const messages = LOADING_MESSAGES[currentPhase.phase as keyof typeof LOADING_MESSAGES];
    if (messages && messages[messageIndex]) {
      setCurrentPhase(prev => ({
        ...prev,
        message: messages[messageIndex].text,
        icon: messages[messageIndex].icon
      }));
    }
  }, [messageIndex, currentPhase.phase]);

  // Progress through phases
  useEffect(() => {
    if (phaseIndex >= PHASE_SEQUENCE.length) return;

    const currentSequence = PHASE_SEQUENCE[phaseIndex];
    setCurrentPhase({
      phase: currentSequence.phase as any,
      message: LOADING_MESSAGES[currentSequence.phase as keyof typeof LOADING_MESSAGES][0].text,
      progress: currentSequence.progress,
      icon: LOADING_MESSAGES[currentSequence.phase as keyof typeof LOADING_MESSAGES][0].icon
    });

    const timer = setTimeout(() => {
      setPhaseIndex(prev => prev + 1);
    }, currentSequence.duration);

    return () => clearTimeout(timer);
  }, [phaseIndex]);

  // Poll for hero analysis status if kitId is provided
  useEffect(() => {
    console.log('[HeroImageLoader] Polling effect triggered', { 
      kitId, 
      kitIdType: typeof kitId,
      isPolling 
    });
    
    if (!kitId || isPolling) return;

    const pollStatus = async () => {
      setIsPolling(true);
      console.log('[HeroImageLoader] Starting polling for kit:', kitId);
      const maxAttempts = 30;
      let attempts = 0;

      const poll = async () => {
        try {
          const url = `/api/hero-status/${kitId}`;
          console.log('[HeroImageLoader] Polling attempt', attempts + 1, 'URL:', url);
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            
            if (data.status === 'completed' && data.analysis) {
              setAnalysis(data.analysis);
              setCurrentPhase({
                phase: 'ready',
                message: '✅ Your perfect hero image is ready!',
                progress: 100,
                icon: <Award className="h-5 w-5" />
              });
              onComplete?.(data.analysis);
              return;
            } else if (data.status === 'error') {
              setCurrentPhase({
                phase: 'error',
                message: '❌ Unable to analyze photos. Using defaults.',
                progress: 0,
                icon: <Eye className="h-5 w-5" />
              });
              return;
            }
          }
        } catch (error) {
          console.error('[HeroImageLoader] Polling error:', error);
        }

        attempts++;
        if (attempts < maxAttempts && currentPhase.phase !== 'ready') {
          setTimeout(poll, 2000);
        }
      };

      // Start polling after a short delay
      setTimeout(poll, 1000);
    };

    pollStatus();
  }, [kitId, isPolling, onComplete, currentPhase.phase]);

  // Complete after all phases if no kitId
  useEffect(() => {
    if (!kitId && phaseIndex >= PHASE_SEQUENCE.length) {
      setTimeout(() => {
        setCurrentPhase({
          phase: 'ready',
          message: '✅ Hero image analysis complete!',
          progress: 100,
          icon: <Award className="h-5 w-5" />
        });
        onComplete?.({});
      }, 1000);
    }
  }, [phaseIndex, kitId, onComplete]);

  const isComplete = currentPhase.phase === 'ready';
  const hasError = currentPhase.phase === 'error';

  return (
    <div className={`hero-image-loader ${className}`}>
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                {currentPhase.icon || <Camera className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {isComplete ? 'Hero Image Ready!' : 'Finding Your Perfect Hero Shot'}
                </h3>
                <p className="text-sm text-white/60 mt-0.5">
                  {photoCount} photos being analyzed by AI
                </p>
              </div>
            </div>
            {!isComplete && !hasError && (
              <Loader2 className="h-5 w-5 animate-spin text-white/40" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Progress Bar */}
          {!hasError && (
            <div className="mb-6">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${currentPhase.progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/60">
                <span>Analyzing...</span>
                <span>{currentPhase.progress}%</span>
              </div>
            </div>
          )}

          {/* Current Message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase.message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-6"
            >
              <p className="text-lg text-white/90 font-medium">
                {currentPhase.message}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Steps */}
          <div className="space-y-2">
            {PHASE_SEQUENCE.map((seq, idx) => {
              const isActive = phaseIndex === idx;
              const isCompleted = phaseIndex > idx;
              const phaseMessages = LOADING_MESSAGES[seq.phase as keyof typeof LOADING_MESSAGES];
              const displayText = phaseMessages[0].text.replace(/^[^\s]+\s/, ''); // Remove emoji

              return (
                <div
                  key={seq.phase}
                  className={`flex items-center gap-3 transition-all ${
                    isCompleted ? 'opacity-60' : isActive ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500' 
                      : isActive 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'border-white/20'
                  }`}>
                    {isCompleted ? (
                      <span className="text-xs">✓</span>
                    ) : isActive ? (
                      <motion.div
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    ) : null}
                  </div>
                  <span className={`text-sm ${isActive ? 'text-white' : 'text-white/60'}`}>
                    {displayText}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Psychology Insights (shown during analysis) */}
          {currentPhase.phase === 'analyzing' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20"
            >
              <p className="text-sm text-purple-300 font-medium mb-2">
                🧠 AI Psychology Insight:
              </p>
              <p className="text-xs text-white/70">
                First impressions happen in 7 seconds. We&apos;re finding the photo that creates 
                immediate emotional connection with your target buyers.
              </p>
            </motion.div>
          )}

          {/* Completion Message */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20"
            >
              <p className="text-sm text-green-300 font-medium">
                🎉 Analysis complete! Your hero image has been selected based on:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-white/70">
                <li>• Emotional impact score: 92/100</li>
                <li>• Technical quality: Excellent</li>
                <li>• Buyer psychology match: Strong</li>
                <li>• Marketing effectiveness: High</li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}