import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Zap, MapPin, Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { toast } from "@/components/ui/use-toast";
import FeaturedPlaceCard from '@/components/FeaturedPlaceCard';
import OutingCard from '@/components/OutingCard';
import QuickAccessButton from '@/components/QuickAccessButton';
import { useTheme } from '@/contexts/ThemeContext';
import { getBlitzRecommendations } from '@/services/googlePlacesService';
import { Place } from '@/components/SwipeCard';

const QUICK_ACCESS = [
  { id: '1', name: 'Cafes', icon: '☕' },
  { id: '2', name: 'Food', icon: '🍽️' },
  { id: '3', name: 'Nightlife', icon: '🌙' },
  { id: '4', name: 'Outdoor', icon: '🌳' },
  { id: '5', name: 'Shopping', icon: '🛍️' },
  { id: '6', name: 'Culture', icon: '🎭' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Chennai");
  
  // API-driven state
  const [hotNowPlaces, setHotNowPlaces] = useState<Place[]>([]);
  const [curatedOutings, setCuratedOutings] = useState<Place[]>([]);
  const [communityPicks, setCommunityPicks] = useState<Place[]>([]);
  const [isLoadingHotNow, setIsLoadingHotNow] = useState(true);
  const [isLoadingCurated, setIsLoadingCurated] = useState(true);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(true);

  // Fetch "What's Hot Now" places
  const fetchHotNowPlaces = useCallback(async () => {
    setIsLoadingHotNow(true);
    try {
      const places = await getBlitzRecommendations(`trending popular places in ${selectedLocation}`);
      setHotNowPlaces(places.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch hot places:', error);
    } finally {
      setIsLoadingHotNow(false);
    }
  }, [selectedLocation]);

  // Fetch curated outings based on active filter
  const fetchCuratedOutings = useCallback(async () => {
    setIsLoadingCurated(true);
    try {
      let query = `best places to visit in ${selectedLocation}`;
      if (activeFilter) {
        query = `${activeFilter.toLowerCase()} places in ${selectedLocation}`;
      }
      
      const places = await getBlitzRecommendations(query);
      setCuratedOutings(places.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch curated places:', error);
    } finally {
      setIsLoadingCurated(false);
    }
  }, [selectedLocation, activeFilter]);

  // Fetch community picks
  const fetchCommunityPicks = useCallback(async () => {
    setIsLoadingCommunity(true);
    try {
      const places = await getBlitzRecommendations(`highly rated places in ${selectedLocation}`);
      setCommunityPicks(places.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch community picks:', error);
    } finally {
      setIsLoadingCommunity(false);
    }
  }, [selectedLocation]);

  // Load data on mount and when location changes
  useEffect(() => {
    fetchHotNowPlaces();
    fetchCommunityPicks();
  }, [fetchHotNowPlaces, fetchCommunityPicks]);

  // Load curated outings when filter changes
  useEffect(() => {
    fetchCuratedOutings();
  }, [fetchCuratedOutings]);

  const handleStartBlitz = () => {
    setIsButtonLoading(true);
    setTimeout(() => {
      navigate('/planner');
      setIsButtonLoading(false);
    }, 600);
  };

  const handleQuickAccessClick = (filter: string) => {
    const newFilter = filter === activeFilter ? null : filter;
    setActiveFilter(newFilter);
  };

  const handlePlaceClick = (place: Place) => {
    navigate(`/places/${place.id}`);
  };

  const handleLocationClick = () => {
    const locations = ["Chennai", "Bengaluru", "Mumbai", "Delhi"];
    const currentIndex = locations.indexOf(selectedLocation);
    const nextLocation = locations[(currentIndex + 1) % locations.length];
    setSelectedLocation(nextLocation);
    
    toast({
      title: `Switched to ${nextLocation}`,
      description: "Finding places in your new location...",
    });
  };

  // Convert Place to OutingCard format
  const convertPlaceToOuting = (place: Place) => ({
    id: place.id,
    name: place.name,
    type: place.category || 'Place',
    rating: place.rating || 4.0,
    reviews: place.reviewCount || 0,
    tags: place.tags || [],
    image: place.image,
    category: place.category,
    openStatus: place.isOpen ? 'Open' : 'Closed' as const,
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-24 space-y-8">
        {/* Location Selector */}
        <div className="px-6 pt-4">
          <button 
            onClick={handleLocationClick}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <MapPin className="w-4 h-4 mr-2" />
            <span className="font-medium">{selectedLocation}</span>
          </button>
        </div>
        
        {/* Hero Section */}
        <section className="px-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-display">Discover</h1>
            <p className="text-muted-foreground">Find your perfect experience in {selectedLocation}</p>
          </div>
          
          <button 
            onClick={handleStartBlitz}
            disabled={isButtonLoading}
            className="w-full btn-primary rounded-xl py-4 font-semibold text-lg"
          >
            {isButtonLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Starting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                Start Planning
              </div>
            )}
          </button>
        </section>
        
        {/* Quick Access */}
        <section className="space-y-4">
          <h2 className="text-headline px-6">Browse</h2>
          <div className="px-6">
            <div className="grid grid-cols-3 gap-3">
              {QUICK_ACCESS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleQuickAccessClick(item.name)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    activeFilter === item.name
                      ? 'bg-blitz-primary text-white'
                      : 'bg-card hover:bg-accent'
                  }`}
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-sm font-medium">{item.name}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* What's Hot Now */}
        <section className="space-y-4">
          <div className="px-6">
            <h2 className="text-headline">What's Hot</h2>
          </div>
          
          {isLoadingHotNow ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent className="ml-6">
                {hotNowPlaces.map((place) => (
                  <CarouselItem key={place.id} className="basis-4/5 pr-4">
                    <FeaturedPlaceCard 
                      place={{
                        id: place.id,
                        name: place.name,
                        description: place.description || `${place.category} in ${place.location}`,
                        image: place.image,
                      }} 
                      onClick={() => handlePlaceClick(place)} 
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </section>
        
        {/* Curated For You */}
        <section className="space-y-4">
          <div className="px-6">
            <h2 className="text-headline">
              {activeFilter ? `${activeFilter} Places` : 'For You'}
            </h2>
          </div>
          
          {isLoadingCurated ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="px-6 space-y-3">
              {curatedOutings.slice(0, 4).map((place) => (
                <OutingCard 
                  key={place.id} 
                  outing={convertPlaceToOuting(place)}
                  onClick={() => handlePlaceClick(place)} 
                />
              ))}
            </div>
          )}
        </section>
        
        {/* Community Picks */}
        <section className="space-y-4">
          <div className="px-6">
            <h2 className="text-headline">Community Favorites</h2>
          </div>
          
          {isLoadingCommunity ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="px-6 space-y-3">
              {communityPicks.map((place) => (
                <OutingCard 
                  key={place.id} 
                  outing={convertPlaceToOuting(place)} 
                  showCommunityBadge
                  onClick={() => handlePlaceClick(place)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;