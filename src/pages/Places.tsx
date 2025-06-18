import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Sparkles, Filter, TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock data for demonstration
const MOCK_PLACES = [
  {
    id: '1',
    name: 'Marina Beach',
    address: 'Marina Beach Rd, Chennai',
    category: 'Beach',
    description: 'Famous beach in Chennai perfect for evening walks',
    tags: ['Outdoor', 'Scenic', 'Family-friendly'],
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'],
    average_rating: 4.2,
    review_count: 1250,
    like_count: 350,
    save_count: 180,
    visit_count: 420,
    share_count: 95,
    is_verified: true
  },
  {
    id: '2',
    name: 'Phoenix MarketCity',
    address: 'Velachery, Chennai',
    category: 'Shopping Mall',
    description: 'Popular shopping and entertainment destination',
    tags: ['Shopping', 'Entertainment', 'Food'],
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'],
    average_rating: 4.4,
    review_count: 890,
    like_count: 210,
    save_count: 150,
    visit_count: 380,
    share_count: 75,
    is_verified: true
  },
  {
    id: '3',
    name: 'Kapaleeshwarar Temple',
    address: 'Mylapore, Chennai',
    category: 'Temple',
    description: 'Historic temple with beautiful architecture',
    tags: ['Historic', 'Cultural', 'Spiritual'],
    images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop'],
    average_rating: 4.6,
    review_count: 2100,
    like_count: 420,
    save_count: 280,
    visit_count: 560,
    share_count: 130,
    is_verified: true
  },
  {
    id: '4',
    name: 'Cafe Coffee Day',
    address: 'T. Nagar, Chennai',
    category: 'Cafe',
    description: 'Cozy cafe perfect for hanging out with friends',
    tags: ['Coffee', 'Casual', 'Work-friendly'],
    images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop'],
    average_rating: 4.0,
    review_count: 456,
    like_count: 180,
    save_count: 120,
    visit_count: 320,
    share_count: 65,
    is_verified: false
  },
  {
    id: '5',
    name: 'Express Avenue',
    address: 'Royapettah, Chennai',
    category: 'Shopping Mall',
    description: 'Modern shopping mall with restaurants and entertainment',
    tags: ['Shopping', 'Entertainment', 'Food'],
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    average_rating: 4.3,
    review_count: 678,
    like_count: 195,
    save_count: 140,
    visit_count: 350,
    share_count: 85,
    is_verified: true
  }
];

const Places: React.FC = () => {
  const { darkMode } = useTheme();
  const [places, setPlaces] = useState<any[]>(MOCK_PLACES);
  const [isLoading, setIsLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);
  
  const handlePromptSearch = () => {
    if (!userPrompt.trim()) return;
    
    setIsLoading(true);
    
    // Simple client-side filtering based on the prompt
    setTimeout(() => {
      const searchTerms = userPrompt.toLowerCase().split(' ');
      const filteredPlaces = MOCK_PLACES.filter(place => {
        const searchableText = `${place.name} ${place.category} ${place.description} ${place.tags.join(' ')}`.toLowerCase();
        return searchTerms.some(term => searchableText.includes(term));
      });
      
      setPlaces(filteredPlaces);
      
      if (filteredPlaces.length === 0) {
        toast({
          title: "No matches found",
          description: "Try a different search criteria.",
        });
      } else {
        toast({
          title: "Places found",
          description: `Found ${filteredPlaces.length} places matching your criteria.`,
        });
      }
      
      setIsLoading(false);
      setShowPromptInput(false);
    }, 1000);
  };
  
  const handlePlaceClick = (place: any) => {
    window.location.href = `/places/${place.id}`;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header title="Discover Places" />
      
      <main className="flex-1 px-6 pb-24 pt-8">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-foreground relative">
              Discover Places
              <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-primary animate-pulse-glow" />
            </h1>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
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
                  className="bg-background border-border text-foreground"
                />
                <Button 
                  onClick={handlePromptSearch}
                  size="sm"
                  className="whitespace-nowrap btn-primary"
                >
                  Search
                </Button>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-primary/20 border-t-primary animate-spin mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading places...</p>
            </div>
          ) : places.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Found {places.length} places
                </p>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              
              <div className="grid gap-4">
                {places.map((place, index) => (
                  <div 
                    key={place.id} 
                    className="card-elevated rounded-2xl overflow-hidden cursor-pointer interactive group animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handlePlaceClick(place)}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={place.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'} 
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop';
                        }}
                      />
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="badge-community">
                          {place.category}
                        </span>
                      </div>

                      {/* Verification badge */}
                      {place.is_verified && (
                        <div className="absolute bottom-4 left-4">
                          <span className="badge-featured">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-title text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {place.name}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="line-clamp-1">{place.address}</span>
                        </div>
                      </div>

                      {place.description && (
                        <p className="text-caption text-muted-foreground line-clamp-2">
                          {place.description}
                        </p>
                      )}

                      {/* Tags */}
                      {place.tags && place.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {place.tags.slice(0, 3).map((tag: string, index: number) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold"
                            >
                              {tag}
                            </span>
                          ))}
                          {place.tags.length > 3 && (
                            <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold">
                              +{place.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Rating and stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {place.average_rating > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-bold text-foreground">{place.average_rating.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground">({place.review_count})</span>
                            </div>
                          )}
                          
                          {place.price_level && (
                            <div className="text-sm font-bold text-foreground">
                              {'$'.repeat(place.price_level)}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span className="font-semibold">{place.like_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="card-spotify rounded-2xl p-8">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-title mb-2">No places found</h3>
                <p className="text-caption text-muted-foreground mb-6">
                  Try a different search or explore our categories
                </p>
                <Button 
                  onClick={() => setPlaces(MOCK_PLACES)}
                  className="btn-primary rounded-xl px-6 py-3 font-semibold"
                >
                  Refresh Places
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Places;