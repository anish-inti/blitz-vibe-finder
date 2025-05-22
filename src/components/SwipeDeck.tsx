
import React, { useState, useEffect } from 'react';
import SwipeCard, { Place } from './SwipeCard';
import SwipeActions from './SwipeActions';
import SwipeCardMovieAdapter from './SwipeCardMovieAdapter';
import { ParsedFilters } from '@/utils/promptParser';

interface SwipeDeckProps {
  places: Place[];
  onEmpty?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up') => void;
  promptFilters?: ParsedFilters;
}

const SwipeDeck: React.FC<SwipeDeckProps> = ({ places, onEmpty, onSwipe, promptFilters }) => {
  const [currentPlaces, setCurrentPlaces] = useState<Place[]>([]);
  const [previousPlace, setPreviousPlace] = useState<Place | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  
  useEffect(() => {
    setCurrentPlaces(places);
  }, [places]);
  
  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    // Set swipe direction for animation
    setSwipeDirection(direction);
    
    // Save the current place before removing it
    if (currentPlaces.length > 0) {
      setPreviousPlace(currentPlaces[0]);
    }
    
    // Delay removing the card until animation completes
    setTimeout(() => {
      // Always use the parent handler if provided
      if (onSwipe) {
        onSwipe(direction);
      } else {
        // Otherwise use default behavior
        const newPlaces = [...currentPlaces];
        newPlaces.shift();
        setCurrentPlaces(newPlaces);
        
        if (newPlaces.length === 0 && onEmpty) {
          onEmpty();
        }
      }
      
      // Reset the swipe direction after the card is removed
      setSwipeDirection(null);
      
      // Show animation when a new card appears
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 500);
    }, 300); // Match the duration of the swipe animation
  };
  
  const handleActionButton = (direction: 'left' | 'right' | 'up') => {
    handleSwipe(direction);
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
  
  const currentPlace = currentPlaces[0];
  const isMovieCard = 'isMovie' in currentPlace && currentPlace.isMovie === true;
  
  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="w-full relative">
        {currentPlace && (
          <div className={`transform transition-all duration-300 ${
            swipeDirection === 'left' ? 'swiping-left' : 
            swipeDirection === 'right' ? 'swiping-right' : 
            swipeDirection === 'up' ? 'swiping-up' : 
            showAnimation ? 'animate-scale-in' : ''
          }`}>
            {isMovieCard ? (
              <SwipeCardMovieAdapter 
                place={currentPlace as any} 
                onSwipe={handleSwipe} 
              />
            ) : (
              <SwipeCard 
                place={currentPlace} 
                onSwipe={handleSwipe}
                promptFilters={promptFilters}
              />
            )}
          </div>
        )}
        
        {currentPlaces.length > 1 && (
          <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-50 scale-[0.95] blur-sm">
            {/* Hint of next card */}
            <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 opacity-30 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentPlaces[1].image})` }}
              ></div>
              <p className="text-gray-500 text-xs z-10">Next: {currentPlaces[1].name}</p>
            </div>
          </div>
        )}
      </div>
      
      <SwipeActions 
        onLike={() => handleActionButton('right')}
        onDislike={() => handleActionButton('left')}
        onBook={() => handleActionButton('up')}
      />
    </div>
  );
};

export default SwipeDeck;
