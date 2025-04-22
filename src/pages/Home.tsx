
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Flame, Zap, Moon, Users, Compass, Coffee, Home as HomeIcon, Umbrella, Heart } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import FeaturedPlaceCard from '@/components/FeaturedPlaceCard';
import OutingCard from '@/components/OutingCard';
import QuickAccessButton from '@/components/QuickAccessButton';

const TRENDING_PLACES = [
  {
    id: '1',
    name: 'Luna Sky Lounge',
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
  },
  {
    id: '2',
    name: 'Mountain View Resort',
    type: 'Staycation',
    rating: 4.7,
    reviews: 286,
    tags: ['Mountain', 'Luxury', 'Spa'],
    image: '/lovable-uploads/02972e2d-092f-4952-88c5-fcf4ee6acc82.png',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: string; size: string }[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
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
  
  const handleStartBlitz = () => {
    navigate('/planner');
  };

  const handleQuickAccessClick = (filter: string) => {
    setActiveFilter(filter === activeFilter ? null : filter);
    // In a real app, this would filter the curated outings based on the selection
  };
  
  return (
    <div className="min-h-screen flex flex-col relative bg-[#121212] overflow-x-hidden">
      <div className="bg-gradient-to-b from-[#121212] to-[#1F1F1F] absolute inset-0 z-0"></div>
      
      {/* Animated stars - more subtle */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="cosmic-star animate-sparkle absolute opacity-60"
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
        {/* What's Hot Now Section */}
        <section className="mt-6 mb-8 animate-fade-in">
          <div className="flex items-center mb-4 px-2">
            <Flame className="text-blitz-pink mr-2 w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">What's Hot Now</h2>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {TRENDING_PLACES.map((place) => (
                <CarouselItem key={place.id} className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <FeaturedPlaceCard place={place} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex left-1 bg-black/40 border-none text-white hover:bg-black/60" />
            <CarouselNext className="hidden sm:flex right-1 bg-black/40 border-none text-white hover:bg-black/60" />
          </Carousel>
        </section>
        
        {/* Curated Outings Feed */}
        <section className="mb-8 animate-fade-in delay-100">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-lg font-semibold text-white">Curated For You</h2>
            <button 
              onClick={() => navigate('/search')} 
              className="text-sm text-blitz-pink"
            >
              See All
            </button>
          </div>
          
          <div className="space-y-4">
            {CURATED_OUTINGS.map((outing) => (
              <OutingCard key={outing.id} outing={outing} />
            ))}
          </div>
        </section>
        
        {/* Sponsored Banner */}
        <section className="mb-8 animate-fade-in delay-200">
          <div className="w-full rounded-2xl overflow-hidden glassmorphism border border-white/10 p-4">
            <div className="text-xs text-blitz-lightgray mb-2">Sponsored</div>
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1">Food Truck Festival</h3>
                <p className="text-sm text-blitz-lightgray">Discover 20+ food trucks this weekend near you!</p>
                <button className="mt-3 px-4 py-2 bg-blitz-pink rounded-full text-sm text-white">
                  Learn More
                </button>
              </div>
              <div className="w-24 h-24 bg-blitz-gray rounded-lg ml-4"></div>
            </div>
          </div>
        </section>
        
        {/* Quick Access Buttons */}
        <section className="mb-8 animate-fade-in delay-300">
          <div className="flex items-center mb-4 px-2">
            <Zap className="text-blitz-pink mr-2 w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">Quick Access</h2>
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
        
        {/* Community Picks */}
        <section className="mb-8 animate-fade-in delay-400">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-lg font-semibold text-white">Community Picks</h2>
            <button className="text-sm text-blitz-pink">See All</button>
          </div>
          
          <div className="space-y-4">
            {COMMUNITY_PICKS.map((pick) => (
              <OutingCard key={pick.id} outing={pick} showCommunityBadge />
            ))}
          </div>
        </section>
        
        {/* Start Planning Button */}
        <section className="mt-auto mb-8 text-center animate-fade-in delay-500">
          <button 
            onClick={handleStartBlitz}
            className="w-full max-w-xs mx-auto px-10 py-3.5 bg-[#1F1F1F] text-white text-base font-medium rounded-full shadow-sm hover:bg-[#2A2A2A] active:scale-[0.98] transition-all duration-200 group"
          >
            <span className="flex items-center justify-center">
              Start Blitzing
              <Zap className="ml-2 w-4 h-4 text-blitz-pink opacity-90" />
            </span>
          </button>
        </section>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
