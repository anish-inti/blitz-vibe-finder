
import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import PromptInput from '@/components/PromptInput';
import GlowButton from '@/components/GlowButton';
import { Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Search: React.FC = () => {
  const { darkMode } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (input: string) => {
    setPrompt(input);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
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
          
          <PromptInput onSubmit={handleSearch} />
          
          <div className="mt-6">
            <div className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Try asking for:</div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-blitz-purple/20 text-blitz-purple rounded-full text-sm hover:bg-blitz-purple/30 transition-colors border border-blitz-purple/30">
                Rooftop bars
              </button>
              <button className="px-3 py-1 bg-blitz-blue/20 text-blitz-blue rounded-full text-sm hover:bg-blitz-blue/30 transition-colors border border-blitz-blue/30">
                Late night food
              </button>
              <button className="px-3 py-1 bg-blitz-pink/20 text-blitz-pink rounded-full text-sm hover:bg-blitz-pink/30 transition-colors border border-blitz-pink/30">
                Live music venues
              </button>
              <button className="px-3 py-1 bg-blitz-neonred/20 text-blitz-neonred rounded-full text-sm hover:bg-blitz-neonred/30 transition-colors border border-blitz-neonred/30">
                Outdoor cafés
              </button>
            </div>
          </div>
          
          {isSearching ? (
            <div className="mt-12 flex justify-center">
              <div className={`w-12 h-12 rounded-full border-4 border-blitz-pink/30 border-t-blitz-pink animate-spin ${darkMode ? "" : "border-blitz-purple/30 border-t-blitz-purple"}`}></div>
            </div>
          ) : prompt ? (
            <div className="mt-12">
              <GlowButton className="w-full" color="red" showSparkle>
                View Matches
              </GlowButton>
            </div>
          ) : null}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Search;
