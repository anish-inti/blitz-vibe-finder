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

// Mock data
const MOCK_PLACES: Place[] = [
  {
    id: '1',
    name: 'VM Food Street',
    location: 'Chennai',
    country: 'India',
    image: '/lovable-uploads/b752b4f7-2a81-4715-a676-9c7bd1f9c93c.png',
    tags: ['street food', 'outdoor', 'budget'],
    budget: 150,
    maxGroupSize: 6,
    time: 'evening',
    hours: '11:00 AM - 10:00 PM',
  },
  {
    id: '2',
    name: 'Neon Club',
    location: 'Miami',
    country: 'USA',
    image: '/lovable-uploads/0d66895e-8267-4c1f-9e27-62c8bff7d8d1.png',
    tags: ['club', 'nightlife', 'premium'],
    budget: 500,
    maxGroupSize: 10,
    time: 'night',
    hours: '8:00 PM - 2:00 AM',
  },
  {
    id: '3',
    name: 'Starlight Rooftop',
    location: 'New York',
    country: 'USA',
    image: '/lovable-uploads/338fb7a8-90b8-400c-a1a7-b1f2af04f5bf.png',
    tags: ['rooftop', 'aesthetic', 'romantic'],
    budget: 400,
    maxGroupSize: 4,
    time: 'evening',
    hours: '5:00 PM - 11:00 PM',
  },
  {
    id: '4',
    name: 'Luna Lounge',
    location: 'Los Angeles',
    country: 'USA',
    image: '/lovable-uploads/02972e2d-092f-4952-88c5-fcf4ee6acc82.png',
    tags: ['lounge', 'chill', 'aesthetic'],
    budget: 350,
    maxGroupSize: 6,
    time: 'night',
    hours: '6:00 PM - 12:00 AM',
  },
];

const Places: React.FC = () => {
  const { darkMode } = useTheme();
  const [places, setPlaces] = useState<Place[]>([]);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [promptFilters, setPromptFilters] = useState<ParsedFilters | null>(null);
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);
  
  useEffect(() => {
    // Simulate fetching data from an API
    setIsLoading(true);
    setTimeout(() => {
      setPlaces(MOCK_PLACES);
      setAllPlaces(MOCK_PLACES);
      setIsLoading(false);
    }, 800);
  }, []);
  
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
  };
  
  const handlePromptSearch = () => {
    if (!userPrompt.trim()) return;
    
    const filters = parseUserPrompt(userPrompt);
    setPromptFilters(filters);
    
    if (filters && allPlaces.length > 0) {
      setIsLoading(true);
      
      // Filter the places based on the prompt
      const filteredPlaces = allPlaces.filter(place => {
        const budgetMatch = filters.budget ? (place.budget ? place.budget <= filters.budget : true) : true;
        const groupMatch = filters.groupSize ? (place.maxGroupSize ? place.maxGroupSize >= filters.groupSize : true) : true;
        const timeMatch = filters.time ? (place.time === filters.time || (place.hours?.toLowerCase()?.includes(filters.time || '') ?? false)) : true;
        const vibeMatch = filters.vibes.length > 0 ? (place.tags ? filters.vibes.some(v => place.tags?.includes(v)) : false) : true;
        
        return budgetMatch && groupMatch && timeMatch && vibeMatch;
      });
      
      setTimeout(() => {
        if (filteredPlaces.length === 0) {
          toast({
            title: "No matches found",
            description: "Try a different search criteria.",
          });
          // Keep existing places
        } else {
          setPlaces(filteredPlaces);
          toast({
            title: "Places filtered",
            description: `Found ${filteredPlaces.length} places matching your criteria.`,
          });
        }
        setIsLoading(false);
      }, 500);
    }
    
    setShowPromptInput(false);
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
            <>
              <div className="relative">
                <SwipeDeck 
                  places={places} 
                  onSwipe={handleSwipe} 
                  promptFilters={promptFilters || undefined} 
                />
              </div>
            </>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Places;
