
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
    <div className="min-h-screen flex flex-col relative bg-blitz-black">
      <div className="cosmic-bg absolute inset-0 z-0"></div>
      
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
      
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-4 text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blitz-neonred via-blitz-pink to-blitz-purple bg-clip-text text-transparent relative inline-block neon-text">
              Blitz
              <Sparkles className="absolute -right-8 top-2 w-6 h-6 text-blitz-stardust animate-pulse-glow" />
            </h1>
            <p className="text-xl text-gray-300">Your perfect outing, planned in a flash</p>
          </div>
          
          <div className="animate-fade-in delay-100">
            <div className="mb-8 glassmorphism rounded-2xl overflow-hidden border border-blitz-pink/20">
              <img 
                src="/lovable-uploads/338fb7a8-90b8-400c-a1a7-b1f2af04f5bf.png" 
                alt="Blitz Experience" 
                className="w-full h-64 object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-white mb-2">Find your next adventure</h2>
                <p className="text-gray-300">Discover, swipe, and plan the perfect outing based on your vibe.</p>
              </div>
            </div>
            
            <button 
              onClick={handleStartBlitz}
              className="px-10 py-4 bg-gradient-to-r from-blitz-neonred to-blitz-pink text-white text-lg font-semibold rounded-full shadow-lg shadow-blitz-neonred/30 hover:shadow-blitz-neonred/50 transition-all hover:scale-105 animate-pulse-glow"
            >
              <span className="flex items-center justify-center">
                Start Blitzing
                <Zap className="ml-2 w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
