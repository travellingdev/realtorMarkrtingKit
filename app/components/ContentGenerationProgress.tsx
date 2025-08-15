'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressStage {
  id: string;
  duration: number;
  primary: string;
  details: string[];
  emoji: string;
  percentage: [number, number];
}

const progressStages: ProgressStage[] = [
  {
    id: 'photo_analysis',
    duration: 3000,
    primary: "Analyzing your stunning photos",
    details: [
      "Identifying standout features...",
      "Spotting that gorgeous kitchen...",
      "Found 12 premium selling points...",
      "Selecting best hero image..."
    ],
    emoji: "📸",
    percentage: [0, 20]
  },
  {
    id: 'hero_selection',
    duration: 2000,
    primary: "Selecting your hero image",
    details: [
      "Scoring photo composition...",
      "Analyzing emotional impact...",
      "Checking marketing appeal...",
      "AI recommends: Exterior shot"
    ],
    emoji: "🌟",
    percentage: [20, 30]
  },
  {
    id: 'buyer_profiling',
    duration: 2500,
    primary: "Understanding your ideal buyer",
    details: [
      "Tailoring for luxury seekers...",
      "Optimizing for growing families...",
      "Appealing to young professionals...",
      "Adding psychological triggers..."
    ],
    emoji: "🎯",
    percentage: [30, 45]
  },
  {
    id: 'content_creation',
    duration: 4000,
    primary: "Crafting compelling content",
    details: [
      "Writing attention-grabbing headlines...",
      "Building emotional connections...",
      "Creating a sense of urgency...",
      "Highlighting unique features..."
    ],
    emoji: "✍️",
    percentage: [45, 70]
  },
  {
    id: 'optimization',
    duration: 2500,
    primary: "Optimizing for maximum impact",
    details: [
      "Enhancing search visibility...",
      "Adding power words for engagement...",
      "Ensuring mobile readability...",
      "Perfecting social media appeal..."
    ],
    emoji: "⚡",
    percentage: [70, 85]
  },
  {
    id: 'quality_check',
    duration: 2000,
    primary: "Perfecting every detail",
    details: [
      "Polishing grammar and flow...",
      "Validating best practices...",
      "Ensuring compliance standards...",
      "Adding finishing touches..."
    ],
    emoji: "✨",
    percentage: [85, 95]
  },
  {
    id: 'complete',
    duration: 500,
    primary: "Your premium content is ready!",
    details: [
      "Content quality score: 92/100!",
      "Optimized for 3 buyer types",
      "Ready to attract serious buyers",
      "Let's get your property sold!"
    ],
    emoji: "🎉",
    percentage: [95, 100]
  }
];

const funFacts = [
  "💡 Listings with 20+ photos receive 3x more views",
  "💡 Properties priced right sell 50% faster",
  "💡 Emotional words increase inquiries by 27%",
  "💡 Professional photos can increase sale price by 5%",
  "💡 Detailed descriptions get 30% more engagement"
];

interface ContentGenerationProgressProps {
  isGenerating: boolean;
  onComplete?: () => void;
  photoCount?: number;
  propertyType?: string;
  isLoggedIn?: boolean;
}

export default function ContentGenerationProgress({
  isGenerating,
  onComplete,
  photoCount = 0,
  propertyType = 'property',
  isLoggedIn = true
}: ContentGenerationProgressProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [subMessageIndex, setSubMessageIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentFunFact, setCurrentFunFact] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentStage = progressStages[currentStageIndex];

  // Progress animation
  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setCurrentStageIndex(0);
      setIsComplete(false);
      return;
    }

    const totalDuration = progressStages.reduce((sum, stage) => sum + stage.duration, 0);
    const increment = 100 / (totalDuration / 50); // Update every 50ms

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          setIsComplete(true);
          if (onComplete) {
            setTimeout(onComplete, 1000);
          }
          return 100;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [isGenerating, onComplete]);

  // Update stage based on progress
  useEffect(() => {
    const stage = progressStages.find(s => 
      progress >= s.percentage[0] && progress < s.percentage[1]
    );
    if (stage) {
      const stageIndex = progressStages.findIndex(s => s.id === stage.id);
      setCurrentStageIndex(stageIndex);
    }
  }, [progress]);

  // Rotate through detail messages
  useEffect(() => {
    const interval = setInterval(() => {
      setSubMessageIndex(prev => (prev + 1) % currentStage.details.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [currentStageIndex, currentStage.details.length]);

  // Rotate through fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFunFact(prev => (prev + 1) % funFacts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get contextual message based on inputs
  const getContextualMessage = () => {
    if (photoCount > 15) {
      return "Wow! Analyzing your extensive photo collection...";
    } else if (photoCount < 5 && photoCount > 0) {
      return "Making the most of your photos...";
    }
    
    if (propertyType === 'luxury') {
      return "Crafting exclusive, sophisticated content...";
    } else if (propertyType === 'condo') {
      return "Highlighting urban lifestyle benefits...";
    }
    
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning! Creating fresh content for you...";
    } else if (hour > 20) {
      return "Working late to perfect your listing...";
    }
    
    return null;
  };

  if (!isGenerating && !isComplete) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`content-generation-progress ${isMinimized ? 'minimized' : ''} ${isExpanded ? 'expanded' : ''}`}
      >
        {isMinimized ? (
          <div className="minimized-view" onClick={() => setIsMinimized(false)}>
            <div className="progress-ring">
              <svg width="50" height="50">
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${progress * 1.26} 126`}
                  transform="rotate(-90 25 25)"
                />
              </svg>
              <span className="progress-emoji">{currentStage.emoji}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="progress-header">
              <h3>{!isLoggedIn ? 'Creating Your Preview' : 'Creating Your Premium Content'}</h3>
              <div className="progress-controls">
                <button 
                  className="expand-btn"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Show less" : "Show more"}
                >
                  {isExpanded ? '−' : '+'}
                </button>
                <button 
                  className="minimize-btn"
                  onClick={() => setIsMinimized(true)}
                  title="Minimize"
                >
                  _
                </button>
              </div>
            </div>

            {/* Main Progress Bar */}
            <div className="progress-bar-container">
              <div className="progress-bar-background">
                <motion.div 
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
                <div 
                  className="progress-glow"
                  style={{ left: `${Math.min(progress - 5, 90)}%` }}
                />
              </div>
              <div className="progress-percentage">{Math.round(progress)}%</div>
            </div>

            {/* Stage Information */}
            <div className="stage-info">
              <motion.div 
                key={currentStage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="stage-content"
              >
                <span className="stage-emoji">{currentStage.emoji}</span>
                <div className="stage-text">
                  <h4>{currentStage.primary}</h4>
                  <motion.p 
                    key={`${currentStage.id}-${subMessageIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="stage-detail"
                  >
                    {currentStage.details[subMessageIndex]}
                  </motion.p>
                </div>
              </motion.div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="expanded-details"
              >
                {/* Progress Stages Overview */}
                <div className="stages-overview">
                  {progressStages.slice(0, -1).map((stage, index) => (
                    <div 
                      key={stage.id}
                      className={`stage-item ${
                        index < currentStageIndex ? 'completed' : 
                        index === currentStageIndex ? 'active' : 'pending'
                      }`}
                    >
                      <span className="stage-mini-emoji">{stage.emoji}</span>
                      <span className="stage-name">{stage.primary}</span>
                      {index < currentStageIndex && <span className="checkmark">✓</span>}
                    </div>
                  ))}
                </div>

                {/* Contextual Message */}
                {getContextualMessage() && (
                  <div className="contextual-message">
                    <p>{getContextualMessage()}</p>
                  </div>
                )}

                {/* Fun Fact / Value Prop for Anonymous */}
                <motion.div 
                  key={currentFunFact}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fun-fact"
                >
                  <p>{!isLoggedIn && currentStageIndex >= 3 ? 
                    "🎯 Sign in after preview to save and customize unlimited content!" :
                    funFacts[currentFunFact]
                  }</p>
                </motion.div>
              </motion.div>
            )}

            {/* Completion State */}
            {isComplete && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="completion-message"
              >
                <span className="success-emoji">🎉</span>
                <p>Your content is ready!</p>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}