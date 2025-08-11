'use client';
import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-1/3 bg-neutral-700/80 rounded-lg animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-4 bg-neutral-700/80 rounded-lg animate-pulse"></div>
        <div className="h-4 w-5/6 bg-neutral-700/80 rounded-lg animate-pulse"></div>
        <div className="h-4 w-4/6 bg-neutral-700/80 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}
