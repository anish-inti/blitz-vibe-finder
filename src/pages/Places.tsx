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

// Mock places data
const MOCK_PLACES: Place[] = [
  {
    id: '1',
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
  },
  {
    id: '2',
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
  },
  {
    id: '3',
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
  },
  {
    id: '4',
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
  },
  {
    id: '5',
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
  },
];

const Places: React.FC = () => {
  const { darkMode } = useTheme();
  const [places, setPlaces] = useState<Place[]>(MOCK_PLACES);
  const [allPlaces, setAllPlaces] = useState<Place[]>(MOCK_PLACES);
  const [isLoading, setIsLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [promptFilters, setPromptFilters] = useState<ParsedFilters | null>(null);
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);
  
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

  const loadMorePlaces = () => {
    // Shuffle and add more places from the mock data
    const shuffled = [...MOCK_PLACES].sort(() => Math.random() - 0.5);
    setPlaces(prev => [...prev, ...shuffled]);
  };
  
  const handlePromptSearch = () => {
    if (!userPrompt.trim()) return;
    
    setIsLoading(true);
    const filters = parseUserPrompt(userPrompt);
    setPromptFilters(filters);
    
    // Filter places based on the prompt
    let filteredPlaces = [...allPlaces];
    
    if (filters.budget) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.budget ? place.budget <= filters.budget! : true
      );
    }
    
    if (filters.groupSize) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.maxGroupSize ? place.maxGroupSize >= filters.groupSize! : true
      );
    }
    
    if (filters.time) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.time === filters.time || 
        place.hours?.toLowerCase().includes(filters.time!)
      );
    }
    
    if (filters.vibes.length > 0) {
      filteredPlaces = filteredPlaces.filter(place => 
        place.tags ? filters.vibes.some(vibe => place.tags.includes(vibe)) : false
      );
    }
    
    if (filteredPlaces.length === 0) {
      toast({
        title: "No matching places",
        description: "No places match your criteria. Try a different search.",
      });
      filteredPlaces = allPlaces; // Show all places if no matches
    } else {
      toast({
        title: "Places found",
        description: `Found ${filteredPlaces.length} places matching your criteria.`,
      });
    }
    
    setPlaces(filteredPlaces);
    setIsLoading(false);
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