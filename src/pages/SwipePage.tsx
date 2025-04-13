
import React, { useState, useEffect } from 'react';
import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeDeck from '@/components/SwipeDeck';
import { Place } from '@/components/SwipeCard';
import { Sparkles, ArrowRight, Check, X, ArrowUp, MapPin, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLocationContext } from '@/contexts/LocationContext';
import { LocationInfo } from '@/components/LocationInfo';
import { calculateDistance } from '@/utils/locationUtils';
import { getPlaceRecommendations, getFallbackRecommendations, PlaceSearchParams } from '@/services/geminiPlacesService';
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
  const [isUsingExternalApi, setIsUsingExternalApi] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({});
  
  // Get location information from context
  const locationContext = useLocationContext();
  
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
  
  // Generate mock places for testing when API fails
  const generateMockPlaces = (): Place[] => {
    const mockImages = [
      '/placeholder.svg',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'
    ];
    
    return [
      {
        id: 'mock-1',
        name: 'Cafe Sunshine',
        location: 'Downtown',
        country: 'India',
        image: mockImages[1],
        description: 'A cozy cafe with great coffee and pastries. Perfect for a relaxing afternoon.',
        rating: 4.5,
        reviewCount: 120,
        priceLevel: 2,
        isOpen: true,
        category: 'cafe',
        distance: 1200
      },
      {
        id: 'mock-2',
        name: 'Urban Park',
        location: 'City Center',
        country: 'India',
        image: mockImages[2],
        description: 'A beautiful urban park with walking trails and scenic views.',
        rating: 4.2,
        reviewCount: 85,
        priceLevel: 1,
        isOpen: true,
        category: 'park',
        distance: 800
      },
      {
        id: 'mock-3',
        name: 'Spice Route Restaurant',
        location: 'Market Street',
        country: 'India',
        image: mockImages[3],
        description: 'Authentic local cuisine with a modern twist. Great for dinner with friends.',
        rating: 4.7,
        reviewCount: 210,
        priceLevel: 3,
        isOpen: true,
        category: 'restaurant',
        distance: 1500
      }
    ];
  };
  
  const fetchAIRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get location information
      const userCity = "nearby"; // Default location term
      const hasLocationData = locationContext.status === 'granted' && 
                             locationContext.data?.latitude && 
                             locationContext.data?.longitude;
      
      // Prepare search parameters
      const searchParams: PlaceSearchParams = {
        type: filters.type || planData.outingType,
        vibe: filters.keyword || planData.occasion,
        location: userCity,
        budget: filters.maxprice,
        timeWindow: getTimeWindow(), // Helper function to determine time of day
        opennow: filters.opennow,
        prompt: filters.prompt,
      };
      
      // Add geolocation if available
      if (hasLocationData) {
        searchParams.latitude = locationContext.data.latitude;
        searchParams.longitude = locationContext.data.longitude;
      }
      
      console.log('Searching for AI recommendations with params:', searchParams);
      
      // Fetch place recommendations from Gemini
      const recommendations = await getPlaceRecommendations(searchParams);
      
      if (recommendations.length === 0) {
        console.log('No recommendations found, trying fallback...');
        
        // Try a fallback search if specific search returned no results
        const fallbackPlaces = await getFallbackRecommendations("your area");
        
        if (fallbackPlaces.length === 0) {
          setError('No places found matching your criteria. Try adjusting your filters.');
          setIsLoading(false);
          return;
        }
        
        setPlaces(fallbackPlaces);
      } else {
        // Add simulated distance to each place (since AI doesn't provide real coordinates)
        const placesWithDistance = recommendations.map((place, index) => {
          // Simulate random distances between 0.5 and 5 km
          const simulatedDistance = (Math.random() * 4.5 + 0.5) * 1000; // in meters
          return { ...place, distance: simulatedDistance };
        });
        
        // Sort by simulated distance
        const sortedPlaces = placesWithDistance.sort((a, b) => {
          if (a.distance === undefined || b.distance === undefined) return 0;
          return a.distance - b.distance;
        });
        
        console.log('Found AI recommendations:', sortedPlaces);
        setPlaces(sortedPlaces);
      }
      
      setIsUsingExternalApi(true);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      
      // First try to use mock data for testing instead of showing an error
      const mockPlaces = generateMockPlaces();
      console.log('Using mock places as fallback:', mockPlaces);
      toast({
        title: 'Using demo data',
        description: 'Could not connect to recommendation API. Showing sample places instead.',
      });
      setPlaces(mockPlaces);
      setIsUsingExternalApi(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to determine time of day for recommendations
  const getTimeWindow = (): string => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Evening';
    } else {
      return 'Night';
    }
  };
  
  const fetchDatabasePlaces = async () => {
    setIsLoading(true);
    setError(null);
    setIsUsingExternalApi(false);
    
    console.log('Fetching places from database with filters:', {
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
        let placesData: Place[] = data.map(place => ({
          id: place.id,
          name: place.name,
          location: place.location,
          country: place.country,
          image: place.image,
          category: place.category
        }));
        
        // If user location is available, calculate and add distance to each place
        // This assumes places have latitude and longitude in the database
        if (locationContext.status === 'granted' && locationContext.data?.latitude && locationContext.data?.longitude) {
          console.log('Using user location for sorting places');
          
          // In a real implementation, we would calculate actual distances
          // But for now we're just showing the capability
          // This would require adding lat/long to the places table
        }
        
        console.log('Transformed places data:', placesData);
        setPlaces(placesData);
      } else {
        console.log('No places found with current filters');
        setError('No places found with your filters. Try changing your preferences.');
      }
    } catch (error) {
      console.error('Error in fetchDatabasePlaces:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Effect to fetch places when component mounts or filters change
  useEffect(() => {
    // Use AI recommendations if we can get location or have filter data
    if (locationContext.status === 'granted' || 
        filters.prompt || planData.occasion || planData.outingType) {
      console.log('Location status:', locationContext.status);
      console.log('Location data:', locationContext.data);
      fetchAIRecommendations();
    } else {
      // Fall back to database places
      fetchDatabasePlaces();
    }
  }, [locationContext.status, planData.occasion, planData.outingType, planData.locality]);
  
  const handleApplyFilters = (newFilters: FilterParams) => {
    setFilters(newFilters);
    
    // If user entered a prompt, show a processing toast
    if (newFilters.prompt) {
      toast({
        title: 'Processing your request',
        description: `Looking for "${newFilters.prompt}" near you...`,
      });
    }
    
    // Always try AI recommendations first, fall back to database
    fetchAIRecommendations();
  };
  
  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (places.length === 0) return;
    
    const currentPlace = places[0];
    
    console.log(`User swiped ${direction} on ${currentPlace.name}`);
    
    if (direction === 'right' || direction === 'up') {
      // User liked the place
      setLikedPlaces(prev => [...prev, currentPlace]);
      console.log(`Adding ${currentPlace.name} to liked places`);
      
      // Save liked place to Supabase
      try {
        // Check if we need to save the Google Place to our database first
        if (isUsingExternalApi) {
          console.log(`Saving Google Place to places table`);
          
          // First insert the place if it doesn't exist in our database
          const { data: placeData, error: placeError } = await supabase
            .from('places')
            .upsert({
              id: currentPlace.id,
              name: currentPlace.name,
              location: currentPlace.location,
              country: currentPlace.country,
              image: currentPlace.image || '/placeholder.svg',
              category: currentPlace.category || 'place',
              occasion: '', // Default empty occasion
              locality: 5 // Default locality
            })
            .select();
            
          if (placeError) {
            console.error('Error saving Google Place to database:', placeError);
          }
        }
        
        // Now save to liked_places
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
        toast({
          title: 'Booking in progress',
          description: `Booking ${currentPlace.name}...`,
        });
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
  
  const handleRetry = () => {
    // Try again with current filters
    // Always try AI recommendations first, fall back to database
    fetchAIRecommendations();
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
      
      <Header showLocationDebug={true} />
      
      <main className="flex-1 flex flex-col items-center px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-6">
          <h1 className="text-xl font-semibold mb-3 text-center text-white relative tracking-tight">
            Find Your Experience
            <Sparkles className="absolute -right-5 top-1 w-3.5 h-3.5 text-blitz-pink opacity-70" />
          </h1>
          
          {/* Search and filters */}
          <div className="mb-4">
            <SearchFilters 
              onApplyFilters={handleApplyFilters}
              initialFilters={{
                type: planData.outingType || undefined,
                keyword: planData.occasion || undefined,
                radius: planData.locality * 1000, // Convert km to meters
              }}
            />
          </div>
          
          {/* Conditional debugging info */}
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
