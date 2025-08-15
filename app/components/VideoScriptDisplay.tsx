"use client";
import React from 'react';
import { Clock, Mic, Type, Camera } from 'lucide-react';

interface VideoScriptSegment {
  time: string;
  voice: string;
  text: string;
  shot: string;
}

interface VideoScriptDisplayProps {
  scriptLines?: string[];
}

export default function VideoScriptDisplay({ scriptLines }: VideoScriptDisplayProps) {
  if (!scriptLines || scriptLines.length === 0) {
    return null;
  }

  // Parse the script lines into structured segments
  const parseScriptSegment = (scriptData: any): VideoScriptSegment[] => {
    const segments: VideoScriptSegment[] = [];
    
    if (!scriptData || !Array.isArray(scriptData)) {
      return segments;
    }
    
    // Check if it's already in object format
    if (scriptData.length > 0 && typeof scriptData[0] === 'object' && 'voice' in scriptData[0]) {
      // New object format - use directly
      return scriptData.map(seg => ({
        time: seg.time || '',
        voice: seg.voice || '',
        text: seg.text || '',
        shot: seg.shot || ''
      }));
    }
    
    // Legacy string format parsing
    for (let i = 0; i < scriptData.length; i++) {
      const line = scriptData[i];
      
      if (typeof line !== 'string') continue;
      
      // Check if this line starts with a time marker
      const timeMatch = line.match(/^\[([^\]]+)\]/);
      if (timeMatch) {
        const time = timeMatch[1];
        const content = line.substring(timeMatch[0].length).trim();
        
        // Parse VOICE, TEXT, and SHOT from the content
        // Look for patterns like "VOICE: ... TEXT: ... SHOT: ..."
        const voiceMatch = content.match(/VOICE:\s*([^]*?)(?:\s*TEXT:|$)/);
        const textMatch = content.match(/TEXT:\s*([^]*?)(?:\s*SHOT:|$)/);
        const shotMatch = content.match(/SHOT:\s*([^]*?)$/);
        
        // Debug logging
        if (!voiceMatch && !textMatch && !shotMatch && content.includes('VOICE:')) {
          console.log('Failed to parse segment:', content);
        }
        
        // If we have structured format
        if (voiceMatch || textMatch || shotMatch) {
          segments.push({
            time,
            voice: voiceMatch ? voiceMatch[1].trim() : '',
            text: textMatch ? textMatch[1].trim() : '',
            shot: shotMatch ? shotMatch[1].trim() : ''
          });
        } else {
          // Fallback: treat the whole content as voice
          segments.push({
            time,
            voice: content,
            text: '',
            shot: ''
          });
        }
      }
    }
    
    return segments;
  };

  const segments = parseScriptSegment(scriptLines);

  // Color coding for different time segments
  const getTimeColor = (time: string) => {
    if (time.includes('0-3')) return 'text-purple-400 border-purple-500/30';
    if (time.includes('4-10')) return 'text-blue-400 border-blue-500/30';
    if (time.includes('11-20')) return 'text-green-400 border-green-500/30';
    if (time.includes('21-30')) return 'text-orange-400 border-orange-500/30';
    return 'text-gray-400 border-gray-500/30';
  };

  return (
    <div className="space-y-4">
      {segments.map((segment, index) => (
        <div key={index} className={`relative pl-4 border-l-2 ${getTimeColor(segment.time)}`}>
          {/* Time Badge */}
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-white/60" />
            <span className={`text-sm font-mono ${getTimeColor(segment.time).split(' ')[0]}`}>
              {segment.time}
            </span>
          </div>

          {/* Content Grid */}
          <div className="space-y-2 ml-6">
            {/* Voiceover */}
            {segment.voice && (
              <div className="flex gap-2">
                <Mic className="h-4 w-4 text-white/40 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-white/50 mb-1">Voiceover</div>
                  <div className="text-sm text-white/80">{segment.voice}</div>
                </div>
              </div>
            )}

            {/* On-Screen Text */}
            {segment.text && (
              <div className="flex gap-2">
                <Type className="h-4 w-4 text-white/40 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-white/50 mb-1">On-Screen Text</div>
                  <div className="text-sm text-white/80 font-medium bg-white/5 px-2 py-1 rounded inline-block">
                    {segment.text}
                  </div>
                </div>
              </div>
            )}

            {/* Shot Direction */}
            {segment.shot && (
              <div className="flex gap-2">
                <Camera className="h-4 w-4 text-white/40 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-white/50 mb-1">Shot Direction</div>
                  <div className="text-sm text-white/60 italic">{segment.shot}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* If no structured segments found, fall back to simple display */}
      {segments.length === 0 && scriptLines.map((line, i) => {
        const timeMatch = line.match(/^\[([^\]]+)\]/);
        const time = timeMatch ? timeMatch[1] : null;
        const content = timeMatch ? line.substring(timeMatch[0].length).trim() : line;
        
        return (
          <div key={i} className={`pl-4 border-l-2 ${time ? getTimeColor(time) : 'border-gray-500/30'}`}>
            {time && (
              <span className={`text-xs font-mono block mb-1 ${getTimeColor(time).split(' ')[0]}`}>
                {time}
              </span>
            )}
            <div className="text-sm text-white/80">{content}</div>
          </div>
        );
      })}
    </div>
  );
}