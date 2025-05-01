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

// Updated trending places with better images
const TRENDING_PLACES = [
  {
    id: '1',
    name: 'Marina Bay Lounge',
    description: 'Rooftop · Aesthetic · Group Friendly',
    image: '/lovable-uploads/338fb7a8-90b8-400c-a1a7-b1f2af04f5bf.png',
  },
  {
    id: '2',
    name: 'VM Food Street',
    description: 'Street Food · Budget · Lively',
    image: '/lovable-uploads/b752b4f7-2a81-4715-a676-9c7bd1f9c93c.png',
  },
  {
    id: '3',
    name: 'Neon Club',
    description: 'Nightlife · Music · Drinks',
    image: '/lovable-uploads/0d66895e-8267-4c1f-9e27-62c8bff7d8d1.png',
  },
  {
    id: '4',
    name: 'Phoenix Garden Cafe',
    description: 'Peaceful · Coffee · Work-friendly',
    image: '/lovable-uploads/02972e2d-092f-4952-88c5-fcf4ee6acc82.png',
  },
];

// Updated curated outings with better data - fixing the openStatus type
const CURATED_OUTINGS = [
  {
    id: '1',
    name: 'Urban Brew Cafe',
    type: 'Cafe',
    rating: 4.5,
    reviews: 128,
    budget: 'Budget',
    tags: ['Coffee', 'Breakfast', 'Wifi'],
    image: '/lovable-uploads/02972e2d-092f-4952-88c5-fcf4ee6acc82.png',
    category: 'Cafes',
    openStatus: 'Open' as const,
  },
  {
    id: '2',
    name: 'Coastline Beach Resort',
    type: 'Staycation',
    rating: 4.8,
    reviews: 253,
    budget: 'Luxury',
    tags: ['Beachfront', 'Spa', 'Restaurant'],
    image: '/lovable-uploads/338fb7a8-90b8-400c-a1a7-b1f2af04f5bf.png',
    category: 'Staycation',
    openStatus: 'Open' as const,
  },
  {
    id: '3',
    name: 'Forest Trek Adventures',
    type: 'Outdoor',
    rating: 4.6,
    reviews: 178,
    budget: 'Mid-Range',
    tags: ['Hiking', 'Nature', 'Group-friendly'],
    image: '/lovable-uploads/b752b4f7-2a81-4715-a676-9c7bd1f9c93c.png',
    category: 'Adventure',
    openStatus: 'Closing Soon' as const,
  },
  {
    id: '4',
    name: 'Night Owl Lounge',
    type: 'Nightlife',
    rating: 4.4,
    reviews: 315,
    budget: 'Premium',
    tags: ['Cocktails', 'Music', 'Late Night'],
    image: '/lovable-uploads/0d66895e-8267-4c1f-9e27-62c8bff7d8d1.png',
    category: 'Nightlife',
    openStatus: 'Open' as const,
  },
  {
    id: '5',
    name: 'Couple\'s Retreat Spa',
    type: 'Relaxation',
    rating: 4.9,
    reviews: 201,
    budget: 'Premium',
    tags: ['Couples', 'Massage', 'Wellness'],
    image: '/lovable-uploads/338fb7a8-90b8-400c-a1a7-b1f2af04f5bf.png',
    category: 'Couples',
    openStatus: 'Open' as const,
  },
  {
    id: '6',
    name: 'The Group Hub',
    type: 'Entertainment',
    rating: 4.7,
    reviews: 156,
    budget: 'Mid-Range',
    tags: ['Games', 'Group-friendly', 'Indoor'],
    image: '/lovable-uploads/b752b4f7-2a81-4715-a676-9c7bd1f9c93c.png',
    category: 'Groups',
    openStatus: 'Closed' as const,
  },
  {
    id: '7',
    name: 'Rainy Day Cafe',
    type: 'Cafe',
    rating: 4.3,
    reviews: 89,
    budget: 'Budget',
    tags: ['Indoor', 'Cozy', 'Books'],
    image: '/lovable-uploads/02972e2d-092f-4952-88c5-fcf4ee6acc82.png',
    category: 'Rainy Day',
    openStatus: 'Open' as const,
  },
];

const QUICK_ACCESS = [
  { id: '1', name: 'Nightlife', icon: <Moon className="w-5 h-5" /> },
  { id: '2', name: 'Couples', icon: <Heart className="w-5 h-5" /> },
  { id: '3', name: 'Groups', icon: <Users className="w-5 h-5" /> },
  { id: '4', name: 'Adventure', icon: <Compass className="w-5 h-5" /> },
  { id: '5', name: 'Cafes', icon: <Coffee className="w-5 h-5" /> },
  { id: '6', name: 'Staycation', icon: <HomeIcon className="w-5 h-5" /> },
  { id: '7', name: 'Rainy Day', icon: <Umbrella className="w-5 h-5" /> },
];

const COMMUNITY_PICKS = [
  {
    id: '1',
    name: 'Sunset Beach Cafe',
    type: 'Cafe',
    rating: 4.9,
    reviews: 423,
    tags: ['Beachfront', 'Coffee', 'Sunset View'],
    image: '/lovable-uploads/338fb7a8-90b8-400c-a1a7-b1f2af04f5bf.png',
    openStatus: 'Open' as const,
  },
  {
    id: '2',
    name: 'Mountain View Resort',
    type: 'Staycation',
    rating: 4.7,
    reviews: 286,
    tags: ['Mountain', 'Luxury', 'Spa'],
    image: '/lovable-uploads/02972e2d-092f-4952-88c5-fcf4ee6acc82.png',
    openStatus: 'Closing Soon' as const,
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: string; size: string }[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filteredOutings, setFilteredOutings] = useState(CURATED_OUTINGS);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Chennai");
  
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

  // Filter outings based on the active filter
  useEffect(() => {
    if (activeFilter) {
      const filtered = CURATED_OUTINGS.filter(outing => 
        outing.category === activeFilter || 
        outing.tags.includes(activeFilter)
      );
      setFilteredOutings(filtered.length > 0 ? filtered : CURATED_OUTINGS);
      
      // Show toast notification when filter is applied
      toast({
        title: `${activeFilter} filter applied`,
        description: `Showing ${filtered.length} places matching "${activeFilter}"`,
        duration: 2000,
      });
    } else {
      setFilteredOutings(CURATED_OUTINGS);
    }
  }, [activeFilter]);
  
  const handleStartBlitz = () => {
    setIsButtonLoading(true);
    // Simulate loading state for better UX
    setTimeout(() => {
      navigate('/planner');
      setIsButtonLoading(false);
    }, 800);
  };

  const handleQuickAccessClick = (filter: string) => {
    setActiveFilter(filter === activeFilter ? null : filter);
  };

  const handlePlaceClick = (id: string) => {
    // Show toast for better UX
    toast({
      title: "Opening details",
      description: "Loading place information...",
      duration: 1500,
    });
    navigate(`/places/${id}`);
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
    // In a real app, this would open the sponsored content or track the click
    toast({
      title: "Opening sponsored content",
      description: "You clicked on a sponsored item",
      duration: 1500,
    });
    window.open('https://example.com/sponsored', '_blank');
  };

  const handleLocationClick = () => {
    // Toggle between different locations for demo purposes
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
          
          <Carousel className="w-full">
            <CarouselContent>
              {TRENDING_PLACES.map((place) => (
                <CarouselItem key={place.id} className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <FeaturedPlaceCard place={place} onClick={() => handlePlaceClick(place.id)} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={`hidden sm:flex left-1 ${darkMode ? "bg-black/40 text-white" : "bg-white/40 text-black"}`} />
            <CarouselNext className={`hidden sm:flex right-1 ${darkMode ? "bg-black/40 text-white" : "bg-white/40 text-black"}`} />
          </Carousel>
        </section>
        
        {/* Quick Access Buttons - Moved up for better UX */}
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
          
          <div className="space-y-4">
            {filteredOutings.slice(0, 4).map((outing) => (
              <OutingCard 
                key={outing.id} 
                outing={outing}
                onClick={() => handlePlaceClick(outing.id)} 
              />
            ))}
          </div>
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
                style={{ backgroundImage: `url('/lovable-uploads/b752b4f7-2a81-4715-a676-9c7bd1f9c93c.png')` }}
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
          
          <div className="space-y-4">
            {COMMUNITY_PICKS.map((pick) => (
              <OutingCard 
                key={pick.id} 
                outing={pick} 
                showCommunityBadge
                onClick={() => handlePlaceClick(pick.id)}
              />
            ))}
          </div>
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
