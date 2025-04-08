
import React, { useState, useEffect } from 'react';
import SwipeCard, { Place } from './SwipeCard';

interface SwipeDeckProps {
  places: Place[];
  onEmpty?: () => void;
}

const SwipeDeck: React.FC<SwipeDeckProps> = ({ places, onEmpty }) => {
  const [currentPlaces, setCurrentPlaces] = useState<Place[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    setCurrentPlaces(places);
  }, [places]);
  
  const handleSwipe = (direction: 'left' | 'right') => {
    setTimeout(() => {
      const newPlaces = [...currentPlaces];
      newPlaces.shift();
      setCurrentPlaces(newPlaces);
      
      if (newPlaces.length === 0 && onEmpty) {
        onEmpty();
      }
    }, 300);
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
      {currentPlaces.map((place, index) => (
        index === 0 && (
          <div key={place.id} className="animate-scale-in">
            <SwipeCard place={place} onSwipe={handleSwipe} />
          </div>
        )
      ))}
    </div>
  );
};

export default SwipeDeck;
