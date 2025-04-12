
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeDeck from '@/components/SwipeDeck';
import { Place } from '@/components/SwipeCard';
import { Sparkles, ArrowRight, Check, X, ArrowUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PlanData {
  occasion: string;
  outingType: string;
  locality: number;
  timing: Date;
  description: string;
}

// We'll fetch places from Supabase instead of using mock data

const SwipePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [likedPlaces, setLikedPlaces] = useState<Place[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to handle Supabase errors
  const handleSupabaseError = (error: any, defaultMessage: string = 'An error occurred') => {
    console.error(error);
    
    if (error?.message) {
      setError(`Error: ${error.message}`);
    } else {
      setError(defaultMessage);
    }
  };
  
  // Extract plan data from location state
  const planData = location.state as PlanData || {
    occasion: '',
    outingType: '',
    locality: 5,
    timing: new Date(),
    description: ''
  };
  
  useEffect(() => {
    // Fetch places from Supabase based on planData filters
    const fetchPlaces = async () => {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching places with filters:', {
        occasion: planData.occasion,
        outingType: planData.outingType,
        locality: planData.locality
      });
      
      try {
        let query = supabase
          .from('places')
          .select('*');
        
        // Apply filters if they exist in planData
        if (planData.occasion) {
          // Handle case insensitivity by using ilike for text comparison
          query = query.ilike('occasion', planData.occasion.toLowerCase());
        }
        
        if (planData.outingType) {
          // Handle case insensitivity by using ilike for text comparison
          query = query.ilike('category', planData.outingType.toLowerCase());
        }
        
        if (planData.locality) {
          query = query.lte('locality', planData.locality);
        }
        
        const { data, error } = await query;
        
        if (error) {
          handleSupabaseError(error, 'Could not load places. Please try again later.');
          return;
        }
        
        console.log('Places retrieved from Supabase:', data);
        
        if (data && data.length > 0) {
          // Transform Supabase data to match Place interface
          const placesData: Place[] = data.map(place => ({
            id: place.id,
            name: place.name,
            location: place.location,
            country: place.country,
            image: place.image
          }));
          
          console.log('Transformed places data:', placesData);
          setPlaces(placesData);
        } else {
          console.log('No places found with current filters');
          setError('No places found with your filters. Try changing your preferences.');
        }
      } catch (error) {
        console.error('Error in fetchPlaces:', error);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlaces();
  }, [planData.occasion, planData.outingType, planData.locality]);
  
  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    const currentPlace = places[0];
    
    console.log(`User swiped ${direction} on ${currentPlace.name}`);
    
    if (direction === 'right' || direction === 'up') {
      // User liked the place
      setLikedPlaces(prev => [...prev, currentPlace]);
      console.log(`Adding ${currentPlace.name} to liked places`);
      
      // Save liked place to Supabase
      try {
        console.log(`Saving place_id ${currentPlace.id} to liked_places table`);
        const { data, error } = await supabase
          .from('liked_places')
          .insert({ place_id: currentPlace.id });
          
        if (error) {
          handleSupabaseError(error, 'Could not save your like. Please try again.');
        } else {
          console.log('Successfully saved liked place to Supabase');
        }
      } catch (error) {
        console.error('Error in saving liked place:', error);
      }
      
      if (direction === 'up') {
        // User wants to book immediately
        console.log(`User wants to book ${currentPlace.name} immediately`);
        // In a real app, you would redirect to booking
        alert(`Booking ${currentPlace.name}!`);
      }
    }
    
    // Remove the swiped place
    const newPlaces = [...places];
    newPlaces.shift();
    setPlaces(newPlaces);
    console.log(`Removed ${currentPlace.name}, ${newPlaces.length} places left`);
    
    // When no more places, show results
    if (newPlaces.length === 0) {
      console.log('No more places, showing results');
      setShowResults(true);
    }
  };
  
  const handleContinuePlanning = () => {
    // Reset to start planning again
    navigate('/planner');
  };
  
  const handleFinishPlanning = async () => {
    // Save the plan (in a real app, you might want to save the full plan to Supabase)
    // For now, we'll just redirect to favorites with the liked places
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
          <br />
          <span className="text-sm text-blitz-pink">All your likes are saved to your profile</span>
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
          ) : isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center animate-pulse">
              <div className="w-12 h-12 rounded-full border-2 border-t-transparent border-blitz-pink animate-spin mb-4"></div>
              <p className="text-gray-400">Finding your vibe...</p>
            </div>
          ) : error ? (
            <div className="w-full p-6 text-center glassmorphism rounded-xl">
              <p className="text-blitz-pink mb-4">{error}</p>
              <button 
                onClick={handleContinuePlanning}
                className="px-6 py-3 bg-blitz-neonred text-white rounded-full hover:bg-blitz-neonred/80"
              >
                Try different filters
              </button>
            </div>
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
