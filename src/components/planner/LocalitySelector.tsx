import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocalitySelectorProps {
  onSet: (distance: number) => void;
  initialValue: number;
}

const LocalitySelector: React.FC<LocalitySelectorProps> = ({ onSet, initialValue }) => {
  const [distance, setDistance] = useState(initialValue);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setDistance(value);
  };

  const getDistanceLabel = (km: number) => {
    if (km <= 2) return 'Nearby';
    if (km <= 5) return 'Close';
    if (km <= 15) return 'Moderate';
    if (km <= 30) return 'Extended';
    return 'Far';
  };

  const getDistanceDescription = (km: number) => {
    if (km <= 2) return 'Walking distance';
    if (km <= 5) return 'Quick ride';
    if (km <= 15) return 'Short journey';
    if (km <= 30) return 'Worth the trip';
    return 'Adventure awaits';
  };
  
  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blitz-primary to-blitz-accent text-white shadow-lg">
          <Navigation className="w-8 h-8" />
        </div>
        
        <div>
          <div className="text-3xl font-bold text-gradient mb-2">
            {distance} km
          </div>
          <div className="text-lg font-semibold text-foreground">
            {getDistanceLabel(distance)}
          </div>
          <div className="text-sm text-muted-foreground">
            {getDistanceDescription(distance)}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="relative">
          <input
            type="range"
            min="1"
            max="50"
            value={distance}
            onChange={handleChange}
            className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, hsl(var(--blitz-primary)) 0%, hsl(var(--blitz-accent)) ${(distance / 50) * 100}%, hsl(var(--muted)) ${(distance / 50) * 100}%, hsl(var(--muted)) 100%)`
            }}
          />
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: linear-gradient(135deg, hsl(var(--blitz-primary)), hsl(var(--blitz-accent)));
              cursor: pointer;
              box-shadow: 0 4px 12px hsl(var(--blitz-primary) / 0.3);
              transition: all 0.2s ease;
            }
            .slider::-webkit-slider-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 6px 16px hsl(var(--blitz-primary) / 0.4);
            }
            .slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: linear-gradient(135deg, hsl(var(--blitz-primary)), hsl(var(--blitz-accent)));
              cursor: pointer;
              border: none;
              box-shadow: 0 4px 12px hsl(var(--blitz-primary) / 0.3);
            }
          `}</style>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1km</span>
          <span>25km</span>
          <span>50km</span>
        </div>
        
        <button 
          onClick={() => onSet(distance)}
          className="w-full btn-primary rounded-2xl py-4 font-bold text-lg interactive-glow"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LocalitySelector;