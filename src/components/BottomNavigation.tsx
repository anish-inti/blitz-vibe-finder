
import React from 'react';
import { Home, Search, Heart, User, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Calendar, label: 'Planner', path: '/planner' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
      darkMode ? 'bg-blitz-black/80 border-blitz-gray/20' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive 
                  ? 'text-blitz-pink' 
                  : darkMode 
                    ? 'text-blitz-lightgray hover:text-white' 
                    : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
