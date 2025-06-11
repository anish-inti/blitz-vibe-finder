import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Place } from "@/components/SwipeCard";
import { toast } from "@/hooks/use-toast";
import { fetchChennaiPlaces } from "@/utils/fetchPlaces";
import { FilterParams } from "@/components/SearchFilters";
import { simulateGoogleSearch } from "@/services/searchSimulationService";
import { parseAndFilterPlaces } from "@/utils/promptParser";
import { getBlitzRecommendations } from "@/services/googlePlacesService";

interface PlanData {
  occasion: string;
  outingType: string;
  locality: number;
  timing: Date;
  description: string;
}

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
      let fetchedPlaces: Place[] = [];

      if (useGoogleAPI) {
        // Try Google Places API first
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

          console.log('Fetching from Google Places API with prompt:', prompt);
          fetchedPlaces = await getBlitzRecommendations(prompt);
          
          // Filter out any movie-related places
          fetchedPlaces = fetchedPlaces.filter(place => 
            !place.category?.toLowerCase().includes('movie') &&
            !place.category?.toLowerCase().includes('cinema') &&
            !place.name?.toLowerCase().includes('cinema') &&
            !place.name?.toLowerCase().includes('theater')
          );
          
          if (fetchedPlaces.length > 0) {
            console.log('Successfully fetched from Google Places API:', fetchedPlaces);
            setPlaces(fetchedPlaces);
            setAllPlaces(fetchedPlaces);
            setError(null);
            setIsLoading(false);
            
            toast({
              title: "Places loaded",
              description: `Found ${fetchedPlaces.length} places using Google Places API`,
            });
            return;
          } else {
            console.log('No places returned from Google Places API');
          }
        } catch (apiError) {
          console.error('Google Places API failed:', apiError);
          toast({
            title: "API Error",
            description: "Google Places API failed, trying alternative sources...",
            variant: "destructive",
          });
        }
      }

      // Fallback to database
      console.log("Trying database fallback...");
      const { places: dbPlaces, error: dbError } = await fetchChennaiPlaces({ planData, filters });
      
      if (!dbError && dbPlaces.length > 0) {
        const enhancedPlaces = dbPlaces
          .filter(place => 
            !place.category?.toLowerCase().includes('movie') &&
            !place.category?.toLowerCase().includes('cinema')
          )
          .map(place => ({
            ...place,
            tags: place.category ? [place.category.toLowerCase(), ...getRandomTags()] : getRandomTags(),
            budget: Math.floor(Math.random() * 500) + 100,
            maxGroupSize: Math.floor(Math.random() * 10) + 1,
            time: getRandomTime(),
            hours: getRandomHours(),
          }));
        
        setPlaces(enhancedPlaces);
        setAllPlaces(enhancedPlaces);
        setError(null);
        
        toast({
          title: "Places loaded from database",
          description: `Found ${enhancedPlaces.length} places`,
        });
      } else {
        // Final fallback to simulation
        console.log("Database failed, using simulation...");
        const { places: simulatedPlaces, error: simulationError } = 
          await simulateGoogleSearch("Chennai, India", filters);
        
        if (simulationError) {
          setError(simulationError);
          setPlaces([]);
          setAllPlaces([]);
        } else {
          const enhancedPlaces = simulatedPlaces
            .filter(place => 
              !place.category?.toLowerCase().includes('movie') &&
              !place.category?.toLowerCase().includes('cinema')
            )
            .map(place => ({
              ...place,
              tags: place.category ? [place.category.toLowerCase(), ...getRandomTags()] : getRandomTags(),
              budget: Math.floor(Math.random() * 500) + 100,
              maxGroupSize: Math.floor(Math.random() * 10) + 1,
              time: getRandomTime(),
              hours: getRandomHours(),
            }));
          
          setPlaces(enhancedPlaces);
          setAllPlaces(enhancedPlaces);
          setError(null);
          
          toast({
            title: "Using simulated results",
            description: "Showing simulated search results",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching places:", err);
      setError("Failed to retrieve places. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper functions for generating random data
  const getRandomTags = () => {
    const allTags = ["rooftop", "outdoor", "cafe", "club", "aesthetic", "chill", "romantic", "premium", "dance", "cozy", "peaceful", "nightlife"];
    const numTags = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...allTags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  };
  
  const getRandomTime = () => {
    const times = ["morning", "afternoon", "evening", "night"];
    return times[Math.floor(Math.random() * times.length)];
  };
  
  const getRandomHours = () => {
    const startHour = Math.floor(Math.random() * 12) + 7;
    const endHour = Math.floor(Math.random() * 6) + 18;
    return `${startHour}:00 AM - ${endHour}:00 PM`;
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
      if (useGoogleAPI) {
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
            } else {
              setPlaces(filteredPlaces);
              toast({
                title: "Places filtered",
                description: `Found ${filteredPlaces.length} places matching your criteria.`
              });
            }
          }
        }
      } else {
        // Use local filtering
        if (prompt && allPlaces.length > 0) {
          const filteredPlaces = parseAndFilterPlaces(prompt, allPlaces);
          
          if (filteredPlaces.length === 0) {
            toast({
              title: "No matching places",
              description: "No places match your criteria. Try a different search."
            });
          } else {
            setPlaces(filteredPlaces);
            toast({
              title: "Places filtered",
              description: `Found ${filteredPlaces.length} places matching your criteria.`
            });
          }
        }
      }
    } catch (error) {
      console.error('Error with prompt search:', error);
      toast({
        title: "Search error",
        description: "Could not search places. Please try again.",
        variant: "destructive",
      });
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