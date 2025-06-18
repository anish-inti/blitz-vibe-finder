import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeDeck from '@/components/SwipeDeck';
import { Sparkles, Filter } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';
import { Place } from '@/components/SwipeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ParsedFilters, parseUserPrompt } from '@/utils/promptParser';
import { getBlitzRecommendations } from '@/services/googlePlacesService';

const Places: React.FC = () => {
  const { darkMode } = useTheme();
  const [places, setPlaces] = useState<Place[]>([]);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [promptFilters, setPromptFilters] = useState<ParsedFilters | null>(null);
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);
  
  useEffect(() => {
    // Load initial places
    loadInitialPlaces();
  }, []);

  const loadInitialPlaces = async () => {
    setIsLoading(true);
    try {
      console.log("Loading initial places...");
      const initialPlaces = await getBlitzRecommendations("best hangout spots in Chennai");
      console.log("Initial places loaded:", initialPlaces);
      setPlaces(initialPlaces);
      setAllPlaces(initialPlaces);
    } catch (error) {
      console.error('Error loading initial places:', error);
      toast({
        title: "Error loading places",
        description: "Could not load places. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    const newPlaces = [...places];
    const removed = newPlaces.shift();
    setPlaces(newPlaces);
    
    if (direction === 'right') {
      toast({
        title: 'Place added to favorites',
        description: `${removed?.name} has been added to your favorites`,
      });
    } else if (direction === 'up') {
      toast({
        title: 'Booking information',
        description: `Opening booking options for ${removed?.name}...`,
      });
    }

    // Load more places if running low
    if (newPlaces.length <= 2) {
      loadMorePlaces();
    }
  };

  const loadMorePlaces = async () => {
    try {
      console.log("Loading more places...");
      const morePlaces = await getBlitzRecommendations("more places to visit in Chennai");
      setPlaces(prev => [...prev, ...morePlaces]);
      setAllPlaces(prev => [...prev, ...morePlaces]);
    } catch (error) {
      console.error('Error loading more places:', error);
    }
  };
  
  const handlePromptSearch = async () => {
    if (!userPrompt.trim()) return;
    
    setIsLoading(true);
    const filters = parseUserPrompt(userPrompt);
    setPromptFilters(filters);
    
    try {
      console.log("Searching with prompt:", userPrompt);
      const searchResults = await getBlitzRecommendations(userPrompt);
      
      if (searchResults.length === 0) {
        toast({
          title: "No matches found",
          description: "Try a different search criteria.",
        });
      } else {
        setPlaces(searchResults);
        toast({
          title: "Places found",
          description: `Found ${searchResults.length} places matching your criteria.`,
        });
      }
    } catch (error) {
      console.error('Error searching places:', error);
      toast({
        title: "Search error",
        description: "Could not search places. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowPromptInput(false);
    }
  };
  
  return (
    <div className={`min-h-screen flex flex-col relative transition-all duration-300 ${darkMode ? "bg-blitz-black" : "bg-blitz-offwhite"}`}>
      <div className={`cosmic-bg absolute inset-0 z-0 ${darkMode ? "opacity-100" : "opacity-20"}`}></div>
      
      <Header title="Discover Places" />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className={`text-xl font-semibold relative ${darkMode ? "text-white" : "text-blitz-black"}`}>
              Discover Places
              <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-blitz-stardust animate-pulse-glow" />
            </h1>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={darkMode ? "text-blitz-lightgray hover:text-white" : "text-gray-600 hover:text-gray-900"}
              onClick={() => setShowPromptInput(!showPromptInput)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {showPromptInput && (
            <div className="mb-4 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., We're 4 people, ₹300 per person, looking for rooftop cafes"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePromptSearch()}
                  className={darkMode ? "bg-transparent border-blitz-gray text-white" : "bg-white text-gray-900"}
                />
                <Button 
                  onClick={handlePromptSearch}
                  size="sm"
                  className="whitespace-nowrap bg-blitz-pink hover:bg-blitz-pink/90"
                >
                  Search
                </Button>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-blitz-pink/20 border-t-blitz-pink animate-spin mb-4"></div>
              <p className={`text-sm ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"}`}>Loading places...</p>
            </div>
          ) : (
            <div className="relative">
              <SwipeDeck 
                places={places} 
                onSwipe={handleSwipe} 
                promptFilters={promptFilters || undefined} 
              />
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Places;