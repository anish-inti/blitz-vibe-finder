import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Place } from "@/components/SwipeCard";
import { toast } from "@/hooks/use-toast";
import { FilterParams } from "@/components/SearchFilters";
import { parseAndFilterPlaces } from "@/utils/promptParser";
import { getBlitzRecommendations } from "@/services/googlePlacesService";

interface PlanData {
  occasion: string;
  outingType: string;
  locality: number;
  timing: Date;
  description: string;
}

// Fallback places when API fails
const FALLBACK_PLACES: Place[] = [
  {
    id: 'fallback-1',
    name: 'Marina Beach',
    location: 'Chennai',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    rating: 4.2,
    reviewCount: 1250,
    category: 'beach',
    description: 'Famous beach in Chennai perfect for evening walks',
    tags: ['outdoor', 'scenic', 'family-friendly'],
    budget: 100,
    maxGroupSize: 10,
    time: 'evening',
    hours: '24 hours',
    latitude: 13.0500,
    longitude: 80.2824
  },
  {
    id: 'fallback-2',
    name: 'Phoenix MarketCity',
    location: 'Chennai',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    rating: 4.4,
    reviewCount: 890,
    category: 'shopping mall',
    description: 'Popular shopping and entertainment destination',
    tags: ['shopping', 'entertainment', 'food'],
    budget: 500,
    maxGroupSize: 8,
    time: 'afternoon',
    hours: '10:00 AM - 10:00 PM',
    latitude: 12.9914,
    longitude: 80.2181
  },
  {
    id: 'fallback-3',
    name: 'Amethyst Cafe',
    location: 'Chennai',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
    rating: 4.5,
    reviewCount: 456,
    category: 'cafe',
    description: 'Cozy cafe perfect for hanging out with friends',
    tags: ['cafe', 'cozy', 'work-friendly'],
    budget: 300,
    maxGroupSize: 6,
    time: 'morning',
    hours: '8:00 AM - 11:00 PM',
    latitude: 13.0418,
    longitude: 80.2341
  },
  {
    id: 'fallback-4',
    name: 'The Flying Elephant',
    location: 'Chennai',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 678,
    category: 'restaurant',
    description: 'Fine dining restaurant with excellent ambiance',
    tags: ['fine dining', 'romantic', 'premium'],
    budget: 1200,
    maxGroupSize: 4,
    time: 'evening',
    hours: '7:00 PM - 12:00 AM',
    latitude: 13.0569,
    longitude: 80.2425
  },
  {
    id: 'fallback-5',
    name: 'Kapaleeshwarar Temple',
    location: 'Chennai',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop',
    rating: 4.6,
    reviewCount: 2100,
    category: 'temple',
    description: 'Historic temple with beautiful architecture',
    tags: ['historic', 'cultural', 'spiritual'],
    budget: 50,
    maxGroupSize: 15,
    time: 'morning',
    hours: '6:00 AM - 12:00 PM, 4:00 PM - 9:00 PM',
    latitude: 13.0343,
    longitude: 80.2698
  },
];

export function useSwipePlaces(planData: PlanData, initialFilters: FilterParams) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [likedPlaces, setLikedPlaces] = useState<Place[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [useGoogleAPI, setUseGoogleAPI] = useState(true);
  const navigate = useNavigate();

  const fetchPlaces = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build a comprehensive prompt for Google Places API
      let prompt = '';
      if (planData.description && planData.description.trim()) {
        prompt = planData.description;
      } else {
        // Build prompt from plan data
        const parts = [];
        if (planData.occasion) parts.push(planData.occasion);
        if (planData.outingType && planData.outingType !== 'movie') parts.push(planData.outingType);
        parts.push('places in Chennai');
        if (filters.keyword) parts.push(filters.keyword);
        prompt = parts.join(' ');
      }

      console.log('Fetching places with prompt:', prompt);
      
      // Use Google Places API
      const results = await getBlitzRecommendations(prompt);
      
      // Filter out any movie-related places
      const filteredResults = results.filter(place => 
        !place.category?.toLowerCase().includes('movie') &&
        !place.category?.toLowerCase().includes('cinema') &&
        !place.name?.toLowerCase().includes('cinema') &&
        !place.name?.toLowerCase().includes('theater')
      );
      
      if (filteredResults.length > 0) {
        console.log("Successfully fetched places:", filteredResults);
        setPlaces(filteredResults);
        setAllPlaces(filteredResults);
        setError(null);
        
        toast({
          title: "Places loaded",
          description: `Found ${filteredResults.length} places matching your criteria`,
        });
      } else {
        // If no results, use fallback data
        console.log("No places found, using fallback data");
        setPlaces(FALLBACK_PLACES);
        setAllPlaces(FALLBACK_PLACES);
        
        toast({
          title: "Using fallback data",
          description: "Could not find places matching your criteria, showing alternatives",
        });
      }
    } catch (err) {
      console.error("Error fetching places:", err);
      setError("Failed to retrieve places. Please try again.");
      setPlaces(FALLBACK_PLACES);
      setAllPlaces(FALLBACK_PLACES);
      
      toast({
        title: "Error loading places",
        description: "Using fallback data instead",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planData.occasion, planData.outingType, planData.locality, filters, useGoogleAPI]);

  const handleApplyFilters = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleFilterByPrompt = async (prompt: string) => {
    setIsLoading(true);
    
    try {
      // Use Google Places API for prompt-based search
      console.log("Filtering by prompt:", prompt);
      const results = await getBlitzRecommendations(prompt);
      
      // Filter out movie-related places
      const filteredResults = results.filter(place => 
        !place.category?.toLowerCase().includes('movie') &&
        !place.category?.toLowerCase().includes('cinema') &&
        !place.name?.toLowerCase().includes('cinema') &&
        !place.name?.toLowerCase().includes('theater')
      );
      
      if (filteredResults.length > 0) {
        setPlaces(filteredResults);
        toast({
          title: "Places found",
          description: `Found ${filteredResults.length} places matching your criteria.`
        });
      } else {
        // Fallback to filtering existing places
        if (prompt && allPlaces.length > 0) {
          const filteredPlaces = parseAndFilterPlaces(prompt, allPlaces);
          
          if (filteredPlaces.length === 0) {
            toast({
              title: "No matching places",
              description: "No places match your criteria. Try a different search."
            });
            setPlaces(FALLBACK_PLACES);
          } else {
            setPlaces(filteredPlaces);
            toast({
              title: "Places filtered",
              description: `Found ${filteredPlaces.length} places matching your criteria.`
            });
          }
        } else {
          setPlaces(FALLBACK_PLACES);
        }
      }
    } catch (error) {
      console.error('Error with prompt search:', error);
      toast({
        title: "Search error",
        description: "Could not search places. Please try again.",
        variant: "destructive",
      });
      setPlaces(FALLBACK_PLACES);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (places.length === 0) return;
    const currentPlace = places[0];

    if (direction === 'right' || direction === 'up') {
      setLikedPlaces(prev => [...prev, currentPlace]);

      if (direction === 'up') {
        toast({
          title: 'Booking in progress',
          description: `Booking ${currentPlace.name}...`,
        });
      } else {
        toast({
          title: 'Place liked',
          description: `${currentPlace.name} added to your favorites`,
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
    fetchPlaces();
  };

  const handleToggleDataSource = () => {
    setUseGoogleAPI(!useGoogleAPI);
    setIsLoading(true);
    
    setTimeout(() => {
      fetchPlaces();
    }, 500);
    
    toast({
      title: useGoogleAPI ? "Using local data" : "Using Google Places API",
      description: useGoogleAPI 
        ? "Switching to local database and simulated results." 
        : "Switching to Google Places API for real-time data."
    });
  };

  return {
    places,
    likedPlaces,
    showResults,
    isLoading,
    error,
    filters,
    useSimulation: !useGoogleAPI,
    handleApplyFilters,
    handleFilterByPrompt,
    handleSwipe,
    handleContinuePlanning,
    handleFinishPlanning,
    handleRetry,
    handleToggleDataSource,
  };
}