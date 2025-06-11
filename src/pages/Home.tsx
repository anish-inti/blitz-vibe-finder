import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Zap, MapPin, Loader2, Sparkles, TrendingUp, Users, Coffee, Moon, ShoppingBag, Camera, Play } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { toast } from "@/components/ui/use-toast";
import FeaturedPlaceCard from '@/components/FeaturedPlaceCard';
import OutingCard from '@/components/OutingCard';
import QuickAccessButton from '@/components/QuickAccessButton';
import { useTheme } from '@/contexts/ThemeContext';
import { getBlitzRecommendations } from '@/services/googlePlacesService';
import { Place } from '@/components/SwipeCard';

const QUICK_ACCESS = [
  { id: '1', name: 'Food', icon: <Coffee className="w-5 h-5" />, gradient: 'from-orange-500 to-red-500' },
  { id: '2', name: 'Nightlife', icon: <Moon className="w-5 h-5" />, gradient: 'from-blitz-primary to-blitz-accent' },
  { id: '3', name: 'Groups', icon: <Users className="w-5 h-5" />, gradient: 'from-blue-500 to-cyan-500' },
  { id: '4', name: 'Shopping', icon: <ShoppingBag className="w-5 h-5" />, gradient: 'from-green-500 to-emerald-500' },
  { id: '5', name: 'Culture', icon: <Camera className="w-5 h-5" />, gradient: 'from-blitz-secondary to-blitz-primary' },
  { id: '6', name: 'Trending', icon: <TrendingUp className="w-5 h-5" />, gradient: 'from-pink-500 to-rose-500' },
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
    
    // Spotify-style feedback
    toast({
      title: `${filter} mode activated`,
      description: `Finding the best ${filter.toLowerCase()} spots for you...`,
    });
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
      title: `Welcome to ${nextLocation}!`,
      description: "Discovering amazing places in your new city...",
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
      {/* Subtle floating background elements - Spotify style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blitz-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blitz-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-blitz-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <Header />
      
      <main className="relative pb-24 space-y-8">
        {/* Location Selector */}
        <div className="px-6 pt-4">
          <button 
            onClick={handleLocationClick}
            className="flex items-center text-muted-foreground hover:text-blitz-primary transition-all duration-300 interactive group"
          >
            <MapPin className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">{selectedLocation}</span>
            <Sparkles className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
        
        {/* Hero Section - Spotify-inspired */}
        <section className="px-6 space-y-6">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-hero">
              Unlock Your City
            </h1>
            <p className="text-body text-muted-foreground max-w-md leading-relaxed">
              Your perfect outing is just a swipe away. Discover, explore, and make memories in {selectedLocation}.
            </p>
          </div>
          
          <button 
            onClick={handleStartBlitz}
            disabled={isButtonLoading}
            className="w-full btn-primary rounded-2xl py-4 font-bold text-lg relative overflow-hidden group"
          >
            <div className="relative flex items-center justify-center">
              {isButtonLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Starting your adventure...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Blitzing
                </>
              )}
            </div>
          </button>
        </section>
        
        {/* Quick Access - Spotify grid style */}
        <section className="space-y-4 animate-slide-up">
          <div className="px-6">
            <h2 className="text-headline flex items-center">
              Explore by Vibe
              <Sparkles className="w-5 h-5 ml-2 text-blitz-secondary animate-pulse-glow" />
            </h2>
          </div>
          <div className="px-6">
            <div className="grid grid-cols-3 gap-3">
              {QUICK_ACCESS.map((item) => (
                <QuickAccessButton
                  key={item.id}
                  name={item.name}
                  icon={item.icon}
                  isActive={activeFilter === item.name}
                  onClick={() => handleQuickAccessClick(item.name)}
                  gradient={item.gradient}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* What's Hot Now - Spotify-style */}
        <section className="space-y-4 animate-fade-in">
          <div className="px-6 flex items-center justify-between">
            <h2 className="text-headline flex items-center">
              🔥 What's Hot
              <span className="ml-2 badge-live">
                LIVE
              </span>
            </h2>
          </div>
          
          {isLoadingHotNow ? (
            <div className="flex items-center justify-center h-48">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-blitz-primary" />
                <p className="text-caption text-muted-foreground">Finding the hottest spots...</p>
              </div>
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent className="ml-6">
                {hotNowPlaces.map((place, index) => (
                  <CarouselItem key={place.id} className="basis-4/5 pr-4">
                    <div className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <FeaturedPlaceCard 
                        place={{
                          id: place.id,
                          name: place.name,
                          description: place.description || `${place.category} in ${place.location}`,
                          image: place.image,
                        }} 
                        onClick={() => handlePlaceClick(place)} 
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </section>
        
        {/* Curated For You - Spotify list style */}
        <section className="space-y-4 animate-slide-up">
          <div className="px-6">
            <h2 className="text-headline flex items-center">
              {activeFilter ? (
                <>
                  <span className="text-gradient">{activeFilter}</span>
                  <span className="ml-2">Spots</span>
                </>
              ) : (
                'Made for You'
              )}
              <TrendingUp className="w-5 h-5 ml-2 text-blitz-accent" />
            </h2>
          </div>
          
          {isLoadingCurated ? (
            <div className="px-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted/30 rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="px-6 space-y-3">
              {curatedOutings.slice(0, 4).map((place, index) => (
                <div key={place.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <OutingCard 
                    outing={convertPlaceToOuting(place)}
                    onClick={() => handlePlaceClick(place)} 
                  />
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Community Picks - Spotify-style */}
        <section className="space-y-4 animate-fade-in">
          <div className="px-6">
            <h2 className="text-headline flex items-center">
              Community Favorites
              <span className="ml-2 badge-trending">
                TOP RATED
              </span>
            </h2>
          </div>
          
          {isLoadingCommunity ? (
            <div className="px-6 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-muted/30 rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="px-6 space-y-3">
              {communityPicks.map((place, index) => (
                <div key={place.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.15}s` }}>
                  <OutingCard 
                    outing={convertPlaceToOuting(place)} 
                    showCommunityBadge
                    onClick={() => handlePlaceClick(place)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action - Spotify-inspired */}
        <section className="px-6 py-8 animate-bounce-in">
          <div className="card-hero rounded-2xl p-6 text-center space-y-4">
            <h3 className="text-title text-gradient">Ready to explore?</h3>
            <p className="text-caption text-muted-foreground">
              Join thousands discovering their city's hidden gems
            </p>
            <button 
              onClick={() => navigate('/swipe')}
              className="btn-secondary rounded-xl px-6 py-3 font-semibold interactive-glow"
            >
              Start Swiping 🚀
            </button>
          </div>
        </section>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;