
import React from 'react';
import { User, Search, MapPin, Heart, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blitz-gray/80 backdrop-blur-xl rounded-full px-8 py-3 flex justify-around items-center z-20 shadow-lg w-10/12 max-w-sm">
      <Link 
        to="/" 
        className={`p-2 flex flex-col items-center transition-all duration-200 ${
          isActive('/') 
            ? 'text-blitz-pink' 
            : 'text-blitz-lightgray hover:text-white'
        }`}
      >
        <Zap className={`w-5 h-5 ${isActive('/') ? 'scale-105' : ''}`} />
      </Link>
      
      <Link 
        to="/planner" 
        className={`p-2 flex flex-col items-center transition-all duration-200 ${
          isActive('/planner') 
            ? 'text-blitz-pink' 
            : 'text-blitz-lightgray hover:text-white'
        }`}
      >
        <MapPin className={`w-5 h-5 ${isActive('/planner') ? 'scale-105' : ''}`} />
      </Link>
      
      <Link 
        to="/favorites" 
        className={`p-2 flex flex-col items-center transition-all duration-200 ${
          isActive('/favorites') 
            ? 'text-blitz-pink' 
            : 'text-blitz-lightgray hover:text-white'
        }`}
      >
        <Heart className={`w-5 h-5 ${isActive('/favorites') ? 'scale-105' : ''}`} />
      </Link>
      
      <Link 
        to="/profile" 
        className={`p-2 flex flex-col items-center transition-all duration-200 ${
          isActive('/profile') 
            ? 'text-blitz-pink' 
            : 'text-blitz-lightgray hover:text-white'
        }`}
      >
        <User className={`w-5 h-5 ${isActive('/profile') ? 'scale-105' : ''}`} />
      </Link>
    </nav>
  );
};

export default BottomNavigation;
