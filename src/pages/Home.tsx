
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Sparkles, Rocket, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: string; size: string }[]>([]);
  
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
  
  return (
    <div className="min-h-screen flex flex-col relative bg-[#121212]">
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
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-4 text-center">
          <div className="mb-10 animate-fade-in">
            <h1 className="text-3xl font-semibold mb-2 text-white relative inline-block">
              Plan Your Vibe
            </h1>
            <p className="text-lg text-gray-400">Your perfect outing, designed in a flash</p>
          </div>
          
          <div className="animate-fade-in delay-100">
            <div className="mb-8 glassmorphism rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="flex flex-col items-center justify-center py-16 px-8">
                <img 
                  src="/lovable-uploads/8c93f489-9e9c-4ba4-99c4-51175e60293f.png" 
                  alt="Blitz Logo" 
                  className="w-32 mb-6 animate-pulse-glow"
                />
                <h2 className="text-xl font-semibold text-white mb-3">Find your next adventure</h2>
                <p className="text-gray-300 mb-8">Discover, swipe, and plan the perfect outing based on your vibe.</p>
                
                <button 
                  onClick={handleStartBlitz}
                  className="w-full max-w-xs px-10 py-3.5 bg-[#1F1F1F] text-white text-base font-medium rounded-full shadow-sm hover:bg-[#2A2A2A] active:scale-[0.98] transition-all duration-200 group"
                >
                  <span className="flex items-center justify-center">
                    Start Blitzing
                    <Zap className="ml-2 w-4 h-4 text-[#ff6ec7] opacity-90" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
