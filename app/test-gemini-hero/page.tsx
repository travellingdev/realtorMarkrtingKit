'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, Camera, Brain, Palette, FileText } from 'lucide-react';

export default function TestGeminiHeroPage() {
  const [status, setStatus] = useState<string>('Ready to test Gemini AI');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [enhancementParams, setEnhancementParams] = useState<any>(null);
  const [marketingCopy, setMarketingCopy] = useState<any>(null);
  const [error, setError] = useState('');
  
  // Test images
  const testImages = [
    {
      url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      label: 'Modern House Exterior'
    },
    {
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      label: 'Living Room Interior'
    },
    {
      url: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800',
      label: 'Luxury Property'
    }
  ];
  
  const testGeminiAnalysis = async (selectedImage?: string) => {
    setIsLoading(true);
    setError('');
    setStatus('Connecting to Gemini AI...');
    setAnalysis(null);
    setEnhancementParams(null);
    setMarketingCopy(null);
    
    const testUrl = selectedImage || testImages[0].url;
    setImageUrl(testUrl);
    
    try {
      setStatus('Analyzing image with Gemini Vision...');
      
      const response = await fetch('/api/hero-image/gemini-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: testUrl,
          enhancement: 'twilight',
          platform: 'mls',
          propertyDetails: {
            price: '$750,000',
            beds: '4',
            baths: '3',
            propertyType: 'Single Family Home',
            badge: 'NEW LISTING',
            agentInfo: {
              name: 'Jane Smith',
              phone: '555-0123'
            }
          },
          useAI: true
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze with Gemini');
      }
      
      const data = await response.json();
      console.log('Gemini Response:', data);
      
      setAnalysis(data.analysis);
      setEnhancementParams(data.enhancementParams);
      setMarketingCopy(data.marketingCopy);
      
      if (data.analysis) {
        setStatus(`✅ Gemini Analysis Complete! Score: ${data.analysis.score}/100`);
      } else {
        setStatus('✅ Processing complete (AI analysis unavailable)');
      }
      
    } catch (err: any) {
      console.error('Gemini test error:', err);
      setError(err.message);
      setStatus('❌ Gemini test failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Brain className="h-10 w-10 text-purple-400" />
            Gemini AI Hero Image Test
            <Sparkles className="h-10 w-10 text-yellow-400" />
          </h1>
          <p className="text-xl text-white/70">
            Test real AI-powered image analysis and enhancement with Google Gemini
          </p>
        </div>
        
        {/* Status */}
        <div className="mb-8 p-6 bg-black/50 rounded-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold flex items-center gap-3">
              {isLoading && <Loader2 className="h-6 w-6 animate-spin" />}
              {status}
            </div>
            <div className="text-sm text-white/60">
              Powered by Gemini 1.5 Flash
            </div>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/50 text-red-300">
              Error: {error}
            </div>
          )}
        </div>
        
        {/* Image Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Select Test Image:</h3>
          <div className="grid grid-cols-3 gap-4">
            {testImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => testGeminiAnalysis(img.url)}
                disabled={isLoading}
                className="relative group overflow-hidden rounded-lg border-2 border-white/20 hover:border-purple-500 transition-all disabled:opacity-50"
              >
                <img 
                  src={img.url} 
                  alt={img.label}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-medium">{img.label}</p>
                </div>
                <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-8 w-8" />
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Test Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => testGeminiAnalysis()}
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Analyzing with Gemini AI...
              </>
            ) : (
              <>
                <Brain className="h-6 w-6" />
                Test Gemini AI Analysis
              </>
            )}
          </button>
        </div>
        
        {/* Results */}
        {(analysis || enhancementParams || marketingCopy) && (
          <div className="space-y-6">
            {/* Selected Image */}
            {imageUrl && (
              <div className="bg-black/50 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Analyzed Image
                </h3>
                <img 
                  src={imageUrl} 
                  alt="Analyzed" 
                  className="w-full max-w-2xl mx-auto rounded-lg"
                />
              </div>
            )}
            
            {/* AI Analysis */}
            {analysis && (
              <div className="bg-black/50 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  Gemini AI Analysis
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2">Property Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>Room Type: <span className="text-white/70">{analysis.roomType}</span></div>
                      <div>Overall Score: <span className="text-green-400 font-bold">{analysis.score}/100</span></div>
                      {analysis.description && (
                        <div className="mt-2 p-2 bg-white/5 rounded">
                          {analysis.description}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2">Quality Metrics</h4>
                    <div className="space-y-2 text-sm">
                      {analysis.lighting && (
                        <div>Lighting: <span className="text-white/70">{analysis.lighting.quality}/10 ({analysis.lighting.type})</span></div>
                      )}
                      {analysis.composition && (
                        <div>Composition: <span className="text-white/70">{analysis.composition.score}/10</span></div>
                      )}
                      {analysis.marketability && (
                        <div>Marketing: <span className="text-white/70">{analysis.marketability.score}/10</span></div>
                      )}
                    </div>
                  </div>
                  
                  {analysis.enhancements && (
                    <div className="col-span-2">
                      <h4 className="font-semibold text-purple-300 mb-2">AI Recommendations</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.enhancements.recommended?.map((rec: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-purple-500/20 rounded-full text-sm">
                            {rec}
                          </span>
                        ))}
                      </div>
                      {analysis.enhancements.priority && (
                        <div className="mt-2 text-sm">
                          Priority Enhancement: <span className="text-yellow-400 font-semibold">{analysis.enhancements.priority}</span>
                          {analysis.enhancements.expectedImprovement && (
                            <span className="ml-2 text-green-400">
                              (+{analysis.enhancements.expectedImprovement}% improvement)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Enhancement Parameters */}
            {enhancementParams && (
              <div className="bg-black/50 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-blue-400" />
                  AI-Generated Enhancement Parameters
                </h3>
                {enhancementParams.filters && (
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-2">Filter Adjustments</h4>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      {Object.entries(enhancementParams.filters).map(([key, value]) => (
                        <div key={key} className="p-2 bg-white/5 rounded">
                          <span className="text-white/60">{key}:</span>
                          <span className="ml-2 font-mono text-blue-300">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {enhancementParams.description && (
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    {enhancementParams.description}
                  </div>
                )}
              </div>
            )}
            
            {/* Marketing Copy */}
            {marketingCopy && (
              <div className="bg-black/50 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-400" />
                  AI-Generated Marketing Copy
                </h3>
                <div className="space-y-4">
                  {marketingCopy.headline && (
                    <div>
                      <h4 className="font-semibold text-green-300 mb-1">Headline</h4>
                      <p className="text-lg">{marketingCopy.headline}</p>
                    </div>
                  )}
                  {marketingCopy.description && (
                    <div>
                      <h4 className="font-semibold text-green-300 mb-1">Description</h4>
                      <p className="text-white/80">{marketingCopy.description}</p>
                    </div>
                  )}
                  {marketingCopy.sellingPoints && (
                    <div>
                      <h4 className="font-semibold text-green-300 mb-1">Key Selling Points</h4>
                      <ul className="list-disc list-inside text-white/80">
                        {marketingCopy.sellingPoints.map((point: string, idx: number) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Info Box */}
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border border-white/20">
          <h3 className="font-semibold mb-3 text-lg">How This Works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-white/80">
            <li>Select or upload a property photo</li>
            <li>Gemini Vision AI analyzes the image for quality, composition, and marketing potential</li>
            <li>AI generates specific enhancement parameters based on the photo</li>
            <li>Marketing copy is created using AI understanding of the property</li>
            <li>Client-side Canvas applies the AI-recommended enhancements</li>
          </ol>
          <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <p className="text-sm text-yellow-300">
              <strong>Note:</strong> This uses Google Gemini 1.5 Flash for analysis. Image enhancement is done client-side with AI-guided parameters.
              For full image generation, consider Imagen 3 or DALL-E integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}