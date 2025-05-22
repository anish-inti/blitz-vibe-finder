
import React from 'react';
import { User, Search, MapPin, Heart, Zap, Navigation, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLocationContext } from '@/contexts/LocationContext';
import { useTheme } from '@/contexts/ThemeContext';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const locationContext = useLocationContext();
  const { darkMode } = useTheme();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Get location status indicator color
  const getLocationStatusColor = () => {
    switch (locationContext.status) {
      case 'granted':
        return 'bg-green-400';
      case 'requesting':
        return 'bg-yellow-400 animate-pulse';
      case 'denied':
        return 'bg-orange-400';
      case 'error':
      case 'unavailable':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <nav className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-colors ${
      darkMode 
        ? "bg-blitz-gray/80" 
        : "bg-white/90 border border-gray-200"
    } backdrop-blur-xl rounded-full px-6 py-3 flex justify-around items-center z-20 shadow-lg w-10/12 max-w-sm`}>
      <Link 
        to="/" 
        className={`p-2 flex flex-col items-center transition-all duration-200 ${
          isActive('/') 
            ? 'text-blitz-pink' 
            : darkMode ? 'text-blitz-lightgray hover:text-white' : 'text-blitz-gray hover:text-blitz-black'
        }`}
      >
        <Zap className={`w-5 h-5 ${isActive('/') ? 'scale-105' : ''}`} />
      </Link>
      
      <Link 
        to="/planner" 
        className={`p-2 flex flex-col items-center transition-all duration-200 ${
          isActive('/planner') 
            ? 'text-blitz-pink' 
            : darkMode ? 'text-blitz-lightgray hover:text-white' : 'text-blitz-gray hover:text-blitz-black'
        }`}
      >
        <div className="relative">
          <MapPin className={`w-5 h-5 ${isActive('/planner') ? 'scale-105' : ''}`} />
          <div 
            className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${getLocationStatusColor()}`}
          />
        </div>
      </Link>
      
      <Link 
        to="/add" 
        className={`p-2 flex flex-col items-center transition-all duration-200 ${
          isActive('/add') 
            ? 'text-blitz-pink' 
            : darkMode ? 'text-blitz-lightgray hover:text-white' : 'text-blitz-gray hover:text-blitz-black'
        }`}
      >
        <PlusCircle className={`w-5 h-5 ${isActive('/add') ? 'scale-105' : ''}`} />
      </Link>
      
      <Link 
        to="/favorites" 
        className={`p-2 flex flex-col items-center transition-all duration-200 ${
          isActive('/favorites') 
            ? 'text-blitz-pink' 
            : darkMode ? 'text-blitz-lightgray hover:text-white' : 'text-blitz-gray hover:text-blitz-black'
        }`}
      >
        <Heart className={`w-5 h-5 ${isActive('/favorites') ? 'scale-105' : ''}`} />
      </Link>
      
      <Link 
        to="/profile" 
        className={`p-2 flex flex-col items-center transition-all duration-200 ${
          isActive('/profile') 
            ? 'text-blitz-pink' 
            : darkMode ? 'text-blitz-lightgray hover:text-white' : 'text-blitz-gray hover:text-blitz-black'
        }`}
      >
        <User className={`w-5 h-5 ${isActive('/profile') ? 'scale-105' : ''}`} />
      </Link>
    </nav>
  );
};

export default BottomNavigation;
