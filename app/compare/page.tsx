'use client';
import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function ComparePage() {
  const [showV1, setShowV1] = useState(true);
  const [showV2, setShowV2] = useState(true);

  const versions = [
    {
      id: 'v1',
      name: 'Current Version',
      description: 'Existing design with technical channels and full form',
      url: '/',
      features: [
        '20+ form fields',
        'Technical channel selection',
        'Platform-focused messaging',
        'Complex preset system'
      ]
    },
    {
      id: 'v2', 
      name: 'Simplified Version',
      description: 'Outcome-focused design with smart defaults',
      url: '/v2',
      features: [
        '5 essential fields only',
        'Outcome-based content types',
        'Persona-aware messaging',
        'Smart auto-configuration'
      ]
    }
  ];

  const personas = [
    { id: 'new-agent', name: 'New Agent', url: '/new-agent' },
    { id: 'luxury', name: 'Luxury Specialist', url: '/luxury' },
    { id: 'team', name: 'Team Leader', url: '/team' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-cyan-400" />
            <h1 className="text-3xl font-bold">Version Comparison</h1>
          </div>
          <p className="text-white/70 max-w-2xl mx-auto">
            Compare the current design with the new outcome-focused approach. 
            Test different versions and personas to see which performs better.
          </p>
        </div>

        {/* Version Controls */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setShowV1(!showV1)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              showV1 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {showV1 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Current Version
          </button>
          
          <button
            onClick={() => setShowV2(!showV2)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              showV2 
                ? 'bg-cyan-500 text-white' 
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {showV2 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            New Version
          </button>
        </div>

        {/* Version Comparison Cards */}
        <div className={`grid gap-8 mb-12 ${showV1 && showV2 ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
          {showV1 && (
            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold">Current Version</h2>
                </div>
                <p className="text-white/70 text-sm">Technical approach with full customization</p>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Features:</h3>
                <ul className="space-y-2 text-sm text-white/80">
                  {versions[0].features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={versions[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
              >
                View Current <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}

          {showV2 && (
            <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  <h2 className="text-xl font-semibold">New Version</h2>
                  <span className="text-xs bg-cyan-400/20 text-cyan-300 px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-white/70 text-sm">Outcome-focused with smart defaults</p>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Improvements:</h3>
                <ul className="space-y-2 text-sm text-white/80">
                  {versions[1].features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={versions[1].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-all"
              >
                View New Version <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>

        {/* Persona Testing */}
        <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-8">
          <h2 className="text-xl font-semibold mb-4">Test Different Personas</h2>
          <p className="text-white/70 text-sm mb-6">
            The new version adapts messaging and content based on agent type. Test different entry points:
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {personas.map((persona) => (
              <div key={persona.id} className="border border-white/10 rounded-lg p-4">
                <h3 className="font-medium mb-2">{persona.name}</h3>
                <p className="text-xs text-white/60 mb-3">
                  See how the experience changes for {persona.name.toLowerCase()}s
                </p>
                <a
                  href={persona.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  Test Persona <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics to Watch */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-neutral-900/60 p-8">
          <h2 className="text-xl font-semibold mb-4">Success Metrics to Compare</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium mb-3 text-cyan-400">User Experience Metrics</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Time to first generation (target: &lt;2 min)</li>
                <li>• Form completion rate (target: &gt;80%)</li>
                <li>• User confusion/support requests</li>
                <li>• Return usage within 7 days</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-cyan-400">Business Metrics</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>• Conversion rate (trial → paid)</li>
                <li>• Feature adoption rate</li>
                <li>• User satisfaction scores</li>
                <li>• Word-of-mouth referrals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}