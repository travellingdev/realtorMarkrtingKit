'use client';

import React, { useState } from 'react';
import { ImageProcessor } from '@/lib/imageProcessor';

export default function TestHeroImagePage() {
  const [status, setStatus] = useState<string>('Ready to test');
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  
  const testImageUrl = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800';
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log('[TestPage]', message);
  };
  
  const testDirectCanvas = async () => {
    setStatus('Testing direct Canvas processing...');
    setError('');
    setProcessedUrl('');
    setLogs([]);
    
    try {
      addLog('Starting direct Canvas test');
      
      // Test with Unsplash image (should have CORS headers)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('No canvas context');
      }
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = testImageUrl;
      });
      
      addLog(`Image loaded: ${img.width}x${img.height}`);
      
      canvas.width = 600;
      canvas.height = 400;
      
      // Apply filter
      ctx.filter = 'brightness(120%) contrast(110%) saturate(130%)';
      addLog('Applied filters');
      
      // Draw image
      ctx.drawImage(img, 0, 0, 600, 400);
      addLog('Drew image to canvas');
      
      // Add red border to verify processing
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, 600, 400);
      addLog('Added red border');
      
      // Add text
      ctx.fillStyle = '#FFFF00';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('CANVAS WORKS!', 150, 200);
      addLog('Added text overlay');
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create blob'));
        }, 'image/jpeg', 0.85);
      });
      
      const url = URL.createObjectURL(blob);
      addLog(`Created blob URL: ${url.substring(0, 50)}`);
      
      setOriginalUrl(testImageUrl);
      setProcessedUrl(url);
      setStatus('✅ Canvas processing works!');
      
    } catch (err: any) {
      addLog(`Error: ${err.message}`);
      setError(err.message);
      setStatus('❌ Canvas processing failed');
    }
  };
  
  const testWithProcessor = async () => {
    setStatus('Testing with ImageProcessor...');
    setError('');
    setProcessedUrl('');
    setLogs([]);
    
    try {
      addLog('Starting ImageProcessor test');
      
      const result = await ImageProcessor.processImageSmart({
        imageUrl: testImageUrl,
        enhancement: 'brightness',
        platform: 'mls',
        overlays: {
          badge: 'TEST',
          price: '$500,000',
          bedsBaths: '3 BD | 2 BA',
          agentInfo: {
            name: 'Test Agent',
            phone: '555-0123'
          }
        }
      });
      
      addLog(`Processing result: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      
      if (result.success && result.url) {
        setOriginalUrl(testImageUrl);
        setProcessedUrl(result.url);
        setStatus('✅ ImageProcessor works!');
      } else {
        throw new Error(result.error || 'Processing failed');
      }
      
    } catch (err: any) {
      addLog(`Error: ${err.message}`);
      setError(err.message);
      setStatus('❌ ImageProcessor failed');
    }
  };
  
  const testWithSupabaseImage = async () => {
    setStatus('Testing with Supabase image via proxy...');
    setError('');
    setProcessedUrl('');
    setLogs([]);
    
    // Use a sample Supabase URL (replace with actual)
    const supabaseUrl = 'https://zvluybacxnbdodkwvqse.supabase.co/storage/v1/object/public/property-photos/example.jpg';
    
    try {
      addLog('Starting Supabase image test with proxy');
      
      const result = await ImageProcessor.processImageSmart({
        imageUrl: supabaseUrl,
        enhancement: 'twilight',
        platform: 'instagram',
        overlays: {
          badge: 'NEW LISTING',
          price: '$750,000'
        }
      });
      
      addLog(`Processing result: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      addLog(`Error: ${result.error || 'none'}`);
      
      if (result.success && result.url) {
        setOriginalUrl(supabaseUrl);
        setProcessedUrl(result.url);
        setStatus('✅ Proxy processing works!');
      } else {
        throw new Error(result.error || 'Processing failed');
      }
      
    } catch (err: any) {
      addLog(`Error: ${err.message}`);
      setError(err.message);
      setStatus('❌ Proxy processing failed');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hero Image Canvas Test</h1>
        
        {/* Status */}
        <div className="mb-6 p-4 bg-black/50 rounded-lg border border-white/10">
          <div className="text-xl font-semibold">{status}</div>
          {error && (
            <div className="mt-2 text-red-400">Error: {error}</div>
          )}
        </div>
        
        {/* Test Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={testDirectCanvas}
            className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Test Direct Canvas
            <div className="text-sm text-white/70 mt-1">Basic Canvas API test</div>
          </button>
          
          <button
            onClick={testWithProcessor}
            className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            Test ImageProcessor
            <div className="text-sm text-white/70 mt-1">With Unsplash image</div>
          </button>
          
          <button
            onClick={testWithSupabaseImage}
            className="p-4 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
          >
            Test Proxy Method
            <div className="text-sm text-white/70 mt-1">With Supabase image</div>
          </button>
        </div>
        
        {/* Image Comparison */}
        {(originalUrl || processedUrl) && (
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Original</h3>
              <div className="bg-black/30 rounded-lg overflow-hidden border border-white/10">
                {originalUrl ? (
                  <img src={originalUrl} alt="Original" className="w-full" />
                ) : (
                  <div className="h-64 flex items-center justify-center text-white/40">
                    No original image
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Processed</h3>
              <div className="bg-black/30 rounded-lg overflow-hidden border border-white/10">
                {processedUrl ? (
                  <img src={processedUrl} alt="Processed" className="w-full" />
                ) : (
                  <div className="h-64 flex items-center justify-center text-white/40">
                    No processed image
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-black/50 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Processing Logs</h3>
            <div className="font-mono text-sm space-y-1">
              {logs.map((log, idx) => (
                <div key={idx} className="text-white/70">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
          <h3 className="font-semibold mb-2">Testing Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-white/80">
            <li>Click &quot;Test Direct Canvas&quot; to verify Canvas API works in your browser</li>
            <li>Click &quot;Test ImageProcessor&quot; to test the processing library with a CORS-enabled image</li>
            <li>Click &quot;Test Proxy Method&quot; to test processing with Supabase images via proxy</li>
            <li>Check browser console for detailed logs</li>
            <li>Processed images should show visible changes (borders, text, filters)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}