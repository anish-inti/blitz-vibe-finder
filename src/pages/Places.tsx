
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeDeck from '@/components/SwipeDeck';
import SwipeActions from '@/components/SwipeActions';
import { Place } from '@/components/SwipeCard';
import { Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';

// Mock data
const MOCK_PLACES: Place[] = [
  {
    id: '1',
    name: 'VM Food Street',
    location: 'Chennai',
    country: 'India',
    image: '/lovable-uploads/b752b4f7-2a81-4715-a676-9c7bd1f9c93c.png',
  },
  {
    id: '2',
    name: 'Neon Club',
    location: 'Miami',
    country: 'USA',
    image: '/lovable-uploads/0d66895e-8267-4c1f-9e27-62c8bff7d8d1.png',
  },
  {
    id: '3',
    name: 'Starlight Rooftop',
    location: 'New York',
    country: 'USA',
    image: '/lovable-uploads/338fb7a8-90b8-400c-a1a7-b1f2af04f5bf.png',
  },
  {
    id: '4',
    name: 'Luna Lounge',
    location: 'Los Angeles',
    country: 'USA',
    image: '/lovable-uploads/02972e2d-092f-4952-88c5-fcf4ee6acc82.png',
  },
];

const Places: React.FC = () => {
  const { darkMode } = useTheme();
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching data from an API
    setIsLoading(true);
    setTimeout(() => {
      setPlaces(MOCK_PLACES);
      setIsLoading(false);
    }, 800);
  }, []);
  
  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    const newPlaces = [...places];
    const removed = newPlaces.shift();
    setPlaces(newPlaces);
    
    if (direction === 'right') {
      toast({
        title: 'Place added to favorites',
        description: `${removed?.name} has been added to your favorites`,
      });
    } else if (direction === 'up') {
      toast({
        title: 'Booking information',
        description: `Opening booking options for ${removed?.name}...`,
      });
    }
  };
  
  return (
    <div className={`min-h-screen flex flex-col relative transition-all duration-300 ${darkMode ? "bg-blitz-black" : "bg-blitz-offwhite"}`}>
      <div className={`cosmic-bg absolute inset-0 z-0 ${darkMode ? "opacity-100" : "opacity-20"}`}></div>
      
      <Header title="Discover Places" />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-4">
          <h1 className={`text-xl font-semibold mb-6 relative ${darkMode ? "text-white" : "text-blitz-black"}`}>
            Discover Places
            <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-blitz-stardust animate-pulse-glow" />
          </h1>
          
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-blitz-pink/20 border-t-blitz-pink animate-spin mb-4"></div>
              <p className={`text-sm ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"}`}>Loading places...</p>
            </div>
          ) : (
            <>
              <div className="relative">
                <SwipeDeck places={places} onSwipe={handleSwipe} />
              </div>
              
              {places.length > 0 && (
                <SwipeActions 
                  onDislike={() => handleSwipe('left')}
                  onBook={() => handleSwipe('up')}
                  onLike={() => handleSwipe('right')}
                />
              )}
            </>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Places;
