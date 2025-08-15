'use client';
import React from 'react';
import { CheckCircle, AlertCircle, XCircle, TrendingUp, Info } from 'lucide-react';

interface QualityCheck {
  id: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  message?: string;
  importance: 'required' | 'recommended' | 'optional';
}

interface QualityDashboardProps {
  checks: {
    mlsCompliance: boolean;
    mlsSelected: boolean;
    targetAudience: boolean;
    hasFeatures: boolean;
    hasPhotos: boolean;
    hasChallenges: boolean;
    hasAddress: boolean;
    hasBrandVoice: boolean;
    propertyTypeSelected: boolean;
    channelsSelected: boolean;
  };
  className?: string;
  compact?: boolean;
}

export default function QualityDashboard({ 
  checks, 
  className = '',
  compact = false 
}: QualityDashboardProps) {
  
  const qualityChecks: QualityCheck[] = [
    {
      id: 'mls',
      label: 'MLS Compliance',
      status: checks.mlsSelected ? (checks.mlsCompliance ? 'pass' : 'warning') : 'warning',
      message: !checks.mlsSelected ? 'Select MLS for compliance checking' : undefined,
      importance: 'required',
    },
    {
      id: 'property',
      label: 'Property Type',
      status: checks.propertyTypeSelected ? 'pass' : 'fail',
      message: !checks.propertyTypeSelected ? 'Required for content strategy' : undefined,
      importance: 'required',
    },
    {
      id: 'audience',
      label: 'Target Audience',
      status: checks.targetAudience ? 'pass' : 'warning',
      message: !checks.targetAudience ? 'Helps personalize content' : undefined,
      importance: 'recommended',
    },
    {
      id: 'features',
      label: 'Key Features',
      status: checks.hasFeatures ? 'pass' : 'warning',
      message: !checks.hasFeatures ? 'Add features for better content' : undefined,
      importance: 'recommended',
    },
    {
      id: 'photos',
      label: 'Photos',
      status: checks.hasPhotos ? 'pass' : 'warning',
      message: !checks.hasPhotos ? 'Photos enhance AI analysis' : undefined,
      importance: 'optional',
    },
    {
      id: 'challenges',
      label: 'Challenges Added',
      status: checks.hasChallenges ? 'pass' : 'warning',
      message: checks.hasChallenges ? 'AI will reframe positively' : 'Optional but helpful',
      importance: 'optional',
    },
  ];

  const getIcon = (status: 'pass' | 'warning' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-yellow-400" />;
      case 'fail':
        return <XCircle className="h-3 w-3 text-red-400" />;
    }
  };

  const passedChecks = qualityChecks.filter(c => c.status === 'pass').length;
  const totalChecks = qualityChecks.length;
  const readinessScore = Math.round((passedChecks / totalChecks) * 100);

  const getReadinessColor = () => {
    if (readinessScore >= 80) return 'text-green-400';
    if (readinessScore >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getReadinessMessage = () => {
    if (readinessScore >= 80) return 'Excellent! Ready for high-quality generation';
    if (readinessScore >= 60) return 'Good! Consider adding more details';
    return 'Add more information for better results';
  };

  if (compact) {
    return (
      <div className={`p-3 bg-neutral-950 rounded-xl border border-white/10 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-white/60" />
            <span className="text-xs text-white/60">Generation Quality</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {qualityChecks.slice(0, 4).map(check => (
                <div key={check.id} className="flex items-center">
                  {getIcon(check.status)}
                </div>
              ))}
            </div>
            <span className={`text-sm font-semibold ${getReadinessColor()}`}>
              {readinessScore}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-neutral-950 rounded-xl border border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-white/60" />
          <span className="text-sm font-medium text-white/80">Generation Readiness</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-2xl font-bold ${getReadinessColor()}`}>
            {readinessScore}%
          </div>
          <div className="text-xs text-white/60">
            {passedChecks}/{totalChecks} optimal
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <div 
          className={`h-full transition-all duration-500 ${
            readinessScore >= 80 ? 'bg-green-400' :
            readinessScore >= 60 ? 'bg-yellow-400' :
            'bg-orange-400'
          }`}
          style={{ width: `${readinessScore}%` }}
        />
      </div>

      {/* Checks grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {qualityChecks.map(check => (
          <div key={check.id} className="flex items-start gap-2">
            {getIcon(check.status)}
            <div className="flex-1">
              <span className="text-white/70">{check.label}</span>
              {check.message && check.status !== 'pass' && (
                <p className="text-white/40 text-[10px] mt-0.5">{check.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Readiness message */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className={`text-xs ${getReadinessColor()}`}>
          {getReadinessMessage()}
        </p>
      </div>

      {/* Tips for improvement */}
      {readinessScore < 80 && (
        <div className="mt-2 p-2 bg-cyan-500/10 rounded-lg">
          <p className="text-xs text-cyan-300 flex items-start gap-1">
            <Info className="h-3 w-3 mt-0.5" />
            <span>
              <strong>Quick tip:</strong> {
                !checks.mlsSelected ? 'Select your MLS for compliance checking.' :
                !checks.targetAudience ? 'Add target buyers for personalized content.' :
                !checks.hasFeatures ? 'Add key property features for richer descriptions.' :
                'Upload photos for AI-powered visual analysis.'
              }
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate quality score
export function calculateQualityScore(checks: QualityDashboardProps['checks']): number {
  let score = 0;
  const weights = {
    mlsCompliance: 15,
    mlsSelected: 10,
    targetAudience: 15,
    hasFeatures: 20,
    hasPhotos: 10,
    hasChallenges: 5,
    hasAddress: 10,
    hasBrandVoice: 5,
    propertyTypeSelected: 20,
    channelsSelected: 10,
  };

  Object.entries(checks).forEach(([key, value]) => {
    if (value && key in weights) {
      score += weights[key as keyof typeof weights];
    }
  });

  return Math.min(100, score);
}