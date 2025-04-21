
import React, { useState, useEffect } from 'react';
import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeDeck from '@/components/SwipeDeck';
import { Place } from '@/components/SwipeCard';
import { Sparkles, ArrowRight, Check, X, ArrowUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLocationContext } from '@/contexts/LocationContext';
import { LocationInfo } from '@/components/LocationInfo';
import { toast } from '@/hooks/use-toast';
import SearchFilters, { FilterParams } from '@/components/SearchFilters';

interface PlanData {
  occasion: string;
  outingType: string;
  locality: number;
  timing: Date;
  description: string;
}

const SwipePage: React.FC = () => {
  const location = useRouterLocation();
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [likedPlaces, setLikedPlaces] = useState<Place[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({});
  
  const locationContext = useLocationContext();
  
  const planData = location.state as PlanData || {
    occasion: '',
    outingType: '',
    locality: 5,
    timing: new Date(),
    description: ''
  };

  const handleSupabaseError = (error: any, defaultMessage: string = 'An error occurred') => {
    console.error(error);
    
    if (error?.message) {
      setError(`Error: ${error.message}`);
    } else {
      setError(defaultMessage);
    }
  };
  
  const fetchDatabasePlaces = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('places').select('*');
      
      // Filter only if filter values are truthy
      if (planData.occasion) {
        query = query.ilike('occasion', `%${planData.occasion.toLowerCase()}%`);
      }
      
      if (planData.outingType) {
        query = query.ilike('category', `%${planData.outingType.toLowerCase()}%`);
      }
      
      if (planData.locality && planData.locality > 0) {
        query = query.lte('locality', planData.locality);
      }
      
      // Apply optional filters from filters state
      if (filters.keyword) {
        query = query.ilike('name', `%${filters.keyword}%`);
      }
      
      if (filters.type) {
        query = query.ilike('category', `%${filters.type}%`);
      }

      if (filters.maxprice !== undefined && filters.maxprice !== 4) {
        // Note: The places table does not have priceLevel field, so we skip price filtering here or you can adjust if priceLevel added later
      }

      // Opennow and radius are not available in current DB, skipping for now

      const { data, error } = await query;

      if (error) {
        handleSupabaseError(error, 'Could not load places. Please try again later.');
        setPlaces([]);
        setIsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const placesData: Place[] = data.map(place => ({
          id: place.id,
          name: place.name,
          location: place.location,
          country: place.country,
          image: place.image,
          category: place.category,
          occasion: place.occasion,
          locality: place.locality,
        }));

        setPlaces(placesData);
        setError(null);
      } else {
        setError('No places found with your filters. Try changing your preferences.');
        setPlaces([]);
      }
    } catch (error) {
      console.error('Error in fetchDatabasePlaces:', error);
      setError('An unexpected error occurred. Please try again.');
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabasePlaces();
  }, [planData.occasion, planData.outingType, planData.locality, filters]);
  
  const handleApplyFilters = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };
  
  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (places.length === 0) return;
    
    const currentPlace = places[0];
    
    if (direction === 'right' || direction === 'up') {
      setLikedPlaces(prev => [...prev, currentPlace]);
      
      try {
        // Save liked place
        const { error } = await supabase
          .from('liked_places')
          .insert({ place_id: currentPlace.id });
          
        if (error) {
          handleSupabaseError(error, 'Could not save your like. Please try again.');
        }
      } catch (error) {
        console.error('Error in saving liked place:', error);
      }

      if (direction === 'up') {
        toast({
          title: 'Booking in progress',
          description: `Booking ${currentPlace.name}...`,
        });
      }
    }
    
    const newPlaces = [...places];
    newPlaces.shift();
    setPlaces(newPlaces);
    
    if (newPlaces.length === 0) {
      setShowResults(true);
    }
  };
  
  const handleContinuePlanning = () => {
    navigate('/planner');
  };
  
  const handleFinishPlanning = () => {
    navigate('/favorites', { state: { likedPlaces } });
  };
  
  const handleRetry = () => {
    fetchDatabasePlaces();
  };
  
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
      
      <Header showLocationDebug={true} />
      
      <main className="flex-1 flex flex-col items-center px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-6">
          <h1 className="text-xl font-semibold mb-3 text-center text-white relative tracking-tight">
            Find Your Experience
            <Sparkles className="absolute -right-5 top-1 w-3.5 h-3.5 text-blitz-pink opacity-70" />
          </h1>
          
          <div className="mb-4">
            <SearchFilters 
              onApplyFilters={handleApplyFilters}
              initialFilters={{
                type: planData.outingType || undefined,
                keyword: planData.occasion || undefined,
                radius: planData.locality * 1000,
              }}
            />
          </div>
          
          {import.meta.env.DEV && (
            <div className="mb-4">
              <LocationInfo />
            </div>
          )}
          
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
              <div className="flex justify-center gap-3">
                <button 
                  onClick={handleContinuePlanning}
                  className="px-6 py-2.5 text-sm border border-white/10 text-white rounded-full bg-blitz-gray/50 hover:bg-blitz-gray/70 transition-all active:scale-[0.98]"
                >
                  Change filters
                </button>
                <button 
                  onClick={handleRetry}
                  className="px-6 py-2.5 text-sm bg-blitz-pink text-white rounded-full active:scale-[0.98] transition-all"
                >
                  Try again
                </button>
              </div>
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

