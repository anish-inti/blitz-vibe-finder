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
        return 'bg-green-500 border-white';
      case 'requesting':
        return 'bg-yellow-500 animate-pulse border-white';
      case 'denied':
        return 'bg-orange-500 border-white';
      case 'error':
      case 'unavailable':
        return 'bg-red-500 border-white';
      default:
        return 'bg-gray-400 border-white';
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 glassmorphism-strong border-t-2 border-border/30">
      <div className="flex items-center justify-around px-6 py-3">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link 
            key={path}
            to={path} 
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 interactive group border-2 ${
              isActive(path) 
                ? 'text-[hsl(var(--blitz-primary))] bg-[hsl(var(--blitz-primary))]/10 border-[hsl(var(--blitz-primary))]/30' 
                : 'text-muted-foreground hover:text-[hsl(var(--blitz-primary))] hover:bg-[hsl(var(--blitz-primary))]/5 border-transparent hover:border-[hsl(var(--blitz-primary))]/20'
            }`}
            aria-label={label}
          >
            <div className="relative">
              <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive(path) ? 'scale-110' : 'group-hover:scale-105'}`} />
              {path === '/planner' && (
                <div 
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 ${getLocationStatusColor()}`}
                />
              )}
              {isActive(path) && (
                <div className="absolute inset-0 bg-[hsl(var(--blitz-primary))]/20 rounded-full animate-pulse" />
              )}
            </div>
            <span className={`text-xs mt-1 font-bold transition-all duration-300 ${
              isActive(path) ? 'text-[hsl(var(--blitz-primary))]' : 'group-hover:text-[hsl(var(--blitz-primary))]'
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