'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, Home, Sofa, Download } from 'lucide-react';

export default function TestDALLEPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState('');
  const [editedImage, setEditedImage] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'listing-ready' | 'staging'>('listing-ready');
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Test images
  const testImages = [
    {
      url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      label: 'House Exterior',
      type: 'exterior'
    },
    {
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      label: 'Living Room',
      type: 'interior'
    },
    {
      url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800',
      label: 'Empty Room',
      type: 'empty'
    }
  ];
  
  const loadingMessages = {
    'listing-ready': [
      '🎨 Analyzing composition...',
      '☀️ Perfecting the lighting...',
      '📐 Straightening those angles...',
      '🧹 Removing distractions...',
      '✨ Adding professional polish...',
      '📸 Finalizing enhancements...'
    ],
    'staging': [
      '🛋️ Selecting furniture style...',
      '🖼️ Placing artwork...',
      '💡 Setting up lighting...',
      '🪴 Adding decor elements...',
      '🏡 Creating that home feeling...',
      '✨ Final touches...'
    ]
  };
  
  const testDALLEEdit = async (imageUrl: string) => {
    setIsProcessing(true);
    setError('');
    setEditedImage('');
    setOriginalImage(imageUrl);
    
    // Start rotating messages
    let messageIndex = 0;
    const messages = loadingMessages[mode];
    setLoadingMessage(messages[0]);
    
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
    }, 2500);
    
    try {
      console.log('Testing DALL-E edit with:', { imageUrl, mode });
      
      const response = await fetch('/api/hero-image/openai-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          mode,
          enhancement: 'brightness'
        })
      });
      
      clearInterval(messageInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to edit image');
      }
      
      const data = await response.json();
      console.log('DALL-E response:', data);
      
      if (data.success && data.editedUrl) {
        setEditedImage(data.editedUrl);
        setLoadingMessage('✅ Enhancement complete!');
      } else {
        throw new Error('No edited image returned');
      }
      
    } catch (err: any) {
      clearInterval(messageInterval);
      console.error('DALL-E test error:', err);
      setError(err.message);
      setLoadingMessage('');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🎨 DALL-E Image Enhancement Test
        </h1>
        
        {/* Mode Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Enhancement Mode:</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode('listing-ready')}
              className={`p-6 rounded-xl border-2 transition-all ${
                mode === 'listing-ready'
                  ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              <Sparkles className="h-8 w-8 mb-2 mx-auto" />
              <h3 className="font-semibold">Listing Ready</h3>
              <p className="text-sm text-white/60 mt-1">Professional corrections & cleanup</p>
            </button>
            
            <button
              onClick={() => setMode('staging')}
              className={`p-6 rounded-xl border-2 transition-all ${
                mode === 'staging'
                  ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              <Sofa className="h-8 w-8 mb-2 mx-auto" />
              <h3 className="font-semibold">Virtual Staging</h3>
              <p className="text-sm text-white/60 mt-1">Add furniture to empty rooms</p>
            </button>
          </div>
        </div>
        
        {/* Test Images */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Test Image:</h2>
          <div className="grid grid-cols-3 gap-4">
            {testImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => testDALLEEdit(img.url)}
                disabled={isProcessing}
                className="relative group overflow-hidden rounded-lg border-2 border-white/20 hover:border-purple-500 transition-all disabled:opacity-50"
              >
                <img 
                  src={img.url} 
                  alt={img.label}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-medium">{img.label}</p>
                  <p className="text-xs text-white/60">{img.type}</p>
                </div>
                {img.type === 'empty' && mode === 'staging' && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/80 rounded text-xs">
                    Best for staging
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Processing State */}
        {isProcessing && (
          <div className="mb-8 p-8 bg-black/50 rounded-xl border border-purple-500/30">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
              <p className="text-lg font-medium mb-2">Enhancing with AI...</p>
              <p className="text-white/60 animate-pulse">{loadingMessage}</p>
              <div className="w-full max-w-md mt-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 animate-progress" />
                </div>
                <p className="text-xs text-white/40 text-center mt-2">
                  This may take 15-20 seconds
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Results */}
        {originalImage && editedImage && !isProcessing && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Before & After:</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-white/60 mb-2">Original</p>
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="w-full rounded-lg border border-white/20"
                />
              </div>
              <div>
                <p className="text-sm text-white/60 mb-2">DALL-E Enhanced ({mode})</p>
                <img 
                  src={editedImage} 
                  alt="Enhanced" 
                  className="w-full rounded-lg border-2 border-purple-500 shadow-lg shadow-purple-500/30"
                />
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = editedImage;
                    a.download = `enhanced-${mode}-${Date.now()}.jpg`;
                    a.click();
                  }}
                  className="mt-3 w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Enhanced Image
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
            <p className="font-semibold">Error:</p>
            <p className="text-sm">{error}</p>
            {error.includes('API key') && (
              <p className="text-xs mt-2 text-white/60">
                Make sure OPENAI_API_KEY is set in your .env.local file
              </p>
            )}
          </div>
        )}
        
        {/* Info */}
        <div className="mt-12 p-6 bg-white/5 rounded-xl">
          <h3 className="font-semibold mb-3">How it works:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-white/80">
            <li>Select enhancement mode (Listing Ready or Virtual Staging)</li>
            <li>Click on a test image</li>
            <li>Image is sent to OpenAI DALL-E for editing</li>
            <li>DALL-E applies the requested enhancements</li>
            <li>Enhanced image is displayed with download option</li>
          </ol>
          <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <p className="text-sm text-yellow-300">
              <strong>Note:</strong> DALL-E 2 is used for editing. Each edit costs ~$0.02. 
              Make sure your OpenAI API key has credits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}