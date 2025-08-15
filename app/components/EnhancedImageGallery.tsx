'use client';
import React, { useState } from 'react';
import { Download, Maximize2, Copy, Share2, Check, Loader2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface EnhancedImage {
  platform: string;
  url: string;
  dimensions: { width: number; height: number };
  size: number;
}

interface EnhancedImageGalleryProps {
  images: EnhancedImage[];
  originalUrl: string;
  isLoading?: boolean;
  onDownload?: (image: EnhancedImage) => void;
  onShare?: (image: EnhancedImage) => void;
  showSuccess?: boolean;
}

const PLATFORM_LABELS = {
  mls: 'MLS Listing',
  instagram: 'Instagram Feed',
  instagram_story: 'Instagram Story',
  facebook: 'Facebook Post',
  email: 'Email Header'
};

const PLATFORM_ICONS = {
  mls: '🏠',
  instagram: '📷',
  instagram_story: '📱',
  facebook: '👥',
  email: '✉️'
};

export default function EnhancedImageGallery({
  images,
  originalUrl,
  isLoading = false,
  onDownload,
  onShare,
  showSuccess = false
}: EnhancedImageGalleryProps) {
  const [selectedPlatform, setSelectedPlatform] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [downloadingPlatform, setDownloadingPlatform] = useState<string | null>(null);

  const currentImage = images[selectedPlatform];

  const handleDownload = async (image: EnhancedImage) => {
    setDownloadingPlatform(image.platform);
    
    try {
      // Check if it's a blob URL or data URL
      if (image.url.startsWith('blob:') || image.url.startsWith('data:')) {
        // For blob/data URLs, we can download directly
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `hero-image-${image.platform}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`[Download] Downloaded ${image.platform} image`);
      } else {
        // For regular URLs, fetch and download
        const response = await fetch(image.url);
        if (!response.ok) throw new Error('Failed to fetch image');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `hero-image-${image.platform}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        window.URL.revokeObjectURL(url);
      }
      
      if (onDownload) onDownload(image);
    } catch (error) {
      console.error('[Download] Failed:', error);
      // Show user-friendly error
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloadingPlatform(null);
    }
  };

  const handleCopyUrl = async (image: EnhancedImage) => {
    try {
      await navigator.clipboard.writeText(image.url);
      setCopiedPlatform(image.platform);
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleDownloadAll = async () => {
    for (const image of images) {
      await handleDownload(image);
      // Add small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-purple-500/20" />
        </div>
        <div className="text-center">
          <p className="text-white font-medium">Creating Your Hero Images</p>
          <p className="text-sm text-white/60 mt-2">Applying enhancements and platform-specific overlays...</p>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4">
          {['MLS', 'Instagram', 'Facebook', 'Email'].map((platform, i) => (
            <div key={platform} className="flex items-center gap-2 text-xs">
              <div className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
              <span className="text-white/60">{platform}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      {showSuccess && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
          <Check className="h-5 w-5 text-green-400" />
          <div>
            <p className="font-medium text-green-300">Hero Images Generated Successfully!</p>
            <p className="text-sm text-white/60 mt-1">
              Your images have been enhanced and optimized for each platform
            </p>
          </div>
        </div>
      )}
      
      {/* Platform Tabs */}
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <button
            key={image.platform}
            onClick={() => setSelectedPlatform(index)}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedPlatform === index
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            <span className="mr-2">{PLATFORM_ICONS[image.platform as keyof typeof PLATFORM_ICONS]}</span>
            {PLATFORM_LABELS[image.platform as keyof typeof PLATFORM_LABELS] || image.platform}
          </button>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="relative rounded-2xl overflow-hidden bg-black/40">
        {showComparison ? (
          // Before/After Comparison View
          <div className="relative aspect-[16/9]">
            <div className="absolute inset-0 overflow-hidden">
              {/* Original Image */}
              <img
                src={originalUrl}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain"
              />
              
              {/* Enhanced Image with Slider */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={currentImage.url}
                  alt="Enhanced"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
              
              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <ChevronLeft className="h-4 w-4 text-black absolute -left-1" />
                  <ChevronRight className="h-4 w-4 text-black absolute -right-1" />
                </div>
              </div>
              
              {/* Labels */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 rounded-lg text-sm">
                Original
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-sm">
                Enhanced
              </div>
            </div>
            
            {/* Slider Control */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
            />
          </div>
        ) : (
          // Single Image View
          <div className="relative aspect-[16/9]">
            <img
              src={currentImage.url}
              alt={`Enhanced ${currentImage.platform}`}
              className="w-full h-full object-contain"
            />
            
            {/* Platform Badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <span className="text-sm font-medium">
                {PLATFORM_LABELS[currentImage.platform as keyof typeof PLATFORM_LABELS]}
              </span>
            </div>
            
            {/* Dimensions Badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 rounded-lg">
              <span className="text-sm">
                {currentImage.dimensions.width} × {currentImage.dimensions.height}
              </span>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-3 py-2 bg-black/70 backdrop-blur rounded-lg hover:bg-black/80 transition-colors flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {showComparison ? 'Hide' : 'Compare'}
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleCopyUrl(currentImage)}
              className="px-3 py-2 bg-black/70 backdrop-blur rounded-lg hover:bg-black/80 transition-colors"
            >
              {copiedPlatform === currentImage.platform ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            
            <button
              onClick={() => handleDownload(currentImage)}
              disabled={downloadingPlatform === currentImage.platform}
              className="px-3 py-2 bg-black/70 backdrop-blur rounded-lg hover:bg-black/80 transition-colors disabled:opacity-50"
            >
              {downloadingPlatform === currentImage.platform ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
            
            {onShare && (
              <button
                onClick={() => onShare(currentImage)}
                className="px-3 py-2 bg-black/70 backdrop-blur rounded-lg hover:bg-black/80 transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDownloadAll}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download All Formats
        </button>
        
        {/* Platform-specific quick downloads */}
        <div className="flex gap-2">
          {images.map((image) => (
            <button
              key={image.platform}
              onClick={() => handleDownload(image)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              title={`Download ${PLATFORM_LABELS[image.platform as keyof typeof PLATFORM_LABELS]}`}
            >
              {PLATFORM_ICONS[image.platform as keyof typeof PLATFORM_ICONS]}
            </button>
          ))}
        </div>
      </div>

      {/* Image Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-white/60">Format</div>
          <div className="font-medium">JPEG</div>
        </div>
        <div>
          <div className="text-white/60">Quality</div>
          <div className="font-medium">High (85%)</div>
        </div>
        <div>
          <div className="text-white/60">Size</div>
          <div className="font-medium">
            {Math.round(currentImage.size / 1024)} KB
          </div>
        </div>
        <div>
          <div className="text-white/60">Optimized For</div>
          <div className="font-medium">
            {PLATFORM_LABELS[currentImage.platform as keyof typeof PLATFORM_LABELS]}
          </div>
        </div>
      </div>
    </div>
  );
}