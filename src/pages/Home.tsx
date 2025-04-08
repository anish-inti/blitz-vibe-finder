
import React, { useState } from 'react';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import BottomNavigation from '@/components/BottomNavigation';
import GlowButton from '@/components/GlowButton';

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  
  const handlePromptSubmit = (input: string) => {
    setPrompt(input);
    // Here you would typically call an API to get suggestions
  };
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="blitz-gradient absolute inset-0 z-0 opacity-10"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 z-10">
        <div className="w-full max-w-lg mx-auto mt-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blitz-pink via-blitz-purple to-blitz-blue bg-clip-text text-transparent animate-fade-in">
            Where's the vibe?
          </h1>
          <p className="text-xl text-gray-700 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            We'll find it for you.
          </p>
          
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <PromptInput onSubmit={handlePromptSubmit} />
          </div>
          
          <div className="flex flex-col gap-4 mt-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <GlowButton>Get Suggestions</GlowButton>
            <GlowButton variant="secondary">Swipe Places</GlowButton>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
