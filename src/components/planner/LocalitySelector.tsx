
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

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
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-center text-white neon-text">
        How far are you willing to go?
      </h2>
      
      <div className="flex flex-col items-center">
        <div className="w-full mb-6 flex items-center justify-center">
          <MapPin className="text-blitz-neonred mr-2 w-6 h-6" />
          <span className="text-white font-bold text-2xl">{distance} km</span>
        </div>
        
        <div className="w-full px-2">
          <input
            type="range"
            min="1"
            max="50"
            value={distance}
            onChange={handleChange}
            className="w-full appearance-none h-2 bg-blitz-black rounded-full outline-none cursor-pointer"
            style={{
              background: 'linear-gradient(90deg, #ea384c 0%, #D946EF 100%)',
              WebkitAppearance: 'none',
              boxShadow: '0 0 5px rgba(234, 56, 76, 0.5)'
            }}
          />
          
          <div className="w-full flex justify-between mt-2 text-xs text-gray-400">
            <span>1km</span>
            <span>25km</span>
            <span>50km</span>
          </div>
        </div>
        
        <button 
          onClick={() => onSet(distance)}
          className="mt-8 px-8 py-3 bg-blitz-neonred text-white rounded-full shadow-lg shadow-blitz-neonred/30 hover:shadow-blitz-neonred/50 transition-all hover:scale-105"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default LocalitySelector;
