
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeDeck from '@/components/SwipeDeck';
import { Place } from '@/components/SwipeCard';
import { Sparkles } from 'lucide-react';

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
  const [places, setPlaces] = useState<Place[]>([]);
  
  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setPlaces(MOCK_PLACES);
    }, 500);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col relative bg-blitz-black">
      <div className="cosmic-bg absolute inset-0 z-0"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-4">
          <h1 className="text-2xl font-bold mb-6 text-center text-white neon-text relative">
            Discover Places
            <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-blitz-stardust animate-pulse-glow" />
          </h1>
          
          <div className="relative">
            <SwipeDeck places={places} />
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Places;
