'use client';
import React from 'react';
import { Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface PhotoAnalysisStatusProps {
  status: 'uploading' | 'analyzing' | 'completed' | 'failed' | 'tier_limited' | 'none';
  photoCount: number;
  userTier: string;
  insights?: any;
  onUpgrade?: (tier: string) => void;
}

export default function PhotoAnalysisStatus({ 
  status, 
  photoCount, 
  userTier, 
  insights,
  onUpgrade 
}: PhotoAnalysisStatusProps) {
  if (status === 'none' || photoCount === 0) return null;

  const getStatusDisplay = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: <Clock className="h-4 w-4 animate-spin" />,
          text: `Uploading ${photoCount} photo${photoCount > 1 ? 's' : ''}...`,
          bgColor: 'bg-blue-500/10 border-blue-400/20',
          textColor: 'text-blue-300'
        };
      
      case 'analyzing':
        return {
          icon: <Eye className="h-4 w-4 animate-pulse" />,
          text: `AI analyzing ${photoCount} photo${photoCount > 1 ? 's' : ''}...`,
          bgColor: 'bg-purple-500/10 border-purple-400/20',
          textColor: 'text-purple-300'
        };
      
      case 'completed':
        const roomCount = insights?.rooms?.length || 0;
        const featureCount = insights?.features?.length || 0;
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: `Analysis complete: ${roomCount} room${roomCount !== 1 ? 's' : ''}, ${featureCount} feature${featureCount !== 1 ? 's' : ''} detected`,
          bgColor: 'bg-green-500/10 border-green-400/20',
          textColor: 'text-green-300'
        };
      
      case 'failed':
        return {
          icon: <XCircle className="h-4 w-4" />,
          text: 'Photo analysis failed - continuing with basic generation',
          bgColor: 'bg-red-500/10 border-red-400/20',
          textColor: 'text-red-300'
        };
      
      case 'tier_limited':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          text: `Photo analysis not available on ${userTier} tier`,
          bgColor: 'bg-yellow-500/10 border-yellow-400/20',
          textColor: 'text-yellow-300'
        };
      
      default:
        return null;
    }
  };

  const statusDisplay = getStatusDisplay();
  if (!statusDisplay) return null;

  return (
    <div className={`p-3 rounded-lg border ${statusDisplay.bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {statusDisplay.icon}
          <span className={`text-sm ${statusDisplay.textColor}`}>
            {statusDisplay.text}
          </span>
        </div>
        
        {status === 'tier_limited' && onUpgrade && (
          <button
            onClick={() => onUpgrade('STARTER')}
            className="text-xs bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 px-3 py-1 rounded-lg transition-colors"
          >
            Upgrade for Analysis
          </button>
        )}
      </div>
      
      {status === 'completed' && insights?.sellingPoints?.length > 0 && (
        <div className="mt-2 text-xs text-green-200/80">
          Key selling points: {insights.sellingPoints.slice(0, 3).join(', ')}
        </div>
      )}
    </div>
  );
}