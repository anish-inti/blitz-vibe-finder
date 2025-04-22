
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Place } from "@/components/SwipeCard";
import { toast } from "@/hooks/use-toast";
import { fetchChennaiPlaces } from "@/utils/fetchPlaces";
import { FilterParams } from "@/components/SearchFilters";
import { simulateGoogleSearch } from "@/services/searchSimulationService";

interface PlanData {
  occasion: string;
  outingType: string;
  locality: number;
  timing: Date;
  description: string;
}

export function useSwipePlaces(planData: PlanData, initialFilters: FilterParams) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [likedPlaces, setLikedPlaces] = useState<Place[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [useSimulation, setUseSimulation] = useState(false);
  const navigate = useNavigate();

  const handleSupabaseError = (error: any, defaultMessage = "An error occurred") => {
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
      if (useSimulation) {
        // If user has explicitly chosen to use simulated data
        const { places: simulatedPlaces, error: simulationError } = 
          await simulateGoogleSearch("Chennai, India", filters);
        
        if (simulationError) {
          setError(simulationError);
          setPlaces([]);
        } else {
          setPlaces(simulatedPlaces);
          setError(null);
        }
      } else {
        // Default: try database first
        const { places: dbPlaces, error: dbError } = await fetchChennaiPlaces({ planData, filters });
        
        if (dbError || dbPlaces.length === 0) {
          console.log("Database fetch failed or returned no results, falling back to search simulation");
          const { places: simulatedPlaces, error: simulationError } = 
            await simulateGoogleSearch("Chennai, India", filters);
          
          if (simulationError) {
            setError(simulationError);
            setPlaces([]);
          } else {
            setPlaces(simulatedPlaces);
            setError(null);
            toast({
              title: "Using simulated search results",
              description: "We're showing you simulated search results as no database results were found."
            });
          }
        } else {
          console.log("Successfully fetched places from database:", dbPlaces);
          setPlaces(dbPlaces);
          setError(null);
        }
      }
    } catch (err) {
      console.error("Error fetching places:", err);
      setError("Failed to retrieve places. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabasePlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planData.occasion, planData.outingType, planData.locality, filters, useSimulation]);

  const handleApplyFilters = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    if (places.length === 0) return;
    const currentPlace = places[0];

    if (direction === 'right' || direction === 'up') {
      setLikedPlaces(prev => [...prev, currentPlace]);

      // Only save to database if it's not a simulated place ID
      if (!currentPlace.id.toString().startsWith('sim-')) {
        try {
          const { error } = await supabase
            .from('liked_places')
            .insert({ place_id: currentPlace.id });

          if (error) {
            handleSupabaseError(error, 'Could not save your like. Please try again.');
          }
        } catch (error) {
          console.error('Error in saving liked place:', error);
        }
      } else {
        // For simulated places, just show a toast that it was saved locally
        toast({
          title: 'Place liked',
          description: `${currentPlace.name} added to your favorites`,
        });
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

  const handleToggleDataSource = () => {
    setUseSimulation(!useSimulation);
    setIsLoading(true);
    
    setTimeout(() => {
      fetchDatabasePlaces();
    }, 500);
    
    toast({
      title: useSimulation ? "Using database results" : "Using simulated results",
      description: useSimulation 
        ? "Switching to database results for places in Chennai." 
        : "Switching to simulated search results for places in Chennai."
    });
  };

  return {
    places,
    likedPlaces,
    showResults,
    isLoading,
    error,
    filters,
    useSimulation,
    handleApplyFilters,
    handleSwipe,
    handleContinuePlanning,
    handleFinishPlanning,
    handleRetry,
    handleToggleDataSource,
  };
}
