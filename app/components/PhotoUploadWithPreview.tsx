'use client';
import React, { useState, useCallback } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Eye, 
  Sparkles, 
  Lock,
  X,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import AnalysisPreview from './AnalysisPreview';
import { 
  canUploadPhotos, 
  canAnalyzePhotos, 
  canPreviewAnalysis,
  getPhotoLimit,
  getPhotoAnalysisLevel,
  getPhotoLimitMessage,
  checkPhotoLimitExceeded,
  getTierConfig,
  canAnalyzePhotosWithTrial,
  getPhotoAnalysisMessage,
  getRemainingPhotoAnalysisTrials
} from '@/lib/tiers';

interface PhotoUploadWithPreviewProps {
  photos: File[];
  setPhotos: (files: File[]) => void;
  userTier: string;
  kitsUsed?: number;
  onUpgrade?: (targetTier: string) => void;
  onBlockedAttempt?: (feature: string) => void;
  className?: string;
}

interface PhotoPreview {
  file: File;
  url: string;
  id: string;
}

export default function PhotoUploadWithPreview({
  photos,
  setPhotos,
  userTier,
  kitsUsed = 0,
  onUpgrade,
  onBlockedAttempt,
  className = ''
}: PhotoUploadWithPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Get tier capabilities (with trial system)
  const canUpload = canUploadPhotos(userTier);
  const canAnalyze = canAnalyzePhotosWithTrial(userTier, kitsUsed);
  const canPreview = canPreviewAnalysis(userTier);
  const photoLimit = getPhotoLimit(userTier);
  const analysisLevel = getPhotoAnalysisLevel(userTier);
  const limitMessage = getPhotoLimitMessage(userTier);
  const analysisMessage = getPhotoAnalysisMessage(userTier, kitsUsed);
  const remainingTrials = getRemainingPhotoAnalysisTrials(userTier, kitsUsed);
  const isLimitExceeded = checkPhotoLimitExceeded(userTier, photos.length);
  
  // Create photo previews
  const photoPreviews: PhotoPreview[] = photos.map((file, index) => ({
    file,
    url: URL.createObjectURL(file),
    id: `${file.name}-${index}`
  }));

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || !canUpload) {
      // Track blocked photo upload attempt
      if (onBlockedAttempt && !canUpload) {
        onBlockedAttempt('photoUpload');
      }
      return;
    }
    
    const newFiles = Array.from(files).filter(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) return false;
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) return false;
      return true;
    });
    
    // Apply photo limit
    const currentCount = photos.length;
    const maxAllowed = photoLimit > 0 ? photoLimit : 10; // Default max for unlimited tiers
    const availableSlots = maxAllowed - currentCount;
    const filesToAdd = newFiles.slice(0, availableSlots);
    
    setPhotos([...photos, ...filesToAdd]);
  }, [photos, setPhotos, canUpload, photoLimit, onBlockedAttempt]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const removePhoto = useCallback((indexToRemove: number) => {
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  }, [photos, setPhotos]);

  const getUpgradeRecommendation = () => {
    if (analysisLevel === 'none' || analysisLevel === 'preview') {
      return { tier: 'STARTER', reason: 'photo_analysis' };
    }
    if (analysisLevel === 'basic') {
      return { tier: 'PROFESSIONAL', reason: 'advanced_features' };
    }
    return null;
  };

  if (!canUpload) {
    // Should not happen with new tier structure, but safety fallback
    return (
      <div className={`p-4 border border-red-400/20 bg-red-500/10 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Photo upload not available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-white/80">
            <ImageIcon className="h-4 w-4" />
            Photos for AI Analysis
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">
              {limitMessage}
            </span>
            {analysisLevel !== 'full' && (
              <span className="text-xs px-2 py-1 bg-cyan-400/10 text-cyan-400 rounded-full">
                {analysisLevel === 'preview' ? 'Preview Mode' : analysisLevel === 'basic' ? 'Basic Analysis' : 'No Analysis'}
              </span>
            )}
          </div>
        </div>

        {/* File Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative rounded-2xl border-2 border-dashed transition-all cursor-pointer
            ${dragActive 
              ? 'border-cyan-400 bg-cyan-400/10' 
              : 'border-white/20 hover:border-white/30 bg-neutral-950/50'
            }
            ${isLimitExceeded ? 'border-amber-400/50 bg-amber-400/5' : ''}
          `}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLimitExceeded}
          />
          
          <div className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className={`p-3 rounded-xl ${dragActive ? 'bg-cyan-400/20' : 'bg-white/10'}`}>
                <Upload className={`h-6 w-6 ${dragActive ? 'text-cyan-400' : 'text-white/60'}`} />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                {photos.length === 0 
                  ? 'Drop photos here or click to upload'
                  : `Add more photos (${photos.length} uploaded)`
                }
              </p>
              <p className="text-xs text-white/60">
                JPG, PNG, HEIC up to 10MB each
              </p>
              {isLimitExceeded && (
                <p className="text-xs text-amber-400 flex items-center justify-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Photo limit reached for {userTier} tier
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Photo Previews */}
        {photoPreviews.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">
                {photoPreviews.length} photo{photoPreviews.length > 1 ? 's' : ''} ready
              </span>
              {photoPreviews.length > 0 && (
                <button
                  onClick={() => setPhotos([])}
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photoPreviews.map((photo, index) => (
                <div key={photo.id} className="group relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-neutral-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {index >= photoLimit && photoLimit > 0 && (
                    <div className="absolute inset-0 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4 text-amber-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Status & Actions */}
      {photoPreviews.length > 0 && (
        <div className="space-y-3">
          {canAnalyze ? (
            <div className="p-3 bg-green-500/10 border border-green-400/20 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-green-300 mb-1">
                    {analysisMessage}
                  </p>
                  <p className="text-xs text-green-300/80">
                    AI will analyze {Math.min(photoPreviews.length, photoLimit || photoPreviews.length)} photo{Math.min(photoPreviews.length, photoLimit || photoPreviews.length) > 1 ? 's' : ''} - {analysisLevel === 'basic' 
                      ? 'Basic room detection and feature extraction'
                      : 'Full analysis with room scoring and marketing angles'
                    }
                  </p>
                  {remainingTrials > 0 && (
                    <div className="mt-2 px-2 py-1 bg-green-400/20 rounded text-xs text-green-200">
                      🎉 FREE TRIAL: {remainingTrials} kit{remainingTrials > 1 ? 's' : ''} with photo analysis remaining
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : canPreview ? (
            <div className="p-3 bg-cyan-500/10 border border-cyan-400/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-cyan-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-cyan-300 mb-2">
                    See what AI analysis would find in your photos
                  </p>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="text-xs bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Preview AI Analysis
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-neutral-800/50 border border-white/10 rounded-lg">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-white/60 mt-0.5" />
                <div>
                  <p className="text-sm text-white/80 mb-1">
                    Photos uploaded successfully
                  </p>
                  <p className="text-xs text-white/60">
                    Upgrade to get AI analysis of your property photos
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade Suggestion */}
          {(() => {
            const recommendation = getUpgradeRecommendation();
            if (recommendation && onUpgrade) {
              const tierConfig = getTierConfig(recommendation.tier);
              return (
                <div className="p-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-400/20 rounded-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-white mb-1">
                        {recommendation.reason === 'photo_analysis' 
                          ? 'Get AI analysis of your photos'
                          : 'Unlock advanced photo features'
                        }
                      </p>
                      <p className="text-xs text-white/70">
                        {recommendation.reason === 'photo_analysis'
                          ? `Analyze up to ${tierConfig.features.visionLimit} photos per kit`
                          : 'Hero image generation + unlimited photo analysis'
                        }
                      </p>
                    </div>
                    <button
                      onClick={() => onUpgrade(recommendation.tier)}
                      className="text-xs bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                    >
                      Upgrade to {tierConfig.displayName}
                    </button>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Photo Tips */}
      {photoPreviews.length === 0 && (
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-white/60 mb-2">💡 Pro tip: Include these photos for best AI results:</p>
          <div className="grid grid-cols-2 gap-1 text-xs text-white/50">
            <span>• Front exterior</span>
            <span>• Kitchen</span>
            <span>• Living room</span>
            <span>• Master bedroom</span>
            <span>• Best feature (pool, view, etc.)</span>
            <span>• Any unique selling points</span>
          </div>
        </div>
      )}

      {/* Analysis Preview Modal */}
      {showPreview && (
        <AnalysisPreview
          photos={photos}
          onClose={() => setShowPreview(false)}
          onUpgrade={(tier) => {
            setShowPreview(false);
            onUpgrade?.(tier);
          }}
        />
      )}
    </div>
  );
}