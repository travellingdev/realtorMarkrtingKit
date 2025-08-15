'use client';
import React, { useState } from 'react';
import HeroImageModule from '../components/HeroImageModule';
import { HERO_IMAGE_CONFIG } from '@/lib/features/heroImage/config';

export default function TestHeroPage() {
  const [photos] = useState(['https://via.placeholder.com/800x600']);
  
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Hero Image Module Test</h1>
      
      <div className="mb-4 p-4 bg-neutral-900 rounded">
        <h2 className="text-lg font-semibold mb-2">Configuration Status:</h2>
        <pre className="text-sm">
          {JSON.stringify({
            enabled: HERO_IMAGE_CONFIG.enabled,
            features: HERO_IMAGE_CONFIG.features,
            freeTierEnabled: HERO_IMAGE_CONFIG.tiers.FREE.enabled,
          }, null, 2)}
        </pre>
      </div>
      
      <div className="border border-cyan-500 p-4 rounded">
        <HeroImageModule
          photos={photos}
          photoInsights={{
            photos: photos,
            features: ['test feature'],
            sellingPoints: ['test selling point'],
            heroCandidate: { index: 0, reason: 'Test photo' }
          }}
          userTier="FREE"
          isLoggedIn={false}
          propertyType="home"
          onUpgrade={() => console.log('Upgrade clicked')}
        />
      </div>
    </div>
  );
}