'use client';
import React, { useState } from 'react';
import { Star, Plus, X, GripVertical, Sparkles } from 'lucide-react';

interface FeaturePriorityProps {
  features: Array<{ id: string; value: string; priority: number }>;
  onChange: (features: Array<{ id: string; value: string; priority: number }>) => void;
  maxFeatures?: number;
  propertyType?: string;
  className?: string;
}

// Common features by category
const FEATURE_SUGGESTIONS = {
  kitchen: [
    'Chef\'s kitchen',
    'Granite counters',
    'Stainless appliances',
    'Kitchen island',
    'Updated kitchen',
    'Open kitchen',
  ],
  living: [
    'Open floor plan',
    'Hardwood floors',
    'High ceilings',
    'Natural light',
    'Fireplace',
    'Built-ins',
  ],
  outdoor: [
    'Pool/Spa',
    'Large lot',
    'Fenced yard',
    'Deck/Patio',
    'Mountain views',
    'Garden',
  ],
  comfort: [
    'Central AC',
    'New HVAC',
    'Smart home',
    'Home office',
    'Storage',
    'Walk-in closets',
  ],
  location: [
    'Great schools',
    'Quiet street',
    'Walkable',
    'Near shopping',
    'Cul-de-sac',
    'Corner lot',
  ],
  updates: [
    'New roof',
    'New windows',
    'Recently renovated',
    'Move-in ready',
    'Updated bathrooms',
    'Fresh paint',
  ],
};

export default function FeaturePriority({
  features,
  onChange,
  maxFeatures = 6,
  propertyType = '',
  className = '',
}: FeaturePriorityProps) {
  const [customInput, setCustomInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof FEATURE_SUGGESTIONS>('kitchen');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addFeature = (value: string) => {
    if (value && features.length < maxFeatures) {
      const newFeature = {
        id: Date.now().toString(),
        value: value.trim(),
        priority: features.length + 1,
      };
      onChange([...features, newFeature]);
      setCustomInput('');
    }
  };

  const removeFeature = (id: string) => {
    const updated = features.filter(f => f.id !== id);
    // Recalculate priorities
    const reprioritized = updated.map((f, index) => ({
      ...f,
      priority: index + 1,
    }));
    onChange(reprioritized);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const draggedFeature = features[draggedIndex];
    const newFeatures = [...features];
    
    // Remove dragged item
    newFeatures.splice(draggedIndex, 1);
    // Insert at new position
    newFeatures.splice(index, 0, draggedFeature);
    
    // Update priorities
    const reprioritized = newFeatures.map((f, idx) => ({
      ...f,
      priority: idx + 1,
    }));
    
    onChange(reprioritized);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getSuggestedFeatures = () => {
    // Get smart suggestions based on property type
    const suggestions: string[] = [];
    
    if (propertyType.toLowerCase().includes('luxury')) {
      suggestions.push('Chef\'s kitchen', 'Pool/Spa', 'High ceilings', 'Smart home');
    } else if (propertyType.toLowerCase().includes('starter')) {
      suggestions.push('Move-in ready', 'Updated kitchen', 'Fenced yard', 'Great schools');
    } else if (propertyType.toLowerCase().includes('condo')) {
      suggestions.push('Open floor plan', 'Natural light', 'Updated kitchen', 'Storage');
    }
    
    // Add some from selected category
    const categoryFeatures = FEATURE_SUGGESTIONS[selectedCategory];
    suggestions.push(...categoryFeatures.slice(0, 2));
    
    // Filter out already added features
    const existingValues = features.map(f => f.value.toLowerCase());
    return [...new Set(suggestions)].filter(s => !existingValues.includes(s.toLowerCase())).slice(0, 4);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 text-yellow-400" />
        <label className="text-sm text-white/80">Key Features</label>
        <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full">
          Priority order matters
        </span>
      </div>

      {/* Current features with drag and drop */}
      {features.length > 0 && (
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                flex items-center gap-2 p-2.5 rounded-xl border border-white/10 bg-white/5
                cursor-move hover:bg-white/10 transition-colors
                ${draggedIndex === index ? 'opacity-50' : ''}
              `}
            >
              <GripVertical className="h-4 w-4 text-white/30" />
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${index === 0 ? 'bg-yellow-400 text-black' : 
                  index === 1 ? 'bg-white/20 text-white' :
                  index === 2 ? 'bg-white/10 text-white/70' :
                  'bg-white/5 text-white/50'}
              `}>
                {index + 1}
              </div>
              <span className="flex-1 text-sm text-white/90">{feature.value}</span>
              <button
                type="button"
                onClick={() => removeFeature(feature.id)}
                className="text-white/40 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new features */}
      {features.length < maxFeatures && (
        <div className="space-y-3">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-1">
            {Object.keys(FEATURE_SUGGESTIONS).map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category as keyof typeof FEATURE_SUGGESTIONS)}
                className={`
                  px-3 py-1 text-xs rounded-lg transition-colors capitalize
                  ${selectedCategory === category
                    ? 'bg-yellow-400/20 text-yellow-300'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'}
                `}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2">
            {getSuggestedFeatures().map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addFeature(suggestion)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                <Plus className="inline h-3 w-3 mr-1" />
                {suggestion}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addFeature(customInput);
                }
              }}
              placeholder="Or type a custom feature..."
              className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-yellow-400/60"
            />
            {customInput && (
              <button
                type="button"
                onClick={() => addFeature(customInput)}
                className="px-4 py-2 rounded-xl bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30 transition-colors"
              >
                Add
              </button>
            )}
          </div>
        </div>
      )}

      {features.length >= maxFeatures && (
        <p className="text-xs text-white/40">Maximum {maxFeatures} features reached</p>
      )}

      {/* AI tip */}
      {features.length > 0 && (
        <div className="p-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg">
          <p className="text-xs text-white/60 flex items-start gap-1">
            <Sparkles className="h-3 w-3 text-yellow-400 mt-0.5" />
            <span>
              <span className="text-yellow-300">AI Tip:</span> Top 3 features get the most emphasis. Drag to reorder based on what matters most to your target buyers.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}