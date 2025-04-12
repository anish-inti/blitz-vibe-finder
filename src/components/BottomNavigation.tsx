
import React from 'react';
import { User, Search, MapPin, Heart, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 glassmorphism backdrop-blur-lg rounded-full px-6 py-3 flex justify-around items-center z-20 shadow-xl shadow-blitz-pink/20 w-11/12 max-w-sm border border-blitz-pink/20">
      <Link 
        to="/" 
        className={`p-2 flex flex-col items-center transition-all duration-300 ${
          isActive('/') 
            ? 'text-blitz-neonred scale-110 neon-red-text' 
            : 'text-gray-300 hover:text-blitz-neonred/70'
        }`}
      >
        <Zap className={`w-6 h-6 ${isActive('/') ? 'animate-pulse-glow' : ''}`} />
      </Link>
      
      <Link 
        to="/planner" 
        className={`p-2 flex flex-col items-center transition-all duration-300 ${
          isActive('/planner') 
            ? 'text-blitz-blue scale-110 neon-text' 
            : 'text-gray-300 hover:text-blitz-blue/70'
        }`}
      >
        <MapPin className={`w-6 h-6 ${isActive('/planner') ? 'animate-pulse-glow' : ''}`} />
      </Link>
      
      <Link 
        to="/favorites" 
        className={`p-2 flex flex-col items-center transition-all duration-300 ${
          isActive('/favorites') 
            ? 'text-blitz-pink scale-110 neon-text' 
            : 'text-gray-300 hover:text-blitz-pink/70'
        }`}
      >
        <Heart className={`w-6 h-6 ${isActive('/favorites') ? 'animate-pulse-glow' : ''}`} />
      </Link>
      
      <Link 
        to="/profile" 
        className={`p-2 flex flex-col items-center transition-all duration-300 ${
          isActive('/profile') 
            ? 'text-blitz-purple scale-110 neon-text' 
            : 'text-gray-300 hover:text-blitz-purple/70'
        }`}
      >
        <User className={`w-6 h-6 ${isActive('/profile') ? 'animate-pulse-glow' : ''}`} />
      </Link>
    </nav>
  );
};

export default BottomNavigation;
