'use client';
import React, { useState } from 'react';
import {
  X,
  Eye,
  Sparkles,
  Home,
  ChefHat,
  Sofa,
  Bed,
  Star,
  TrendingUp,
  ArrowRight,
  Lightbulb,
  Camera,
  Zap
} from 'lucide-react';

interface AnalysisPreviewProps {
  photos: File[];
  onClose: () => void;
  onUpgrade: (targetTier: string) => void;
}

// Sample analysis data to show what AI can detect
const SAMPLE_ANALYSIS = {
  rooms: [
    {
      type: 'Kitchen',
      icon: ChefHat,
      confidence: 95,
      features: ['Granite countertops', 'Stainless steel appliances', 'Island seating', 'Pendant lighting'],
      condition: 'Excellent',
      marketingValue: 9
    },
    {
      type: 'Living Room', 
      icon: Sofa,
      confidence: 88,
      features: ['Hardwood floors', 'Fireplace', 'Large windows', 'Vaulted ceilings'],
      condition: 'Very Good',
      marketingValue: 8
    },
    {
      type: 'Master Bedroom',
      icon: Bed,
      confidence: 92,
      features: ['Walk-in closet', 'Ensuite bathroom', 'Carpet flooring', 'Good natural light'],
      condition: 'Good',
      marketingValue: 7
    },
    {
      type: 'Exterior',
      icon: Home,
      confidence: 89,
      features: ['Brick facade', 'Covered porch', 'Mature landscaping', 'Attached garage'],
      condition: 'Very Good', 
      marketingValue: 9
    }
  ],
  overallFeatures: [
    'Updated kitchen with granite counters',
    'Hardwood floors throughout main level',
    'Fireplace in living room',
    'Master suite with walk-in closet',
    'Covered front porch',
    'Mature landscaping'
  ],
  marketingAngles: [
    'Perfect for entertaining with open kitchen layout',
    'Move-in ready condition throughout',
    'Great curb appeal with mature landscaping',
    'Family-friendly layout with good flow'
  ],
  sellingPoints: [
    'Recently updated kitchen',
    'Excellent natural light',
    'Low maintenance exterior',
    'Desirable neighborhood location'
  ]
};

export default function AnalysisPreview({ photos, onClose, onUpgrade }: AnalysisPreviewProps) {
  const [activeTab, setActiveTab] = useState<'rooms' | 'features' | 'marketing'>('rooms');

  const tabs = [
    { id: 'rooms' as const, label: 'Room Analysis', icon: Home },
    { id: 'features' as const, label: 'Key Features', icon: Star },
    { id: 'marketing' as const, label: 'Marketing Angles', icon: TrendingUp }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">AI Photo Analysis Preview</h3>
              <p className="text-sm text-white/70">
                See what our AI would analyze in your {photos.length} photo{photos.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="px-6 py-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-400/20 rounded-lg">
              <Eye className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Demo Analysis Results</p>
              <p className="text-xs text-white/70">
                This shows sample results. Upgrade to get real AI analysis of your specific photos.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(90vh-200px)]">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-cyan-400/10 text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'rooms' && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  {SAMPLE_ANALYSIS.rooms.map((room, index) => {
                    const Icon = room.icon;
                    return (
                      <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-cyan-400/20 rounded-lg">
                            <Icon className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-white">{room.type}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                                  {room.confidence}% confidence
                                </span>
                                <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                                  Marketing Value: {room.marketingValue}/10
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-white/70 mb-2">Condition: {room.condition}</p>
                            <div className="space-y-1">
                              <p className="text-xs text-white/60">Detected Features:</p>
                              <div className="flex flex-wrap gap-1">
                                {room.features.map((feature, idx) => (
                                  <span 
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-white/10 text-white/80 rounded-full"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {SAMPLE_ANALYSIS.overallFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-white">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-400/20">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-300 mb-1">Selling Points Identified</p>
                      <ul className="space-y-1">
                        {SAMPLE_ANALYSIS.sellingPoints.map((point, index) => (
                          <li key={index} className="text-xs text-green-200 flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'marketing' && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {SAMPLE_ANALYSIS.marketingAngles.map((angle, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-cyan-400 mt-0.5" />
                      <span className="text-sm text-white">{angle}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
                  <div className="flex items-start gap-2">
                    <Camera className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-300 mb-2">Enhanced Copy Example</p>
                      <p className="text-xs text-purple-200 leading-relaxed">
                        &ldquo;Step into this stunning home featuring a chef&rsquo;s dream kitchen with granite countertops 
                        and stainless steel appliances. The open floor plan flows seamlessly from the gourmet 
                        kitchen to the spacious living room with soaring vaulted ceilings and cozy fireplace. 
                        Beautiful hardwood floors throughout the main level add warmth and elegance&hellip;&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-6 border-t border-white/10 bg-gradient-to-r from-neutral-900 to-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white mb-1">
                Ready to analyze your actual photos?
              </p>
              <p className="text-xs text-white/70">
                Get real AI analysis with room detection, feature extraction, and marketing copy enhancement.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => onUpgrade('STARTER')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Upgrade to Starter
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}