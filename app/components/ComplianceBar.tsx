'use client';
import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { getMLSList, checkFairHousingCompliance, type MLSCompliance } from '@/lib/mlsCompliance';

interface ComplianceBarProps {
  selectedMLS: string;
  onMLSChange: (mlsId: string) => void;
  content?: string; // Optional: check compliance of current content
  className?: string;
}

export default function ComplianceBar({ 
  selectedMLS, 
  onMLSChange, 
  content,
  className = ''
}: ComplianceBarProps) {
  const [mlsList] = useState(getMLSList());
  const [complianceStatus, setComplianceStatus] = useState<'compliant' | 'warning' | 'violation'>('compliant');
  const [showTooltip, setShowTooltip] = useState(false);

  // Check compliance when content changes
  useEffect(() => {
    if (content) {
      const fairHousing = checkFairHousingCompliance(content);
      if (!fairHousing.compliant) {
        setComplianceStatus('violation');
      } else if (content.length > 1000) {
        setComplianceStatus('warning');
      } else {
        setComplianceStatus('compliant');
      }
    } else {
      setComplianceStatus('compliant');
    }
  }, [content]);

  const getStatusIcon = () => {
    switch (complianceStatus) {
      case 'compliant':
        return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-yellow-400" />;
      case 'violation':
        return <AlertCircle className="h-3 w-3 text-red-400" />;
    }
  };

  const getStatusText = () => {
    switch (complianceStatus) {
      case 'compliant':
        return 'Fair Housing Compliant';
      case 'warning':
        return 'Review Recommended';
      case 'violation':
        return 'Compliance Issues Found';
    }
  };

  const getStatusColor = () => {
    switch (complianceStatus) {
      case 'compliant':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'violation':
        return 'text-red-400';
    }
  };

  return (
    <div className={`mb-4 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-400/20 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-3 sm:flex-nowrap">
        <div className="flex items-center gap-3">
          <Shield className="h-4 w-4 text-cyan-400" />
          <div className="flex items-center gap-2">
            <label htmlFor="mls-selector" className="text-xs text-white/60">MLS:</label>
            <select
              id="mls-selector"
              value={selectedMLS}
              onChange={(e) => onMLSChange(e.target.value)}
              className="bg-white/10 border-0 text-sm text-white rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-cyan-400/60"
            >
              <option value="" className="bg-neutral-900">Select MLS...</option>
              {mlsList.map(mls => (
                <option key={mls.id} value={mls.id} className="bg-neutral-900">
                  {mls.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-white/40 hover:text-white/60"
            >
              <Info className="h-3 w-3" />
            </button>
            {showTooltip && (
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-black/90 rounded-lg text-xs text-white/80 z-50">
                <p className="font-semibold mb-1">MLS Compliance</p>
                <p>Automatically checks your content against MLS rules and Fair Housing regulations to prevent violations.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 text-xs ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
      </div>

      {/* Show specific warnings if there are issues */}
      {complianceStatus !== 'compliant' && content && (
        <div className="mt-2 pt-2 border-t border-white/10">
          <div className="text-xs text-white/60">
            {complianceStatus === 'warning' && (
              <p>⚠️ Content length approaching MLS limit</p>
            )}
            {complianceStatus === 'violation' && (
              <p>❌ Potential Fair Housing violation detected. AI will auto-correct.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}