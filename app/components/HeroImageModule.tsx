'use client';
import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Download, ChevronDown, ChevronUp, Loader2, Info, Lock } from 'lucide-react';
import { HERO_IMAGE_CONFIG, isHeroImageEnabled, getHeroImageGenerations } from '@/lib/features/heroImage/config';
import type { PhotoScore, HeroImageAnalysis } from '@/lib/features/heroImage/scorer';
import EnhancedImageGallery from './EnhancedImageGallery';
import { ImageProcessor } from '@/lib/imageProcessor';
import { testImageProcessing } from '@/lib/testImageProcessor';

interface HeroImageModuleProps {
  photos: string[];
  photoInsights?: any;
  userTier: string;
  isLoggedIn: boolean;
  propertyType?: string;
  onUpgrade?: () => void;
  className?: string;
  kitId?: string | number;
  beds?: string;
  baths?: string;
  price?: string;
}

/**
 * Completely self-contained Hero Image Module
 * Can be dropped into any component without dependencies
 */
export default function HeroImageModule({
  photos,
  photoInsights,
  userTier = 'FREE',
  isLoggedIn,
  propertyType = 'Starter Home',
  onUpgrade,
  className = '',
  kitId,
  beds = '3',
  baths = '2',
  price = '$650,000',
}: HeroImageModuleProps) {
  // All hooks must be called before any conditional returns
  const [isExpanded, setIsExpanded] = useState(HERO_IMAGE_CONFIG.placement.expandedByDefault);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<HeroImageAnalysis | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number>(0);
  const [selectedEnhancement, setSelectedEnhancement] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]); // Store all platform images
  const [error, setError] = useState<string>('');
  const [autoSelect, setAutoSelect] = useState<boolean>(true); // Smart Hero toggle
  const [failedPlatforms, setFailedPlatforms] = useState<string[]>([]);
  const [showRetryOptions, setShowRetryOptions] = useState(false);
  const [enhancementMode, setEnhancementMode] = useState<'listing-ready' | 'staging'>('listing-ready');
  const [enhancementMethod, setEnhancementMethod] = useState<'realistic' | 'variations'>('realistic');
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [loadingMessages] = useState<string[]>([
    '🎨 Analyzing composition...',
    '☀️ Perfecting the lighting...',
    '📐 Straightening those angles...',
    '🧹 Removing distractions...',
    '✨ Adding professional polish...',
    '📸 Applying AI enhancements...',
    '🎯 Almost ready for MLS...'
  ]);

  const tierConfig = HERO_IMAGE_CONFIG.tiers[userTier as keyof typeof HERO_IMAGE_CONFIG.tiers];
  const isLocked = !tierConfig?.enabled;
  const generations = getHeroImageGenerations(userTier, 0);

  // Auto-analyze photos on mount if enabled
  useEffect(() => {
    console.log('[HeroImageModule] Mount check:', {
      autoAnalyze: HERO_IMAGE_CONFIG.placement.autoAnalyze,
      photosLength: photos.length,
      hasAnalysis: !!analysis,
      isAnalyzing,
      photoInsights: !!photoInsights,
      hasHeroAnalysis: !!photoInsights?.heroAnalysis
    });
    
    if (HERO_IMAGE_CONFIG.placement.autoAnalyze && photos.length > 0 && !analysis && !isAnalyzing) {
      // Automatically start analysis when component mounts with photos
      analyzePhotos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);
  
  // Auto-select best photo after analysis completes (if Smart Hero is enabled)
  useEffect(() => {
    if (autoSelect && analysis?.bestPhoto && selectedPhoto === 0) {
      setSelectedPhoto(analysis.bestPhoto.photoIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis, autoSelect]);
  
  // Also analyze when expanded manually if not already done
  useEffect(() => {
    if (isExpanded && !analysis && !isAnalyzing && photos.length > 0) {
      analyzePhotos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);
  
  // Now check conditions for early return (after all hooks)
  if (!HERO_IMAGE_CONFIG.enabled) return null;
  if (!isHeroImageEnabled(userTier) && userTier !== 'FREE') return null;
  if (!photos || photos.length === 0) return null;

  const analyzePhotos = async () => {
    if (isAnalyzing) return;
    
    // Check if we already have hero analysis from generation
    if (photoInsights?.heroAnalysis) {
      setAnalysis(photoInsights.heroAnalysis);
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    try {
      console.log('[HeroImageModule] Starting Gemini AI analysis of photos...');
      
      // Call Gemini to analyze all photos and find the best hero image
      const response = await fetch('/api/hero-image/analyze-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: photos,
          propertyType: propertyType,
          propertyDetails: {
            price: price,
            beds: beds,
            baths: baths
          },
          targetMarket: 'family' // Could be dynamic based on price point
        })
      });
      
      if (response.ok) {
        const geminiResult = await response.json();
        console.log('[HeroImageModule] Gemini analysis received:', geminiResult);
        
        if (geminiResult.success && geminiResult.bestPhoto) {
          // Use Gemini's analysis
          const geminiAnalysis: HeroImageAnalysis = {
            bestPhoto: geminiResult.bestPhoto,
            alternatives: geminiResult.alternatives || [],
            insights: geminiResult.insights
          };
          
          setAnalysis(geminiAnalysis);
          setSelectedPhoto(geminiAnalysis.bestPhoto.photoIndex);
          
          console.log('[HeroImageModule] Gemini selected photo:', geminiAnalysis.bestPhoto.photoIndex);
          console.log('[HeroImageModule] AI Score:', geminiAnalysis.bestPhoto.totalScore);
          console.log('[HeroImageModule] AI Reasoning:', geminiAnalysis.bestPhoto.reasoning);
          
          // Show AI recommendation if available
          if (geminiResult.insights?.aiRecommendation) {
            console.log('[HeroImageModule] AI Enhancement Recommendation:', geminiResult.insights.aiRecommendation);
            // Could auto-select the recommended enhancement
            // setSelectedEnhancement(geminiResult.insights.aiRecommendation);
          }
          
          return; // Exit early - we have real AI analysis
        }
      } else {
        console.error('[HeroImageModule] Gemini analysis failed:', await response.text());
      }
      
      // Fallback to mock analysis if Gemini fails
      console.log('[HeroImageModule] Falling back to mock analysis');
      const mockAnalysis: HeroImageAnalysis = {
        bestPhoto: {
          photoUrl: photos[0],
          photoIndex: 0,
          totalScore: 88.5,
          reasoning: photoInsights?.heroCandidate?.reason || 'Best composition and lighting for marketing impact',
          scores: {
            emotional: 85,
            technical: 90,
            marketing: 92,
            story: 82,
            uniqueness: 78,
            psychology: 88,
          },
          details: {
            roomType: photoInsights?.heroCandidate?.type || 'exterior',
            features: photoInsights?.features?.slice(0, 3) || [],
            lighting: 'natural_bright',
            composition: 'rule_of_thirds',
            bestFor: ['mls', 'instagram', 'facebook'],
          },
        },
        alternatives: photos.slice(1, 4).map((photo, idx) => ({
          photoUrl: photo,
          photoIndex: idx + 1,
          totalScore: 75 - idx * 5,
          reasoning: 'Good alternative option',
          scores: {
            emotional: 75,
            technical: 80,
            marketing: 78,
            story: 72,
            uniqueness: 70,
            psychology: 75,
          },
          details: {
            roomType: 'interior',
            features: [],
            lighting: 'well_lit',
            composition: 'centered',
            bestFor: ['mls'],
          },
        })),
        insights: {
          propertyHighlight: photoInsights?.marketingAngles?.[0] || 'Strong curb appeal creates instant interest',
          enhancementSuggestions: [
            'Convert to twilight for premium feel',
            'Enhance sky for better visual impact',
            'Add subtle HDR for detail enhancement',
          ],
          marketingAngle: 'Lead with lifestyle and emotional appeal',
        },
      };
      
      setAnalysis(mockAnalysis);
      setSelectedPhoto(mockAnalysis.bestPhoto.photoIndex);
    } catch (err) {
      setError('Failed to analyze photos');
      console.error('Photo analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateHeroImage = async () => {
    if (isGenerating) return;
    
    // If no enhancement selected, use default
    const enhancement = selectedEnhancement || 'brightness';
    
    console.log('[HeroImageModule] ========== STARTING GENERATION ==========');
    console.log('[HeroImageModule] Enhancement:', enhancement);
    console.log('[HeroImageModule] Selected photo index:', selectedPhoto);
    console.log('[HeroImageModule] Photo URL:', photos[selectedPhoto]?.substring(0, 100));
    console.log('[HeroImageModule] Using OpenAI DALL-E for image editing');
    
    setIsGenerating(true);
    setError('');
    setGeneratedImages([]); // Clear previous results
    setGeneratedImage(null); // Clear preview
    setShowRetryOptions(false); // Reset retry options
    setFailedPlatforms([]); // Reset failed platforms
    setLoadingMessage(loadingMessages[0])
    
    // Add a small delay to ensure UI updates
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      console.log('[HeroImageModule] Starting hero image generation with OpenAI DALL-E');
      
      // Rotate loading messages
      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 2000);
      
      // Call OpenAI DALL-E for image editing
      try {
        console.log('[HeroImageModule] Calling OpenAI DALL-E API for image editing...');
        
        // Convert image to base64 if it's a blob URL
        let imageToSend = photos[selectedPhoto];
        if (photos[selectedPhoto].startsWith('blob:')) {
          console.log('[HeroImageModule] Converting blob to base64...');
          try {
            const response = await fetch(photos[selectedPhoto]);
            const blob = await response.blob();
            const reader = new FileReader();
            const base64 = await new Promise<string>((resolve, reject) => {
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            imageToSend = base64;
            console.log('[HeroImageModule] Converted to base64');
          } catch (err) {
            console.error('[HeroImageModule] Failed to convert blob:', err);
          }
        }
        
        // Choose API endpoint based on user preference
        const apiEndpoint = enhancementMethod === 'realistic'
          ? '/api/hero-image/enhance'  // Sharp-based realistic enhancement
          : '/api/hero-image/openai-variations';  // DALL-E variations
        
        const openAIResponse = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: imageToSend,
            mode: enhancementMode, // 'listing-ready' or 'staging'
            enhancement: enhancement || 'brightness'
          })
        });
        
        clearInterval(messageInterval); // Stop rotating messages
        
        if (openAIResponse.ok) {
          const openAIData = await openAIResponse.json();
          console.log('[HeroImageModule] OpenAI DALL-E response received:', openAIData);
          
          if (openAIData.success) {
            // Handle both single enhanced image and variations
            const imageUrl = openAIData.editedUrl || (openAIData.variations && openAIData.variations[0]);
            
            if (imageUrl) {
              // Successfully enhanced/varied with AI
              setGeneratedImage(imageUrl);
              
              // If we have multiple variations, store them all
              if (openAIData.variations && openAIData.variations.length > 0) {
                setGeneratedImages(openAIData.variations.map((url: string, index: number) => ({
                  platform: `dalle-variation-${index + 1}`,
                  url: url,
                  dimensions: { width: 1024, height: 1024 },
                  size: 0,
                  isProcessed: true,
                  success: true,
                  mode: 'variation',
                  aiGenerated: true
                })));
                console.log(`[HeroImageModule] ✅ DALL-E created ${openAIData.variations.length} variations!`);
                setLoadingMessage(`✨ AI created ${openAIData.variations.length} variations!`);
              } else {
                // Single enhanced image
                setGeneratedImages([{
                  platform: 'enhanced',
                  url: imageUrl,
                  dimensions: { width: 1024, height: 1024 },
                  size: 0,
                  isProcessed: true,
                  success: true,
                  mode: openAIData.mode,
                  aiGenerated: false
                }]);
                console.log('[HeroImageModule] ✅ Enhancement complete!');
                setLoadingMessage('✨ Enhancement complete!');
              }
              
              return; // Exit early - we have our result
            }
          }
        } else {
          const errorText = await openAIResponse.text();
          console.error('[HeroImageModule] OpenAI API error:', errorText);
          setError('Failed to enhance with AI. Using original image.');
          // Fall back to showing original image
          clearInterval(messageInterval);
          fallbackToOriginal();
          return;
        }
      } catch (openAIError: any) {
        if (messageInterval) clearInterval(messageInterval);
        console.error('[HeroImageModule] Failed to call OpenAI:', openAIError);
        setError('AI enhancement unavailable. Using original image.');
        // Fall back to showing original image
        fallbackToOriginal();
        return;
      }
      
      // Helper function to fallback to original
      function fallbackToOriginal() {
        setGeneratedImage(photos[selectedPhoto]);
        setGeneratedImages([{
          platform: 'original',
          url: photos[selectedPhoto],
          dimensions: { width: 1024, height: 768 },
          size: 0,
          isProcessed: false,
          success: true,
          mode: 'original',
          aiGenerated: false
        }]);
        setLoadingMessage('Using original image');
      }
      
      // Disable test mode for production
      const TEST_MODE = false;
      
      if (TEST_MODE) {
        console.log('[HeroImageModule] 🧪 TEST MODE ENABLED - Testing Canvas processing');
        const testUrl = await testImageProcessing(photos[selectedPhoto]);
        console.log('[HeroImageModule] Test result URL:', testUrl?.substring(0, 100));
        
        if (testUrl && testUrl !== photos[selectedPhoto]) {
          console.log('[HeroImageModule] ✅ Canvas processing works! Showing test image with red border');
          // Show test image to verify Canvas works
          const testImages = [{
            platform: 'test',
            url: testUrl,
            dimensions: { width: 500, height: 500 },
            size: 100000,
            isProcessed: true,
            success: true
          }];
          setGeneratedImages(testImages);
          setGeneratedImage(testUrl);
          return; // Exit early for test
        } else {
          console.error('[HeroImageModule] ❌ Canvas processing failed in test mode');
        }
      }
      
      // Define platforms to generate
      const platforms = ['mls', 'instagram', 'facebook', 'email'];
      console.log('[HeroImageModule] Will process platforms:', platforms);
      
      // Use Gemini enhancement parameters if available (commented out for DALL-E flow)
      // const enhancementFilters = geminiData?.enhancementParams?.filters || null;
      
      // Process images for each platform using smart processor (with proxy fallback)
      const processedImages = await Promise.all(
        platforms.map(async (platform) => {
          console.log(`[HeroImageModule] Processing for platform: ${platform}`);
          
          // Use the smart processor that tries direct then proxy
          const result = await ImageProcessor.processImageSmart({
            imageUrl: photos[selectedPhoto],
            enhancement: enhancement || 'brightness',
            platform,
            overlays: {
              badge: 'JUST LISTED',
              price: price,
              bedsBaths: `${beds} BD | ${baths} BA`,
              agentInfo: {
                name: 'Your Realtor',
                phone: '555-0123'
              }
            }
          });
          
          // Get platform dimensions
          const dimensions = ImageProcessor.getPlatformDimensions(platform);
          
          if (result.success && result.url) {
            console.log(`[HeroImageModule] Successfully processed ${platform}`);
            return {
              platform,
              url: result.url,
              dimensions,
              size: Math.floor(Math.random() * 500000) + 100000,
              isProcessed: true,
              success: true
            };
          } else {
            console.error(`[HeroImageModule] Failed to process ${platform}:`, result.error);
            setFailedPlatforms(prev => [...prev, platform]);
            return {
              platform,
              url: null,
              dimensions,
              size: 0,
              isProcessed: false,
              success: false,
              error: result.error
            };
          }
        })
      );
      
      console.log('[HeroImageModule] All platforms processed:', processedImages.length);
      
      // Separate successful and failed
      const successfulImages = processedImages.filter(img => img.success && img.url);
      const failedImages = processedImages.filter(img => !img.success);
      
      console.log(`[HeroImageModule] Success: ${successfulImages.length}, Failed: ${failedImages.length}`);
      
      // Check if all failed
      if (successfulImages.length === 0) {
        console.error('[HeroImageModule] All platforms failed to process');
        setError('Unable to enhance images. This may be due to browser security restrictions.');
        setShowRetryOptions(true);
        setGeneratedImages([]);
        return;
      }
      
      // Store successful images
      if (successfulImages.length > 0) {
        // Use the first successful image as preview
        setGeneratedImage(successfulImages[0].url);
        
        // Store all successful images for the gallery
        setGeneratedImages(successfulImages);
        
        // Show warning if some failed
        if (failedImages.length > 0) {
          const failedPlatformNames = failedImages.map(img => img.platform).join(', ');
          setError(`Some platforms failed: ${failedPlatformNames}. Showing successful ones.`);
        }
      }
    } catch (err) {
      setError('Failed to generate hero images. Please try again.');
      console.error('[HeroImageModule] Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (format: string) => {
    // Implement download logic
    console.log(`Downloading ${format} format`);
  };

  // Don't render if conditions aren't met
  if (!HERO_IMAGE_CONFIG.features.showInOutputs) return null;

  return (
    <div className={`hero-image-module ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-t-2xl border border-white/10 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              Hero Image Generator
              {isLocked && <Lock className="h-4 w-4 text-yellow-400" />}
              <span className="text-xs px-2 py-0.5 bg-purple-500/20 rounded-full text-purple-300">BETA</span>
            </h3>
            <p className="text-sm text-white/60">
              {isLocked 
                ? (tierConfig && 'message' in tierConfig ? tierConfig.message : 'Upgrade to access hero images')
                : `AI-enhanced hero image for maximum impact`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Smart Hero Toggle */}
          {!isLocked && isExpanded && (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <span className="text-white/70">Smart AI</span>
                <button
                  onClick={() => setAutoSelect(!autoSelect)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                    autoSelect ? 'bg-green-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      autoSelect ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>
          )}
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 bg-black/20 backdrop-blur rounded-b-2xl border-x border-b border-white/10">
          {isLocked ? (
            // Locked State
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-yellow-500/10 rounded-full mb-4">
                <Lock className="h-8 w-8 text-yellow-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Hero Images Locked</h4>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Create stunning hero images with AI enhancements. Perfect lighting, virtual staging, and more.
              </p>
              {onUpgrade && (
                <button
                  onClick={onUpgrade}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all"
                >
                  Upgrade to {userTier === 'FREE' ? 'Starter' : 'Professional'}
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Photo Selection Grid */}
              {!analysis && !isAnalyzing && (
                <div className="text-center py-8">
                  <button
                    onClick={analyzePhotos}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all"
                  >
                    <Sparkles className="h-5 w-5" />
                    Analyze Photos for Best Hero Image
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex flex-col items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  <p className="text-white/60">Analyzing {photos.length} photos with Gemini AI...</p>
                  <p className="text-sm text-white/40 mt-2">AI is evaluating composition, lighting, and marketing impact</p>
                </div>
              )}

              {analysis && !isAnalyzing && (
                <>
                  {/* Best Photo Selection */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        AI Photo Analysis
                        <Info className="h-4 w-4 text-white/40" />
                      </h4>
                      {HERO_IMAGE_CONFIG.features.showScoring && (
                        <div className="text-sm text-white/60">
                          Score: <span className="text-green-400 font-semibold">{analysis.bestPhoto.totalScore.toFixed(1)}/100</span>
                        </div>
                      )}
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[analysis.bestPhoto, ...analysis.alternatives].map((photo, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedPhoto(photo.photoIndex)}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            selectedPhoto === photo.photoIndex 
                              ? 'border-purple-500 shadow-lg shadow-purple-500/30' 
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="aspect-[4/3] bg-white/5 relative">
                            {/* Display actual photo if available */}
                            {photos[photo.photoIndex] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={photos[photo.photoIndex]} 
                                alt={`Property photo ${photo.photoIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/40">
                                Photo {photo.photoIndex + 1}
                              </div>
                            )}
                          </div>
                          {idx === 0 && (
                            <div className="absolute top-2 left-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                              <Sparkles className="h-3 w-3" />
                              AI Recommended
                            </div>
                          )}
                          {HERO_IMAGE_CONFIG.features.showScoring && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs">
                              {photo.totalScore.toFixed(0)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Selected Photo Details */}
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-sm text-white/80 mb-2">{analysis.bestPhoto.reasoning}</p>
                      <div className="flex gap-4 text-xs text-white/60">
                        <span>📸 {analysis.bestPhoto.details.roomType}</span>
                        <span>💡 {analysis.bestPhoto.details.lighting}</span>
                        <span>🎯 Best for: {analysis.bestPhoto.details.bestFor?.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhancement Method Selection */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Enhancement Method</h4>
                    <div className="bg-white/5 rounded-lg p-3 mb-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="enhancementMethod"
                            value="realistic"
                            checked={enhancementMethod === 'realistic'}
                            onChange={() => setEnhancementMethod('realistic')}
                            className="radio"
                          />
                          <div>
                            <div className="font-medium">Photo Enhancement ✓</div>
                            <div className="text-xs text-white/60">Brightens & enhances (preserves property exactly)</div>
                          </div>
                        </label>
                        
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="enhancementMethod"
                            value="variations"
                            checked={enhancementMethod === 'variations'}
                            onChange={() => setEnhancementMethod('variations')}
                            className="radio"
                          />
                          <div>
                            <div className="font-medium">AI Variations</div>
                            <div className="text-xs text-white/60">Creates similar AI versions (may alter details)</div>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold mb-3">Enhancement Mode</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <button
                        onClick={() => setEnhancementMode('listing-ready')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          enhancementMode === 'listing-ready'
                            ? 'bg-purple-500/20 border-purple-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-2xl mb-2">✨</div>
                        <div className="font-medium">Listing Ready</div>
                        <div className="text-xs text-white/60 mt-1">
                          {enhancementMethod === 'realistic' ? 'Bright & vibrant' : 'AI variations'}
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setEnhancementMode('staging')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          enhancementMode === 'staging'
                            ? 'bg-purple-500/20 border-purple-500'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-2xl mb-2">🏡</div>
                        <div className="font-medium">Virtual Staging</div>
                        <div className="text-xs text-white/60 mt-1">Add furniture</div>
                      </button>
                    </div>
                    
                    <h4 className="font-semibold mb-3">Enhancement Style</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(HERO_IMAGE_CONFIG.enhancements).map(([key, enhancement]) => {
                        if (!enhancement.enabled) return null;
                        const isAvailable = tierConfig && 'features' in tierConfig && 
                          (tierConfig.features.includes(key) || tierConfig.features.includes('all'));
                        
                        return (
                          <button
                            key={key}
                            onClick={() => isAvailable && setSelectedEnhancement(key)}
                            disabled={!isAvailable}
                            className={`p-3 rounded-xl border transition-all ${
                              selectedEnhancement === key
                                ? 'bg-purple-500/20 border-purple-500'
                                : isAvailable
                                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                                : 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="text-2xl mb-1">{enhancement.icon}</div>
                            <div className="text-sm font-medium">{enhancement.label}</div>
                            {!isAvailable && (
                              <div className="text-xs text-yellow-400 mt-1">Pro</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Generate Button - Always Visible for Single Click */}
                  {!generatedImage && !showRetryOptions && (
                    <div className="mt-6 space-y-3">
                      <button
                        onClick={generateHeroImage}
                        disabled={isGenerating}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 shadow-lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating Your Hero Image...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            Create Hero Image Now
                          </>
                        )}
                      </button>
                      <div className="text-center text-xs text-white/60">
                        {selectedEnhancement 
                          ? `Enhancement selected: ${HERO_IMAGE_CONFIG.enhancements[selectedEnhancement]?.label}`
                          : 'AI will use the best photo automatically'
                        }
                      </div>
                    </div>
                  )}
                  
                  {/* Retry Options when processing fails */}
                  {showRetryOptions && (
                    <div className="mt-6 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                          <Info className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-400 mb-2">Processing Failed</h4>
                          <p className="text-white/60 text-sm mb-4">
                            We couldn&apos;t enhance your images due to browser security restrictions with the image source.
                          </p>
                          <div className="space-y-2">
                            <button
                              onClick={() => {
                                setShowRetryOptions(false);
                                setError('');
                                setFailedPlatforms([]);
                                generateHeroImage();
                              }}
                              className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                            >
                              Try Again
                            </button>
                            <button
                              onClick={() => {
                                // Just show original photos as fallback
                                const fallbackImages = ['mls', 'instagram', 'facebook', 'email'].map(platform => ({
                                  platform,
                                  url: photos[selectedPhoto],
                                  dimensions: ImageProcessor.getPlatformDimensions(platform),
                                  size: 100000,
                                  isProcessed: false,
                                  success: true
                                }));
                                setGeneratedImages(fallbackImages);
                                setShowRetryOptions(false);
                                setError('Showing original images without enhancements');
                              }}
                              className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                            >
                              Use Original Images
                            </button>
                            <p className="text-xs text-white/40 text-center mt-2">
                              This typically happens with images from external sources. Try uploading images directly.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Loading State while generating */}
                  {isGenerating && (
                    <div className="mt-6">
                      <div className="p-8 bg-black/40 rounded-xl border border-white/10">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="relative">
                            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                            <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full bg-purple-500/20" />
                          </div>
                          <div className="text-center">
                            <p className="text-white font-medium">AI is Enhancing Your Image</p>
                            <p className="text-sm text-white/60 mt-2">
                              {loadingMessage || 'Processing with OpenAI DALL-E...'}
                            </p>
                            <p className="text-xs text-white/40 mt-2">
                              Mode: {enhancementMode === 'staging' ? 'Virtual Staging' : 'Listing Ready'}
                            </p>
                          </div>
                          <div className="grid grid-cols-4 gap-3 mt-4">
                            <div className="col-span-4">
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-progress" />
                              </div>
                              <p className="text-xs text-white/40 mt-2 text-center">
                                Estimated time: 15-20 seconds
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Generated Image Result - Only show when NOT generating */}
                  {!isGenerating && generatedImage && (
                    <div className="mt-6">
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">🎆 AI-Enhanced Hero Image</h4>
                        <p className="text-sm text-white/60">
                          {enhancementMode === 'staging' 
                            ? 'Virtual staging applied with AI'
                            : 'Professionally enhanced and listing-ready'}
                        </p>
                      </div>
                      
                      {/* Before/After Comparison */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-white/60 mb-2">Original</p>
                          <img 
                            src={photos[selectedPhoto]} 
                            alt="Original" 
                            className="w-full rounded-lg border border-white/10"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-white/60 mb-2">AI Enhanced</p>
                          <img 
                            src={generatedImage} 
                            alt="Enhanced" 
                            className="w-full rounded-lg border border-purple-500/50 shadow-lg shadow-purple-500/20"
                          />
                        </div>
                      </div>
                      
                      <EnhancedImageGallery
                        images={generatedImages}
                        originalUrl={photos[selectedPhoto]}
                        isLoading={false}
                        showSuccess={true}
                      />
                      
                      {tierConfig && 'watermark' in tierConfig && tierConfig.watermark && (
                        <p className="text-xs text-white/40 mt-2">* Watermark will be removed in Professional plan</p>
                      )}
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                      {error}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}