
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeDeck from '@/components/SwipeDeck';
import { Place } from '@/components/SwipeCard';
import { Sparkles, ArrowRight, Check, X, ArrowUp } from 'lucide-react';

interface PlanData {
  occasion: string;
  outingType: string;
  locality: number;
  timing: Date;
  description: string;
}

// Mock data - in a real app this would come from an API based on the planData
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

const SwipePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [likedPlaces, setLikedPlaces] = useState<Place[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Extract plan data from location state
  const planData = location.state as PlanData || {
    occasion: '',
    outingType: '',
    locality: 5,
    timing: new Date(),
    description: ''
  };
  
  useEffect(() => {
    // In a real app, you would fetch places based on the planData
    // For now, we'll use mock data
    setTimeout(() => {
      setPlaces(MOCK_PLACES);
    }, 500);
  }, []);
  
  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    const currentPlace = places[0];
    
    if (direction === 'right') {
      // User liked the place
      setLikedPlaces(prev => [...prev, currentPlace]);
    } else if (direction === 'up') {
      // User wants to book immediately
      setLikedPlaces(prev => [...prev, currentPlace]);
      // In a real app, you would redirect to booking
      alert(`Booking ${currentPlace.name}!`);
    }
    
    // Remove the swiped place
    const newPlaces = [...places];
    newPlaces.shift();
    setPlaces(newPlaces);
    
    // When no more places, show results
    if (newPlaces.length === 0) {
      setShowResults(true);
    }
  };
  
  const handleContinuePlanning = () => {
    // Reset to start planning again
    navigate('/planner');
  };
  
  const handleFinishPlanning = () => {
    // Save the plan and redirect
    navigate('/favorites', { state: { likedPlaces } });
  };
  
  // Render swipe actions indicators
  const renderSwipeActions = () => (
    <div className="flex justify-between items-center mt-4 px-4 py-2 glassmorphism rounded-full">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 flex items-center justify-center bg-blitz-black/70 rounded-full border border-blitz-pink/50">
          <X className="w-5 h-5 text-blitz-pink" />
        </div>
        <span className="text-xs text-gray-400 mt-1">Dislike</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 flex items-center justify-center bg-blitz-black/70 rounded-full border border-blitz-purple/50">
          <ArrowUp className="w-5 h-5 text-blitz-purple" />
        </div>
        <span className="text-xs text-gray-400 mt-1">Book</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 flex items-center justify-center bg-blitz-black/70 rounded-full border border-blitz-neonred/50">
          <Check className="w-5 h-5 text-blitz-neonred" />
        </div>
        <span className="text-xs text-gray-400 mt-1">Like</span>
      </div>
    </div>
  );
  
  // Render results screen
  const renderResults = () => (
    <div className="animate-fade-in text-center">
      <div className="glassmorphism rounded-2xl p-6 border border-blitz-pink/20 backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-4 text-white neon-text">
          Your Blitz Plan
        </h2>
        
        <p className="text-gray-300 mb-6">
          You've liked {likedPlaces.length} {likedPlaces.length === 1 ? 'place' : 'places'}!
        </p>
        
        {likedPlaces.length > 0 ? (
          <div className="mb-6 max-h-64 overflow-y-auto">
            {likedPlaces.map(place => (
              <div 
                key={place.id} 
                className="flex items-center p-3 mb-2 bg-black/40 rounded-lg border border-blitz-pink/20"
              >
                <img 
                  src={place.image} 
                  alt={place.name} 
                  className="w-12 h-12 rounded-lg object-cover mr-3" 
                />
                <div className="text-left">
                  <h3 className="text-white font-medium">{place.name}</h3>
                  <p className="text-xs text-gray-400">{place.location}, {place.country}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blitz-pink mb-6">
            You didn't like any places. Let's try again!
          </p>
        )}
        
        <div className="flex justify-center gap-4">
          <button
            onClick={handleContinuePlanning}
            className="px-6 py-3 border-2 border-blitz-neonred text-blitz-neonred rounded-full hover:bg-blitz-neonred/10 transition-all"
          >
            Continue
          </button>
          
          <button
            onClick={handleFinishPlanning}
            className="px-6 py-3 bg-blitz-neonred text-white rounded-full shadow-lg shadow-blitz-neonred/30 hover:shadow-blitz-neonred/50 transition-all hover:scale-105"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col relative bg-blitz-black">
      <div className="cosmic-bg absolute inset-0 z-0"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-4">
          <h1 className="text-2xl font-bold mb-2 text-center text-white neon-text relative">
            Find Your Vibe
            <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-blitz-stardust animate-pulse-glow" />
          </h1>
          
          <p className="text-center text-gray-400 mb-6">
            <span className="text-blitz-pink">{planData.occasion}</span> • 
            <span className="text-blitz-purple ml-1">{planData.outingType}</span> • 
            <span className="text-blitz-neonred ml-1">{planData.locality}km</span>
          </p>
          
          {showResults ? (
            renderResults()
          ) : (
            <>
              <div className="relative">
                <SwipeDeck 
                  places={places} 
                  onSwipe={(direction) => handleSwipe(direction as 'left' | 'right' | 'up')} 
                />
              </div>
              
              {places.length > 0 && renderSwipeActions()}
            </>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default SwipePage;
