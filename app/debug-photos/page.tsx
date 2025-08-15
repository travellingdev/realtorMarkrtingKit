'use client';
import { useState } from 'react';
import { useUser } from '@/app/providers/UserProvider';
import { getTierConfig, canUseFeature } from '@/lib/tiers';
import PhotoAnalysisStatus from '@/app/components/PhotoAnalysisStatus';

type AnalysisStatus = 'none' | 'uploading' | 'analyzing' | 'completed' | 'failed' | 'tier_limited';

export default function PhotoDebugPage() {
  const { user } = useUser();
  const [photos, setPhotos] = useState<File[]>([]);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('none');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testCompleteFlow = async () => {
    if (!user || photos.length === 0) {
      addLog('❌ Need to be logged in with photos uploaded');
      return;
    }

    setTestResults([]);
    const userTier = 'FREE'; // You can modify this to test different tiers
    const tierConfig = getTierConfig(userTier);
    
    addLog(`🔍 Starting complete photo analysis test`);
    addLog(`👤 User tier: ${userTier}`);
    addLog(`📷 Photos ready: ${photos.length}`);
    
    // Test 1: Check tier capabilities
    const hasVision = canUseFeature(userTier, 'vision');
    const hasPhotoUpload = canUseFeature(userTier, 'photoUpload');
    
    addLog(`✅ Photo upload allowed: ${hasPhotoUpload}`);
    addLog(`${hasVision ? '✅' : '❌'} Vision analysis allowed: ${hasVision}`);
    
    if (!hasVision) {
      setAnalysisStatus('tier_limited');
      addLog(`⚠️ Photos will be stripped from API call due to tier restrictions`);
      addLog(`💡 Upgrade to STARTER tier to enable photo analysis`);
      return;
    }
    
    // Test 2: Simulate upload process
    setAnalysisStatus('uploading');
    addLog(`🔄 Simulating photo upload...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 3: Check environment variables
    addLog(`🔄 Checking backend configuration...`);
    
    try {
      // Call a simple API to test if OpenAI is configured
      const response = await fetch('/api/debug-openai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      if (!response.ok) {
        addLog(`❌ Backend configuration issue: ${response.status}`);
        setAnalysisStatus('failed');
        return;
      }
      
      const config = await response.json();
      addLog(`${config.openaiConfigured ? '✅' : '❌'} OpenAI API Key: ${config.openaiConfigured ? 'Configured' : 'Missing'}`);
      
      if (!config.openaiConfigured) {
        setAnalysisStatus('failed');
        addLog(`💡 Add OPENAI_API_KEY to environment variables`);
        return;
      }
      
    } catch (error) {
      addLog(`❌ Failed to check backend config: ${error}`);
    }
    
    // Test 4: Simulate analysis
    setAnalysisStatus('analyzing');
    addLog(`🤖 Simulating AI photo analysis...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful analysis
    const mockInsights = {
      rooms: [
        { type: 'kitchen', features: ['granite counters', 'stainless appliances'] },
        { type: 'living', features: ['hardwood floors', 'fireplace'] }
      ],
      features: ['granite counters', 'hardwood floors', 'stainless appliances', 'fireplace'],
      sellingPoints: ['modern kitchen', 'cozy living space', 'updated finishes'],
      heroCandidate: { index: 0, reason: 'kitchen with granite counters' }
    };
    
    setAnalysisStatus('completed');
    setDebugInfo(mockInsights);
    addLog(`✅ Analysis completed successfully`);
    addLog(`📊 Found ${mockInsights.rooms.length} rooms, ${mockInsights.features.length} features`);
    addLog(`🎯 Recommended hero image: Photo 1 (${mockInsights.heroCandidate.reason})`);
    
    // Test 5: Content integration
    addLog(`🔄 Testing content generation with insights...`);
    const photoContext = [
      'PHOTO ANALYSIS INSIGHTS:',
      `Rooms: ${mockInsights.rooms.map(r => `${r.type} (${r.features.join(', ')})`).join('; ')}`,
      `Features: ${mockInsights.features.join(', ')}`,
      `Selling points: ${mockInsights.sellingPoints.join(', ')}`,
    ].join('\n');
    
    addLog(`✅ Photo context for AI:`);
    addLog(`📝 "${photoContext.substring(0, 100)}..."`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setPhotos(Array.from(files));
      setAnalysisStatus('none');
      addLog(`📷 Selected ${files.length} photo${files.length > 1 ? 's' : ''}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Photo Analysis Flow Debug</h1>
        
        {!user && (
          <div className="p-4 bg-red-500/20 border border-red-400/20 rounded-lg mb-8">
            <p className="text-red-300">⚠️ You must be logged in to debug photo analysis</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Photo Upload */}
          <div className="p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">1. Upload Test Photos</h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
            {photos.length > 0 && (
              <p className="mt-2 text-green-300">✅ {photos.length} photo{photos.length > 1 ? 's' : ''} selected</p>
            )}
          </div>

          {/* Analysis Status */}
          <div className="p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">2. Analysis Status</h2>
            <PhotoAnalysisStatus 
              status={analysisStatus}
              photoCount={photos.length}
              userTier="FREE"
              insights={debugInfo}
              onUpgrade={(tier) => addLog(`🔄 Would upgrade to ${tier} tier`)}
            />
          </div>

          {/* Test Button */}
          <div className="p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">3. Run Complete Flow Test</h2>
            <button
              onClick={testCompleteFlow}
              disabled={!user || photos.length === 0}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 rounded-lg font-medium"
            >
              Test Complete Photo → AI → Content Flow
            </button>
          </div>

          {/* Debug Logs */}
          {testResults.length > 0 && (
            <div className="p-6 bg-neutral-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">4. Debug Log</h2>
              <div className="bg-black rounded-lg p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
                {testResults.map((result, i) => (
                  <div key={i} className="text-green-300">{result}</div>
                ))}
              </div>
              <button
                onClick={() => setTestResults([])}
                className="mt-2 text-sm text-gray-400 hover:text-white"
              >
                Clear Log
              </button>
            </div>
          )}

          {/* Current Issues */}
          <div className="p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">5. Known Issues & Solutions</h2>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-red-500/20 rounded">
                <h4 className="font-semibold text-red-300">❌ FREE Tier Issue</h4>
                <p className="text-red-200">FREE tier users never get photo analysis - photos are stripped in API</p>
                <p className="text-red-200 text-xs mt-1">Solution: Allow basic analysis for FREE, limit advanced features</p>
              </div>
              
              <div className="p-3 bg-yellow-500/20 rounded">
                <h4 className="font-semibold text-yellow-300">⚠️ Silent Failures</h4>
                <p className="text-yellow-200">Analysis failures are hidden from users</p>
                <p className="text-yellow-200 text-xs mt-1">Solution: Add PhotoAnalysisStatus component to forms</p>
              </div>
              
              <div className="p-3 bg-blue-500/20 rounded">
                <h4 className="font-semibold text-blue-300">💡 Missing Feedback</h4>
                <p className="text-blue-200">Users don&apos;t know if/how their photos are being used</p>
                <p className="text-blue-200 text-xs mt-1">Solution: Show analysis progress and results prominently</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}