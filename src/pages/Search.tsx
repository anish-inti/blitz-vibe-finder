import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Sparkles, Loader2, TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

const Search: React.FC = () => {
  const { darkMode } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = async (input: string) => {
    setPrompt(input);
    setIsSearching(true);
    setHasSearched(true);
    
    // Simple client-side filtering based on the prompt
    setTimeout(() => {
      const searchTerms = input.toLowerCase().split(' ');
      const filteredPlaces = MOCK_PLACES.filter(place => {
        const searchableText = `${place.name} ${place.category} ${place.description} ${place.tags.join(' ')}`.toLowerCase();
        return searchTerms.some(term => searchableText.includes(term));
      });
      
      setSearchResults(filteredPlaces);
      setIsSearching(false);
    }, 1000);
  };
  
  const handlePlaceClick = (place: any) => {
    window.location.href = `/places/${place.id}`;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 flex flex-col px-6 pb-20 pt-8">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center text-foreground relative">
            Find Your Vibe
            <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-primary animate-pulse-glow" />
          </h1>
          
          <div className="mb-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., 6 of us want rooftop vibes under ₹500"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(prompt)}
                className="flex-1"
              />
              <Button 
                onClick={() => handleSearch(prompt)}
                disabled={!prompt.trim() || isSearching}
                className="btn-primary"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </Button>
            </div>
          </div>
          
          {isSearching && (
            <div className="mt-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Searching for places...</p>
            </div>
          )}
          
          {!isSearching && hasSearched && (
            <div className="mt-8">
              {searchResults.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Found {searchResults.length} places
                    </h2>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-4">
                    {searchResults.map((place, index) => (
                      <div 
                        key={place.id} 
                        className="card-elevated rounded-2xl overflow-hidden cursor-pointer interactive group animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handlePlaceClick(place)}
                      >
                        <div className="flex">
                          <div 
                            className="w-24 h-24 flex-shrink-0 bg-cover bg-center relative overflow-hidden"
                            style={{ backgroundImage: `url(${place.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'})` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          
                          <div className="flex-1 p-4 min-w-0">
                            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors text-foreground">
                              {place.name}
                            </h3>
                            
                            <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-2 font-semibold">
                              <span>{place.category}</span>
                              <span>•</span>
                              <div className="flex items-center">
                                <TrendingUp className="h-3 w-3 text-primary mr-1" />
                                <span className="font-bold text-foreground">{place.average_rating.toFixed(1)}</span>
                              </div>
                            </div>
                            
                            {place.tags && place.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {place.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                                  <span 
                                    key={tagIndex}
                                    className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-12 text-center">
                  <div className="card-spotify rounded-2xl p-8">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-foreground mb-4">
                      No places found for "{prompt}"
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try a different search or check your spelling
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!hasSearched && (
            <div className="mt-6">
              <div className="text-sm mb-2 text-muted-foreground">Popular searches:</div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleSearch("Rooftop bars in Chennai")}
                  className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm hover:bg-primary/30 transition-colors border border-primary/30"
                >
                  Rooftop bars
                </button>
                <button 
                  onClick={() => handleSearch("Late night food in Chennai")}
                  className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm hover:bg-secondary/30 transition-colors border border-secondary/30"
                >
                  Late night food
                </button>
                <button 
                  onClick={() => handleSearch("Live music venues in Chennai")}
                  className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm hover:bg-accent/30 transition-colors border border-accent/30"
                >
                  Live music venues
                </button>
                <button 
                  onClick={() => handleSearch("Outdoor cafés in Chennai")}
                  className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm hover:bg-primary/30 transition-colors border border-primary/30"
                >
                  Outdoor cafés
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Search;