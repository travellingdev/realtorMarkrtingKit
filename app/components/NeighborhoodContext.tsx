'use client';
import React, { useState } from 'react';
import { MapPin, GraduationCap, Car, Coffee, Info } from 'lucide-react';

interface NeighborhoodContextProps {
  schoolDistrict: string;
  setSchoolDistrict: (v: string) => void;
  walkScore: string;
  setWalkScore: (v: string) => void;
  distanceToDowntown: string;
  setDistanceToDowntown: (v: string) => void;
  nearbyAmenities: string[];
  setNearbyAmenities: (v: string[]) => void;
  className?: string;
}

const AMENITY_OPTIONS = [
  { id: 'shopping', label: 'Shopping Centers', icon: '🛒' },
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
  { id: 'parks', label: 'Parks & Recreation', icon: '🏞️' },
  { id: 'schools', label: 'Top Schools', icon: '🎓' },
  { id: 'hospital', label: 'Medical Facilities', icon: '🏥' },
  { id: 'transit', label: 'Public Transit', icon: '🚇' },
  { id: 'gym', label: 'Fitness Centers', icon: '🏋️' },
  { id: 'coffee', label: 'Coffee Shops', icon: '☕' },
  { id: 'beach', label: 'Beach/Water', icon: '🏖️' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { id: 'airport', label: 'Airport Access', icon: '✈️' },
  { id: 'highways', label: 'Major Highways', icon: '🛣️' },
];

const WALK_SCORES = [
  { value: '90-100', label: "Walker's Paradise (90-100)", description: "Daily errands do not require a car" },
  { value: '70-89', label: "Very Walkable (70-89)", description: "Most errands can be accomplished on foot" },
  { value: '50-69', label: "Somewhat Walkable (50-69)", description: "Some errands can be accomplished on foot" },
  { value: '25-49', label: "Car-Dependent (25-49)", description: "Most errands require a car" },
  { value: '0-24', label: "Car-Dependent (0-24)", description: "Almost all errands require a car" },
];

export default function NeighborhoodContext({
  schoolDistrict,
  setSchoolDistrict,
  walkScore,
  setWalkScore,
  distanceToDowntown,
  setDistanceToDowntown,
  nearbyAmenities,
  setNearbyAmenities,
  className = '',
}: NeighborhoodContextProps) {
  const [showWalkScoreInfo, setShowWalkScoreInfo] = useState(false);

  const toggleAmenity = (amenityId: string) => {
    if (nearbyAmenities.includes(amenityId)) {
      setNearbyAmenities(nearbyAmenities.filter(id => id !== amenityId));
    } else {
      setNearbyAmenities([...nearbyAmenities, amenityId]);
    }
  };

  const LabeledInput = ({ label, value, onChange, placeholder, icon }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    icon: React.ReactNode;
  }) => (
    <label className="block">
      <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
        {icon}
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
      />
    </label>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-4 w-4 text-green-400" />
        <h3 className="text-sm font-medium text-white/80">Neighborhood Context</h3>
        <span className="text-xs text-white/40">(Enhances local appeal)</span>
      </div>

      {/* Basic Context Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        <LabeledInput
          label="School District"
          value={schoolDistrict}
          onChange={setSchoolDistrict}
          placeholder="e.g., Brookfield Unified"
          icon={<GraduationCap className="h-3 w-3" />}
        />
        
        <LabeledInput
          label="Distance to Downtown"
          value={distanceToDowntown}
          onChange={setDistanceToDowntown}
          placeholder="e.g., 15 minutes, 8 miles"
          icon={<Car className="h-3 w-3" />}
        />
      </div>

      {/* Walk Score with Info */}
      <div>
        <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
          <Coffee className="h-3 w-3" />
          Walk Score
          <button
            type="button"
            onMouseEnter={() => setShowWalkScoreInfo(true)}
            onMouseLeave={() => setShowWalkScoreInfo(false)}
            className="relative text-white/40 hover:text-white/60"
          >
            <Info className="h-3 w-3" />
            {showWalkScoreInfo && (
              <div className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-black/90 rounded-lg text-xs text-white/80 z-50">
                <p className="font-semibold mb-1">Walk Score</p>
                <p>A measure of how walkable a location is. Higher scores mean more amenities within walking distance.</p>
              </div>
            )}
          </button>
        </div>
        <select
          value={walkScore}
          onChange={(e) => setWalkScore(e.target.value)}
          className="w-full rounded-2xl bg-neutral-950 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/60"
        >
          <option value="">Select walkability...</option>
          {WALK_SCORES.map(score => (
            <option key={score.value} value={score.value}>
              {score.label}
            </option>
          ))}
        </select>
        {walkScore && (
          <p className="text-xs text-white/60 mt-1">
            {WALK_SCORES.find(s => s.value === walkScore)?.description}
          </p>
        )}
      </div>

      {/* Nearby Amenities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-white/80">Nearby Amenities</div>
          {nearbyAmenities.length > 0 && (
            <span className="text-xs text-white/60">
              {nearbyAmenities.length} selected
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {AMENITY_OPTIONS.map(amenity => {
            const isSelected = nearbyAmenities.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`
                  flex items-center gap-2 p-2.5 rounded-xl border text-sm transition-all
                  ${isSelected
                    ? 'border-green-400 bg-green-400/10 text-green-300'
                    : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span>{amenity.icon}</span>
                <span className="text-xs">{amenity.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Context Preview */}
      {(schoolDistrict || walkScore || distanceToDowntown || nearbyAmenities.length > 0) && (
        <div className="p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl">
          <p className="text-xs text-green-300 mb-1">
            <MapPin className="inline h-3 w-3 mr-1" />
            Context Preview:
          </p>
          <p className="text-xs text-white/70">
            {schoolDistrict && `Served by ${schoolDistrict}. `}
            {walkScore && `${WALK_SCORES.find(s => s.value === walkScore)?.label.split(' (')[0]} area. `}
            {distanceToDowntown && `${distanceToDowntown} to downtown. `}
            {nearbyAmenities.length > 0 && `Near ${nearbyAmenities.map(id => 
              AMENITY_OPTIONS.find(a => a.id === id)?.label.toLowerCase()
            ).join(', ')}.`}
          </p>
        </div>
      )}
    </div>
  );
}