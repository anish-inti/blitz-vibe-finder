import React from 'react';
import { User, MapPin, Heart, Zap, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLocationContext } from '@/contexts/LocationContext';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const locationContext = useLocationContext();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Get location status indicator color
  const getLocationStatusColor = () => {
    switch (locationContext.status) {
      case 'granted':
        return 'bg-green-500';
      case 'requesting':
        return 'bg-yellow-500 animate-pulse';
      case 'denied':
        return 'bg-orange-500';
      case 'error':
      case 'unavailable':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };
  
  const navItems = [
    { path: '/', icon: Zap, label: 'Home' },
    { path: '/planner', icon: MapPin, label: 'Plan' },
    { path: '/add', icon: Plus, label: 'Add' },
    { path: '/favorites', icon: Heart, label: 'Saved' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glassmorphism-strong border-t border-white/5">
      <div className="flex items-center justify-around px-6 py-3">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link 
            key={path}
            to={path} 
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 interactive group ${
              isActive(path) 
                ? 'text-blitz-primary bg-blitz-primary/10' 
                : 'text-muted-foreground hover:text-blitz-primary hover:bg-blitz-primary/5'
            }`}
            aria-label={label}
          >
            <div className="relative">
              <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive(path) ? 'scale-110' : 'group-hover:scale-105'}`} />
              {path === '/planner' && (
                <div 
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getLocationStatusColor()}`}
                />
              )}
              {isActive(path) && (
                <div className="absolute inset-0 bg-blitz-primary/20 rounded-full animate-pulse-glow" />
              )}
            </div>
            <span className={`text-xs mt-1 font-semibold transition-all duration-300 ${
              isActive(path) ? 'text-blitz-primary' : 'group-hover:text-blitz-primary'
            }`}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;