import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Flame, Zap, Moon, Users, Compass, Coffee, Home as HomeIcon, Umbrella, Heart, Loader, MapPin } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { toast } from "@/components/ui/use-toast";
import FeaturedPlaceCard from '@/components/FeaturedPlaceCard';
import OutingCard from '@/components/OutingCard';
import QuickAccessButton from '@/components/QuickAccessButton';
import { useTheme } from '@/contexts/ThemeContext';
import { getBlitzRecommendations } from '@/services/googlePlacesService';
import { Place } from '@/components/SwipeCard';

const QUICK_ACCESS = [
  { id: '1', name: 'Nightlife', icon: <Moon className="w-5 h-5" /> },
  { id: '2', name: 'Couples', icon: <Heart className="w-5 h-5" /> },
  { id: '3', name: 'Groups', icon: <Users className="w-5 h-5" /> },
  { id: '4', name: 'Adventure', icon: <Compass className="w-5 h-5" /> },
  { id: '5', name: 'Cafes', icon: <Coffee className="w-5 h-5" /> },
  { id: '6', name: 'Staycation', icon: <HomeIcon className="w-5 h-5" /> },
  { id: '7', name: 'Rainy Day', icon: <Umbrella className="w-5 h-5" /> },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: string; size: string }[]>([]);
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
  
  useEffect(() => {
    // Create random stars for the background
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      size: `${Math.random() * 2 + 1}px`
    }));
    setStars(newStars);
  }, []);

  // Fetch "What's Hot Now" places
  const fetchHotNowPlaces = useCallback(async () => {
    setIsLoadingHotNow(true);
    try {
      const places = await getBlitzRecommendations(`trending popular youth hangout spots in ${selectedLocation}`);
      setHotNowPlaces(places.slice(0, 6)); // Limit to 6 places
    } catch (error) {
      console.error('Failed to fetch hot places:', error);
      toast({
        title: "Could not load trending places",
        description: "Using fallback data",
        variant: "destructive",
      });
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
      setCuratedOutings(places.slice(0, 8)); // Limit to 8 places
    } catch (error) {
      console.error('Failed to fetch curated places:', error);
      toast({
        title: "Could not load curated places",
        description: "Using fallback data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCurated(false);
    }
  }, [selectedLocation, activeFilter]);

  // Fetch community picks
  const fetchCommunityPicks = useCallback(async () => {
    setIsLoadingCommunity(true);
    try {
      const places = await getBlitzRecommendations(`highly rated top rated best places in ${selectedLocation}`);
      setCommunityPicks(places.slice(0, 4)); // Limit to 4 places
    } catch (error) {
      console.error('Failed to fetch community picks:', error);
      toast({
        title: "Could not load community picks",
        description: "Using fallback data",
        variant: "destructive",
      });
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
    // Simulate loading state for better UX
    setTimeout(() => {
      navigate('/planner');
      setIsButtonLoading(false);
    }, 800);
  };

  const handleQuickAccessClick = (filter: string) => {
    const newFilter = filter === activeFilter ? null : filter;
    setActiveFilter(newFilter);
    
    if (newFilter) {
      toast({
        title: `${newFilter} filter applied`,
        description: `Loading ${newFilter.toLowerCase()} places...`,
        duration: 2000,
      });
    }
  };

  const handlePlaceClick = (place: Place) => {
    toast({
      title: "Opening details",
      description: "Loading place information...",
      duration: 1500,
    });
    navigate(`/places/${place.id}`);
  };
  
  const handleSeeAllClick = (section: string) => {
    toast({
      title: `Exploring ${section}`,
      description: "Loading more options...",
      duration: 1500,
    });
    navigate(`/search?section=${section}`);
  };

  const handleSponsoredClick = () => {
    toast({
      title: "Opening sponsored content",
      description: "You clicked on a sponsored item",
      duration: 1500,
    });
    window.open('https://example.com/sponsored', '_blank');
  };

  const handleLocationClick = () => {
    const locations = ["Chennai", "Bengaluru", "Mumbai", "Delhi"];
    const currentIndex = locations.indexOf(selectedLocation);
    const nextLocation = locations[(currentIndex + 1) % locations.length];
    setSelectedLocation(nextLocation);
    
    toast({
      title: `Location changed to ${nextLocation}`,
      description: "Updating available places...",
      duration: 2000,
    });
  };

  // Convert Place to OutingCard format
  const convertPlaceToOuting = (place: Place) => ({
    id: place.id,
    name: place.name,
    type: place.category || 'Place',
    rating: place.rating || 4.0,
    reviews: place.reviewCount || 0,
    budget: place.budget ? `₹${place.budget}` : undefined,
    tags: place.tags || [],
    image: place.image,
    category: place.category,
    openStatus: place.isOpen ? 'Open' : 'Closed' as const,
  });
  
  return (
    <div className={`min-h-screen flex flex-col relative transition-all duration-300 ${darkMode ? "bg-[#121212]" : "bg-blitz-pink"}`}>
      <div className={`bg-gradient-to-b ${darkMode ? "from-[#121212] to-[#1F1F1F]" : "from-blitz-pink to-blitz-pink/90"} absolute inset-0 z-0 ${darkMode ? "opacity-100" : "opacity-100"}`}></div>
      
      {/* Animated stars - more subtle */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`cosmic-star animate-sparkle absolute ${darkMode ? "opacity-60" : "opacity-20"}`}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay
          }}
        />
      ))}
      
      <Header />
      
      <main className="flex-1 flex flex-col px-4 pb-20 z-10 overflow-y-auto">
        {/* Location Selector */}
        <div className="mt-4 mb-2">
          <button 
            onClick={handleLocationClick}
            className={`flex items-center ${darkMode ? "text-white" : "text-blitz-black"} font-medium px-3 py-1.5 rounded-full 
              ${darkMode ? "bg-blitz-gray/40 hover:bg-blitz-gray/60" : "bg-white/30 hover:bg-white/50"} transition-all active:scale-95`}
          >
            <MapPin className="w-4 h-4 mr-1" />
            {selectedLocation}
          </button>
        </div>
        
        {/* What's Hot Now Section */}
        <section className="mt-4 mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center">
              <Flame className={`${darkMode ? "text-blitz-pink" : "text-blitz-black"} mr-2 w-5 h-5`} />
              <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-blitz-black"}`}>What's Hot Now</h2>
            </div>
            <button 
              onClick={() => handleSeeAllClick('trending')} 
              className={`text-sm ${darkMode ? "text-blitz-pink" : "text-blitz-black"} hover:underline active:opacity-70 transition-all`}
            >
              See All
            </button>
          </div>
          
          {isLoadingHotNow ? (
            <div className="flex items-center justify-center h-52">
              <Loader className="w-6 h-6 animate-spin text-blitz-pink" />
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent>
                {hotNowPlaces.map((place) => (
                  <CarouselItem key={place.id} className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
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
              <CarouselPrevious className={`hidden sm:flex left-1 ${darkMode ? "bg-black/40 text-white" : "bg-white/40 text-black"}`} />
              <CarouselNext className={`hidden sm:flex right-1 ${darkMode ? "bg-black/40 text-white" : "bg-white/40 text-black"}`} />
            </Carousel>
          )}
        </section>
        
        {/* Quick Access Buttons */}
        <section className="mb-8 animate-fade-in delay-100">
          <div className="flex items-center mb-4 px-2">
            <Zap className={`${darkMode ? "text-blitz-pink" : "text-blitz-black"} mr-2 w-5 h-5`} />
            <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-blitz-black"}`}>Quick Access</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ACCESS.map((item) => (
              <QuickAccessButton 
                key={item.id} 
                name={item.name} 
                icon={item.icon} 
                isActive={activeFilter === item.name}
                onClick={() => handleQuickAccessClick(item.name)}
              />
            ))}
          </div>
        </section>
        
        {/* Curated Outings Feed */}
        <section className="mb-8 animate-fade-in delay-200">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-blitz-black"}`}>
              {activeFilter ? `${activeFilter} Spots` : 'Curated For You'}
            </h2>
            <button 
              onClick={() => handleSeeAllClick('curated')} 
              className={`text-sm ${darkMode ? "text-blitz-pink" : "text-blitz-black"} hover:underline active:opacity-70 transition-all`}
            >
              See All
            </button>
          </div>
          
          {isLoadingCurated ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="w-6 h-6 animate-spin text-blitz-pink" />
            </div>
          ) : (
            <div className="space-y-4">
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
        
        {/* Sponsored Banner */}
        <section className="mb-8 animate-fade-in delay-300">
          <div 
            className={`w-full rounded-2xl overflow-hidden glassmorphism border ${darkMode ? "border-white/10" : "border-black/10"} p-4 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]`}
            onClick={handleSponsoredClick}
          >
            <div className={`text-xs ${darkMode ? "text-blitz-lightgray" : "text-blitz-black/60"} mb-2`}>Sponsored</div>
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className={`${darkMode ? "text-white" : "text-blitz-black"} font-medium mb-1`}>Food Truck Festival</h3>
                <p className={`text-sm ${darkMode ? "text-blitz-lightgray" : "text-blitz-black/60"}`}>Discover 20+ food trucks this weekend near you!</p>
                <button className={`mt-3 px-4 py-2 ${darkMode ? "bg-blitz-pink text-white" : "bg-blitz-black text-white"} rounded-full text-sm transition-all hover:opacity-90 active:scale-95`}>
                  Learn More
                </button>
              </div>
              <div 
                className="w-24 h-24 bg-cover bg-center rounded-lg ml-4"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop')` }}
              ></div>
            </div>
          </div>
        </section>
        
        {/* Community Picks */}
        <section className="mb-8 animate-fade-in delay-400">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-blitz-black"}`}>Community Picks</h2>
            <button 
              onClick={() => handleSeeAllClick('community')} 
              className={`text-sm ${darkMode ? "text-blitz-pink" : "text-blitz-black"} hover:underline active:opacity-70 transition-all`}>
              See All
            </button>
          </div>
          
          {isLoadingCommunity ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="w-6 h-6 animate-spin text-blitz-pink" />
            </div>
          ) : (
            <div className="space-y-4">
              {communityPicks.slice(0, 2).map((place) => (
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
        
        {/* Start Planning Button */}
        <section className="mt-auto mb-8 text-center animate-fade-in delay-500">
          <button 
            onClick={handleStartBlitz}
            disabled={isButtonLoading}
            className={`w-full max-w-xs mx-auto px-10 py-3.5 ${
              darkMode 
                ? "bg-gradient-to-r from-blitz-purple to-blitz-pink text-white" 
                : "bg-blitz-black text-white"
            } text-base font-medium rounded-full shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 group ${
              darkMode ? "shadow-blitz-pink/20" : "shadow-black/20"
            }`}
          >
            <span className="flex items-center justify-center">
              {isButtonLoading ? (
                <>
                  <Loader className="animate-spin mr-2 w-4 h-4" /> 
                  Loading...
                </>
              ) : (
                <>
                  Start Blitzing
                  <Zap className={`ml-2 w-4 h-4 ${darkMode ? "text-white" : "text-blitz-pink"} opacity-90`} />
                </>
              )}
            </span>
          </button>
        </section>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;