import React, { useState } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeDeck from '@/components/SwipeDeck';
import { Sparkles, Database, Search, Filter } from 'lucide-react';
import { useLocationContext } from '@/contexts/LocationContext';
import SwipeResults from '@/components/SwipeResults';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ParsedFilters, parseUserPrompt } from '@/utils/promptParser';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Place } from '@/components/SwipeCard';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface PlanData {
  occasion: string;
  outingType: string;
  locality: number;
  timing: Date;
  description: string;
}

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

const SwipePage: React.FC = () => {
  const location = useRouterLocation();
  const navigate = useNavigate();
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [promptFilters, setPromptFilters] = useState<ParsedFilters | null>(null);
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);
  const [places, setPlaces] = useState<Place[]>(MOCK_PLACES);
  const [likedPlaces, setLikedPlaces] = useState<Place[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useSimulation, setUseSimulation] = useState(false);

  const planData: PlanData = location.state as PlanData || {
    occasion: '',
    outingType: '',
    locality: 5,
    timing: new Date(),
    description: ''
  };

  const handlePromptSearch = () => {
    if (!userPrompt.trim()) return;
    
    setIsLoading(true);
    const filters = parseUserPrompt(userPrompt);
    setPromptFilters(filters);
    
    // Filter places based on the prompt
    let filteredPlaces = [...MOCK_PLACES];
    
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
    
    setTimeout(() => {
      if (filteredPlaces.length === 0) {
        toast({
          title: "No matching places",
          description: "No places match your criteria. Showing all places.",
        });
        setPlaces(MOCK_PLACES);
      } else {
        toast({
          title: "Places found",
          description: `Found ${filteredPlaces.length} places matching your criteria.`,
        });
        setPlaces(filteredPlaces);
      }
      
      setIsLoading(false);
      setShowPromptInput(false);
    }, 1000);
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (places.length === 0) return;
    
    const currentPlace = places[0];
    const newPlaces = [...places];
    newPlaces.shift();
    
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

  const handleToggleDataSource = () => {
    setUseSimulation(!useSimulation);
    toast({
      title: useSimulation ? "Using real data" : "Using simulated data",
      description: useSimulation 
        ? "Switching to real place data." 
        : "Switching to simulated results for demo."
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-blitz-black">
      <div className="cosmic-bg absolute inset-0 z-0"></div>
      <Header showBackButton title="Find Places" />
      
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-4">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-semibold text-white relative tracking-tight">
              Find Your Experience
              <Sparkles className="absolute -right-5 top-1 w-3.5 h-3.5 text-blitz-pink opacity-70" />
            </h1>
            
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blitz-lightgray hover:text-white"
                      onClick={() => setShowPromptInput(!showPromptInput)}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search by prompt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blitz-lightgray hover:text-white"
                      onClick={handleToggleDataSource}
                    >
                      {useSimulation ? (
                        <Search className="h-4 w-4" />
                      ) : (
                        <Database className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{useSimulation ? "Using simulated data" : "Using real data"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {showPromptInput && (
            <div className="mb-4 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., We're 4 people, ₹300 per person, looking for rooftop cafes in the evening"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePromptSearch()}
                  className="bg-transparent border-blitz-gray text-white"
                />
                <Button 
                  onClick={handlePromptSearch}
                  size="sm"
                  className="whitespace-nowrap bg-blitz-pink hover:bg-blitz-pink/90"
                >
                  Search
                </Button>
              </div>
              {promptFilters && (
                <div className="mt-2 text-xs text-blitz-lightgray">
                  <div className="flex flex-wrap gap-2">
                    {promptFilters.budget && (
                      <Badge className="bg-blitz-gray/70">₹{promptFilters.budget}</Badge>
                    )}
                    {promptFilters.groupSize && (
                      <Badge className="bg-blitz-gray/70">{promptFilters.groupSize} people</Badge>
                    )}
                    {promptFilters.time && (
                      <Badge className="bg-blitz-gray/70">{promptFilters.time}</Badge>
                    )}
                    {promptFilters.vibes.map((vibe, index) => (
                      <Badge key={index} className="bg-blitz-pink/80">{vibe}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {showResults ? (
            <SwipeResults
              likedPlaces={likedPlaces}
              onContinue={handleContinuePlanning}
              onFinish={handleFinishPlanning}
            />
          ) : isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-blitz-pink/20 border-t-blitz-pink animate-spin mb-4"></div>
              <p className="text-blitz-lightgray text-sm">Finding experiences...</p>
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

export default SwipePage;