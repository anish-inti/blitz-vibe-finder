
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Place } from "@/components/SwipeCard";
import { toast } from "@/hooks/use-toast";
import { fetchChennaiPlaces } from "@/utils/fetchPlaces";
import { FilterParams } from "@/components/SearchFilters";

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
    const { places, error } = await fetchChennaiPlaces({ planData, filters });
    setPlaces(places);
    setError(error);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDatabasePlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return {
    places,
    likedPlaces,
    showResults,
    isLoading,
    error,
    filters,
    handleApplyFilters,
    handleSwipe,
    handleContinuePlanning,
    handleFinishPlanning,
    handleRetry,
  };
}
