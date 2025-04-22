
import React, { useState, useEffect } from 'react';
import SwipeCard, { Place } from './SwipeCard';

interface SwipeDeckProps {
  places: Place[];
  onEmpty?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up') => void;
}

const SwipeDeck: React.FC<SwipeDeckProps> = ({ places, onEmpty, onSwipe }) => {
  const [currentPlaces, setCurrentPlaces] = useState<Place[]>([]);
  const [previousPlace, setPreviousPlace] = useState<Place | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    setCurrentPlaces(places);
  }, [places]);
  
  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    // Save the current place before removing it
    if (currentPlaces.length > 0) {
      setPreviousPlace(currentPlaces[0]);
    }
    
    // Always use the parent handler if provided
    if (onSwipe) {
      onSwipe(direction);
      return;
    }
    
    // Otherwise use default behavior
    const newPlaces = [...currentPlaces];
    newPlaces.shift();
    setCurrentPlaces(newPlaces);
    
    // Show animation when a new card appears
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 500);
    
    if (newPlaces.length === 0 && onEmpty) {
      onEmpty();
    }
  };
  
  if (currentPlaces.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 p-8 glassmorphism rounded-2xl">
        <p className="text-center mb-3">No more places to show</p>
        {previousPlace && (
          <p className="text-sm text-center text-gray-400">
            You just viewed {previousPlace.name} in {previousPlace.location}
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      {currentPlaces.length > 0 && (
        <div className={`${showAnimation ? 'animate-scale-in' : ''} transform transition-all duration-300`}>
          <SwipeCard 
            place={currentPlaces[0]} 
            onSwipe={handleSwipe} 
          />
        </div>
      )}
      {currentPlaces.length > 1 && (
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-50 scale-[0.95] blur-sm">
          {/* Hint of next card */}
          <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
            <p className="text-gray-600 text-xs">Next: {currentPlaces[1].name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwipeDeck;
