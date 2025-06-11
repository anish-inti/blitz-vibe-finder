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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t">
      <div className="flex items-center justify-around px-6 py-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link 
            key={path}
            to={path} 
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              isActive(path) 
                ? 'text-blitz-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label={label}
          >
            <div className="relative">
              <Icon className="w-6 h-6" />
              {path === '/planner' && (
                <div 
                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getLocationStatusColor()}`}
                />
              )}
            </div>
            <span className="text-xs mt-1 font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;