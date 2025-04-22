import React, { useState, useEffect } from 'react';
import SwipeCard, { Place } from './SwipeCard';

interface SwipeDeckProps {
  places: Place[];
  onEmpty?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up') => void;
}

const SwipeDeck: React.FC<SwipeDeckProps> = ({ places, onEmpty, onSwipe }) => {
  const [currentPlaces, setCurrentPlaces] = useState<Place[]>([]);
  
  useEffect(() => {
    setCurrentPlaces(places);
  }, [places]);
  
  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    // Always use the parent handler if provided
    if (onSwipe) {
      onSwipe(direction);
      return;
    }
    
    // Otherwise use default behavior
    const newPlaces = [...currentPlaces];
    newPlaces.shift();
    setCurrentPlaces(newPlaces);
    
    if (newPlaces.length === 0 && onEmpty) {
      onEmpty();
    }
  };
  
  if (currentPlaces.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        <p>No more places to show</p>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      {currentPlaces.length > 0 && (
        <div className="animate-scale-in">
          <SwipeCard 
            place={currentPlaces[0]} 
            onSwipe={handleSwipe} 
          />
        </div>
      )}
    </div>
  );
};

export default SwipeDeck;
