import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Sparkles, Loader2, TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { usePlaces } from '@/hooks/use-places';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PlaceCard from '@/components/Places/PlaceCard';

const Search: React.FC = () => {
  const { darkMode } = useTheme();
  const { getPlaces } = usePlaces();
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = async (input: string) => {
    setPrompt(input);
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const { data, error } = await getPlaces({ 
        search: input,
        limit: 20 
      });
      
      if (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Search exception:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
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
            <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-blitz-stardust animate-pulse-glow" />
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
                      <div key={place.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <PlaceCard
                          place={place}
                          onClick={() => handlePlaceClick(place)}
                        />
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