
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import BottomNavigation from '@/components/BottomNavigation';
import GlowButton from '@/components/GlowButton';
import { Rocket, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: string; size: string }[]>([]);
  
  useEffect(() => {
    // Create random stars for the background
    const newStars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      size: `${Math.random() * 2 + 1}px`
    }));
    setStars(newStars);
  }, []);

  const handlePromptSubmit = (input: string) => {
    setPrompt(input);
    // Here you would typically call an API to get suggestions
  };
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden cosmic-bg">
      <div className="star-bg absolute inset-0 z-0"></div>
      
      {/* Animated stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="cosmic-star animate-sparkle absolute"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay
          }}
        />
      ))}
      
      {/* Gradient overlay */}
      <div className="blitz-gradient absolute inset-0 z-0 opacity-30"></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 z-10">
        <div className="w-full max-w-lg mx-auto mt-8 text-center relative">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 opacity-20 rounded-full bg-blitz-pink blur-xl animate-pulse-glow"></div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blitz-neonpink via-blitz-purple to-blitz-electricblue bg-clip-text text-transparent animate-fade-in relative">
            Where's the vibe?
            <Sparkles className="absolute -right-8 top-0 w-6 h-6 text-blitz-stardust animate-pulse-glow" />
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 animate-fade-in relative backdrop-blur-sm" style={{ animationDelay: '0.1s' }}>
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              We'll find it for you.
            </span>
          </p>
          
          <div className="animate-slide-up relative" style={{ animationDelay: '0.2s' }}>
            <PromptInput onSubmit={handlePromptSubmit} />
          </div>
          
          <div className="flex flex-col gap-4 mt-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <GlowButton showSparkle intensity="high">
              Get Suggestions <Sparkles className="ml-2 w-4 h-4" />
            </GlowButton>
            
            <GlowButton variant="secondary" intensity="normal">
              Swipe Places <Rocket className="ml-2 w-4 h-4" />
            </GlowButton>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
