
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
    <div className="flex justify-between items-center mt-6 px-6 py-3 glassmorphism rounded-full w-64 mx-auto">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 flex items-center justify-center bg-blitz-gray/60 rounded-full">
          <X className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-xs text-blitz-lightgray mt-1.5">Skip</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 flex items-center justify-center bg-blitz-gray/60 rounded-full">
          <ArrowUp className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-xs text-blitz-lightgray mt-1.5">Book</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 flex items-center justify-center bg-blitz-pink rounded-full">
          <Check className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="text-xs text-blitz-lightgray mt-1.5">Like</span>
      </div>
    </div>
  );
  
  // Render results screen
  const renderResults = () => (
    <div className="animate-fade-in text-center">
      <div className="glassmorphism rounded-2xl p-7">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Your Blitz Plan
        </h2>
        
        <p className="text-blitz-lightgray mb-6 text-sm">
          You've liked {likedPlaces.length} {likedPlaces.length === 1 ? 'place' : 'places'}!
          <br />
          <span className="text-xs text-blitz-pink mt-1 inline-block">Saved to your profile</span>
        </p>
        
        {likedPlaces.length > 0 ? (
          <div className="mb-6 max-h-64 overflow-y-auto">
            {likedPlaces.map(place => (
              <div 
                key={place.id} 
                className="flex items-center p-3 mb-2 bg-blitz-gray/50 rounded-xl"
              >
                <img 
                  src={place.image} 
                  alt={place.name} 
                  className="w-12 h-12 rounded-xl object-cover mr-3" 
                />
                <div className="text-left">
                  <h3 className="text-white text-sm font-medium">{place.name}</h3>
                  <p className="text-xs text-blitz-lightgray">{place.location}, {place.country}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blitz-pink mb-6 text-sm">
            You didn't like any places. Let's try again!
          </p>
        )}
        
        <div className="flex justify-center gap-4">
          <button
            onClick={handleContinuePlanning}
            className="px-6 py-2.5 text-sm border border-white/10 text-white rounded-full bg-blitz-gray/50 hover:bg-blitz-gray/70 transition-all active:scale-[0.98]"
          >
            Continue
          </button>
          
          <button
            onClick={handleFinishPlanning}
            className="px-6 py-2.5 text-sm bg-blitz-pink text-white rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
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
        <div className="w-full max-w-md mx-auto mt-6">
          <h1 className="text-xl font-semibold mb-3 text-center text-white relative tracking-tight">
            Find Your Experience
            <Sparkles className="absolute -right-5 top-1 w-3.5 h-3.5 text-blitz-pink opacity-70" />
          </h1>
          
          <p className="text-center text-blitz-lightgray mb-6 text-sm">
            <span className="text-blitz-pink">{planData.occasion}</span> • 
            <span className="text-white ml-1">{planData.outingType}</span> • 
            <span className="text-blitz-lightgray ml-1">{planData.locality}km</span>
          </p>
          
          {showResults ? (
            renderResults()
          ) : isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-blitz-pink/20 border-t-blitz-pink animate-spin mb-4"></div>
              <p className="text-blitz-lightgray text-sm">Finding experiences...</p>
            </div>
          ) : error ? (
            <div className="w-full p-6 text-center glassmorphism rounded-xl">
              <p className="text-white mb-4 text-sm">{error}</p>
              <button 
                onClick={handleContinuePlanning}
                className="px-6 py-2.5 text-sm bg-blitz-pink text-white rounded-full active:scale-[0.98] transition-all"
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
