
import React, { useState } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import PromptInput from '@/components/PromptInput';
import GlowButton from '@/components/GlowButton';

const Search: React.FC = () => {
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
    <div className="min-h-screen flex flex-col relative">
      <div className="blitz-gradient absolute inset-0 z-0 opacity-10"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Find Your Vibe
          </h1>
          
          <PromptInput onSubmit={handleSearch} />
          
          <div className="mt-6">
            <div className="text-sm text-gray-500 mb-2">Try asking for:</div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-blitz-purple/10 text-blitz-purple rounded-full text-sm hover:bg-blitz-purple/20 transition-colors">
                Rooftop bars
              </button>
              <button className="px-3 py-1 bg-blitz-blue/10 text-blitz-blue rounded-full text-sm hover:bg-blitz-blue/20 transition-colors">
                Late night food
              </button>
              <button className="px-3 py-1 bg-blitz-pink/10 text-blitz-pink rounded-full text-sm hover:bg-blitz-pink/20 transition-colors">
                Live music venues
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors">
                Outdoor cafés
              </button>
            </div>
          </div>
          
          {isSearching ? (
            <div className="mt-12 flex justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-blitz-purple/30 border-t-blitz-purple animate-spin"></div>
            </div>
          ) : prompt ? (
            <div className="mt-12">
              <GlowButton className="w-full">View Matches</GlowButton>
            </div>
          ) : null}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Search;
