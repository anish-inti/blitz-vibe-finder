import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import PromptInput from '@/components/PromptInput';
import GlowButton from '@/components/GlowButton';
import OutingCard from '@/components/OutingCard';
import { Sparkles, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { getBlitzRecommendations } from '@/services/googlePlacesService';
import { Place } from '@/components/SwipeCard';

const Search: React.FC = () => {
  const { darkMode } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = async (input: string) => {
    setPrompt(input);
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const results = await getBlitzRecommendations(input);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handlePlaceClick = (place: Place) => {
    // Navigate to place details or add to favorites
    console.log('Place clicked:', place);
  };
  
  return (
    <div className={`min-h-screen flex flex-col relative transition-all duration-300 ${darkMode ? "bg-blitz-black" : "bg-blitz-offwhite"}`}>
      <div className={`cosmic-bg absolute inset-0 z-0 ${darkMode ? "opacity-100" : "opacity-20"}`}></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-8">
          <h1 className={`text-2xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-blitz-black"} neon-text relative`}>
            Find Your Vibe
            <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-blitz-stardust animate-pulse-glow" />
          </h1>
          
          <PromptInput 
            onSubmit={handleSearch} 
            placeholder="e.g., 6 of us want rooftop vibes under ₹500"
          />
          
          {isSearching && (
            <div className="mt-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blitz-pink mb-4" />
              <p className="text-sm text-gray-400">Searching for places...</p>
            </div>
          )}
          
          {!isSearching && hasSearched && (
            <div className="mt-8">
              {searchResults.length > 0 ? (
                <>
                  <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-blitz-black"}`}>
                    Found {searchResults.length} places
                  </h2>
                  <div className="space-y-4">
                    {searchResults.map((place) => (
                      <OutingCard
                        key={place.id}
                        outing={{
                          id: place.id,
                          name: place.name,
                          type: place.category || 'Place',
                          rating: place.rating || 4.0,
                          reviews: place.reviewCount || 0,
                          tags: place.tags || [],
                          image: place.image,
                          openStatus: place.isOpen ? 'Open' : 'Closed' as const,
                        }}
                        onClick={() => handlePlaceClick(place)}
                      />
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <GlowButton 
                      className="px-8 py-3" 
                      color="pink" 
                      showSparkle
                      onClick={() => {
                        // Navigate to swipe mode with these results
                        console.log('Navigate to swipe with results:', searchResults);
                      }}
                    >
                      Swipe Through Results
                    </GlowButton>
                  </div>
                </>
              ) : (
                <div className="mt-12 text-center">
                  <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                    No places found for "{prompt}"
                  </p>
                  <p className="text-sm text-gray-500">
                    Try a different search or check your internet connection
                  </p>
                </div>
              )}
            </div>
          )}
          
          {!hasSearched && (
            <div className="mt-6">
              <div className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Popular searches:</div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleSearch("Rooftop bars in Chennai")}
                  className="px-3 py-1 bg-blitz-purple/20 text-blitz-purple rounded-full text-sm hover:bg-blitz-purple/30 transition-colors border border-blitz-purple/30"
                >
                  Rooftop bars
                </button>
                <button 
                  onClick={() => handleSearch("Late night food in Chennai")}
                  className="px-3 py-1 bg-blitz-blue/20 text-blitz-blue rounded-full text-sm hover:bg-blitz-blue/30 transition-colors border border-blitz-blue/30"
                >
                  Late night food
                </button>
                <button 
                  onClick={() => handleSearch("Live music venues in Chennai")}
                  className="px-3 py-1 bg-blitz-pink/20 text-blitz-pink rounded-full text-sm hover:bg-blitz-pink/30 transition-colors border border-blitz-pink/30"
                >
                  Live music venues
                </button>
                <button 
                  onClick={() => handleSearch("Outdoor cafés in Chennai")}
                  className="px-3 py-1 bg-blitz-neonred/20 text-blitz-neonred rounded-full text-sm hover:bg-blitz-neonred/30 transition-colors border border-blitz-neonred/30"
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