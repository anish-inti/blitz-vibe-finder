import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Zap, MapPin, Loader2, Users, Coffee, Moon, ShoppingBag, Camera, Play, Crown, TrendingUp, Heart, Star, MessageCircle, Share2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { toast } from "@/components/ui/use-toast";
import FeaturedPlaceCard from '@/components/FeaturedPlaceCard';
import OutingCard from '@/components/OutingCard';
import QuickAccessButton from '@/components/QuickAccessButton';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/Auth/AuthModal';

const QUICK_ACCESS = [
  { id: '1', name: 'Dining', icon: <Coffee className="w-5 h-5" />, color: 'bg-orange-500' },
  { id: '2', name: 'Nightlife', icon: <Moon className="w-5 h-5" />, color: 'bg-purple-600' },
  { id: '3', name: 'Groups', icon: <Users className="w-5 h-5" />, color: 'bg-blue-500' },
  { id: '4', name: 'Shopping', icon: <ShoppingBag className="w-5 h-5" />, color: 'bg-green-500' },
  { id: '5', name: 'Culture', icon: <Camera className="w-5 h-5" />, color: 'bg-pink-500' },
  { id: '6', name: 'Premium', icon: <Crown className="w-5 h-5" />, color: 'bg-yellow-500' },
];

const COMMUNITY_STATS = [
  { label: 'Active Users', value: '12.5K', icon: Users, color: 'text-blue-600' },
  { label: 'Places Shared', value: '3.2K', icon: MapPin, color: 'text-green-600' },
  { label: 'Reviews Today', value: '847', icon: MessageCircle, color: 'text-purple-600' },
];

// Mock data for demonstration
const MOCK_TRENDING_PLACES = [
  {
    id: '1',
    name: 'Marina Beach',
    description: 'Famous beach in Chennai perfect for evening walks',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
  },
  {
    id: '2',
    name: 'Phoenix MarketCity',
    description: 'Popular shopping and entertainment destination',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
  },
  {
    id: '3',
    name: 'Express Avenue',
    description: 'Modern shopping mall with restaurants and entertainment',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
  },
];

const MOCK_COMMUNITY_PICKS = [
  {
    id: '1',
    name: 'Kapaleeshwarar Temple',
    address: 'Mylapore, Chennai',
    average_rating: 4.6,
    like_count: 120,
    images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop'],
  },
  {
    id: '2',
    name: 'Cafe Coffee Day',
    address: 'T. Nagar, Chennai',
    average_rating: 4.0,
    like_count: 85,
    images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop'],
  },
];

const MOCK_CURATED_OUTINGS = [
  {
    id: '1',
    name: 'VM Food Street',
    category: 'Street Food',
    average_rating: 4.5,
    review_count: 234,
    tags: ['Budget', 'Outdoor', 'Group-friendly'],
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
  },
  {
    id: '2',
    name: 'Marina Bay Lounge',
    category: 'Rooftop Bar',
    average_rating: 4.8,
    review_count: 156,
    tags: ['Premium', 'Aesthetic', 'Evening'],
    images: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop'],
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { profile } = useAuth();
  
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Chennai");
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Using mock data instead of API calls
  const [hotNowPlaces, setHotNowPlaces] = useState(MOCK_TRENDING_PLACES);
  const [curatedOutings, setCuratedOutings] = useState(MOCK_CURATED_OUTINGS);
  const [communityPicks, setCommunityPicks] = useState(MOCK_COMMUNITY_PICKS);
  const [isLoadingHotNow, setIsLoadingHotNow] = useState(false);
  const [isLoadingCurated, setIsLoadingCurated] = useState(false);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);

  const handleStartBlitz = () => {
    if (!profile) {
      setShowAuthModal(true);
      return;
    }
    
    setIsButtonLoading(true);
    setTimeout(() => {
      navigate('/planner');
      setIsButtonLoading(false);
    }, 600);
  };

  const handleQuickAccessClick = (filter: string) => {
    const newFilter = filter === activeFilter ? null : filter;
    setActiveFilter(newFilter);
    
    // Filter the mock data based on the selected filter
    if (newFilter) {
      const filteredOutings = MOCK_CURATED_OUTINGS.filter(
        place => place.category.toLowerCase().includes(newFilter.toLowerCase())
      );
      setCuratedOutings(filteredOutings.length > 0 ? filteredOutings : MOCK_CURATED_OUTINGS);
    } else {
      setCuratedOutings(MOCK_CURATED_OUTINGS);
    }
    
    toast({
      title: `${filter} mode activated`,
      description: `Finding the best ${filter.toLowerCase()} spots for you...`,
    });
  };

  const handlePlaceClick = (place: any) => {
    console.log('Navigating to place:', place.id);
    navigate(`/places/${place.id}`);
  };

  const handleLocationClick = () => {
    const locations = ["Chennai", "Bengaluru", "Mumbai", "Delhi"];
    const currentIndex = locations.indexOf(selectedLocation);
    const nextLocation = locations[(currentIndex + 1) % locations.length];
    setSelectedLocation(nextLocation);
    
    toast({
      title: `Welcome to ${nextLocation}`,
      description: "Discovering amazing places in your new city...",
    });
  };

  // Convert Place to OutingCard format
  const convertPlaceToOuting = (place: any) => ({
    id: place.id,
    name: place.name,
    type: place.category || 'Place',
    rating: place.average_rating || 4.0,
    reviews: place.review_count || 0,
    tags: place.tags || [],
    image: place.images?.[0] || place.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    category: place.category,
    openStatus: 'Open' as const,
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative pb-24 space-y-8">
        {/* Location Selector with better contrast */}
        <div className="px-6 pt-4">
          <button 
            onClick={handleLocationClick}
            className="flex items-center text-muted-foreground hover:text-primary transition-all duration-300 interactive group border-2 border-transparent hover:border-primary/20 rounded-lg px-3 py-2"
          >
            <MapPin className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold">{selectedLocation}</span>
          </button>
        </div>
        
        {/* Hero Section - High Contrast */}
        <section className="px-6 space-y-6">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-hero">
              Discover <span className="text-primary">Together</span>
            </h1>
            <p className="text-body text-muted-foreground max-w-md leading-relaxed">
              Join thousands exploring {selectedLocation}'s best spots. Your community-driven discovery starts here.
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
                  Preparing your experience...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Exploring
                </>
              )}
            </div>
          </button>
        </section>

        {/* Community Stats with better contrast */}
        <section className="px-6 animate-slide-up">
          <div className="card-spotify rounded-2xl p-6">
            <h3 className="text-headline mb-4 flex items-center text-foreground">
              <Users className="w-5 h-5 mr-2 text-community" />
              Community Activity
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {COMMUNITY_STATS.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Quick Access with better contrast */}
        <section className="space-y-4 animate-slide-up">
          <div className="px-6">
            <h2 className="text-headline flex items-center text-foreground">
              Explore Categories
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
                  color={item.color}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* What's Hot Now */}
        <section className="space-y-4 animate-fade-in">
          <div className="px-6 flex items-center justify-between">
            <h2 className="text-headline flex items-center text-foreground">
              Trending Now
              <span className="ml-2 badge-trending">
                HOT
              </span>
            </h2>
          </div>
          
          {isLoadingHotNow ? (
            <div className="flex items-center justify-center h-48">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-caption text-muted-foreground">Discovering trending spots...</p>
              </div>
            </div>
          ) : hotNowPlaces.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent className="ml-6">
                {hotNowPlaces.map((place, index) => (
                  <CarouselItem key={place.id} className="basis-4/5 pr-4">
                    <div className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <FeaturedPlaceCard 
                        place={{
                          id: place.id,
                          name: place.name,
                          description: place.description || `${place.category} in ${selectedLocation}`,
                          image: place.images?.[0] || place.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
                        }} 
                        onClick={() => handlePlaceClick(place)} 
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <div className="px-6">
              <div className="card-spotify rounded-2xl p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No trending places yet. Be the first to add some!</p>
              </div>
            </div>
          )}
        </section>
        
        {/* Community Picks with better contrast */}
        <section className="space-y-4 animate-fade-in">
          <div className="px-6">
            <h2 className="text-headline flex items-center text-foreground">
              Community Favorites
              <span className="ml-2 badge-community">
                COMMUNITY
              </span>
            </h2>
          </div>
          
          {isLoadingCommunity ? (
            <div className="px-6 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-muted/30 rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : communityPicks.length > 0 ? (
            <div className="px-6 space-y-3">
              {communityPicks.map((place, index) => (
                <div key={place.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="card-community rounded-2xl p-4 cursor-pointer" onClick={() => handlePlaceClick(place)}>
                    <div className="flex items-center space-x-4">
                      <img 
                        src={place.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'} 
                        alt={place.name} 
                        className="w-12 h-12 rounded-xl object-cover border-2 border-border" 
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground line-clamp-1">{place.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground font-semibold">{place.address}</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-bold text-foreground">{place.average_rating || 4.0}</span>
                          </div>
                          <span className="text-muted-foreground">•</span>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3 text-red-500" />
                            <span className="text-xs font-bold text-foreground">{place.like_count || 0}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 rounded-full hover:bg-background/50 transition-colors border-2 border-transparent hover:border-primary/20">
                        <Share2 className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6">
              <div className="card-spotify rounded-2xl p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No community favorites yet. Start exploring and rating places!</p>
              </div>
            </div>
          )}
        </section>
        
        {/* Curated For You with better contrast */}
        <section className="space-y-4 animate-slide-up">
          <div className="px-6">
            <h2 className="text-headline flex items-center text-foreground">
              {activeFilter ? (
                <>
                  <span className="text-primary">{activeFilter}</span>
                  <span className="ml-2">Collection</span>
                </>
              ) : (
                'Curated for You'
              )}
              <TrendingUp className="w-5 h-5 ml-2 text-accent" />
            </h2>
          </div>
          
          {isLoadingCurated ? (
            <div className="px-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted/30 rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : curatedOutings.length > 0 ? (
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
          ) : (
            <div className="px-6">
              <div className="card-spotify rounded-2xl p-6 text-center">
                <Coffee className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {activeFilter 
                    ? `No ${activeFilter.toLowerCase()} places found. Try a different category!`
                    : 'No places found. Start by adding some amazing spots!'
                  }
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Community Call to Action with better contrast */}
        <section className="px-6 py-8 animate-bounce-in">
          <div className="card-community rounded-2xl p-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--blitz-community))] text-white mb-4 border-2 border-white/20">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-title text-community">Join the Community</h3>
            <p className="text-caption text-muted-foreground">
              Share your discoveries and help others find amazing places
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate('/add')}
                className="flex-1 btn-secondary rounded-xl px-6 py-3 font-semibold interactive-secondary"
              >
                Add a Place
              </button>
              <button 
                onClick={() => navigate('/swipe')}
                className="flex-1 btn-primary rounded-xl px-6 py-3 font-semibold interactive-primary"
              >
                Start Exploring
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <BottomNavigation />
      
      {/* Auth Modal */}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Home;