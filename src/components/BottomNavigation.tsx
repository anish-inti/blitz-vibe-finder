
import React from 'react';
import { User, Search, MapPin, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 px-4 py-2 flex justify-around items-center z-10">
      <Link to="/profile" className={`p-2 flex flex-col items-center ${isActive('/profile') ? 'text-blitz-purple' : 'text-gray-500'}`}>
        <User className="w-6 h-6" />
      </Link>
      
      <Link to="/search" className={`p-2 flex flex-col items-center ${isActive('/search') ? 'text-blitz-purple' : 'text-gray-500'}`}>
        <Search className="w-6 h-6" />
      </Link>
      
      <Link to="/places" className={`p-2 flex flex-col items-center ${isActive('/places') ? 'text-blitz-purple' : 'text-gray-500'}`}>
        <MapPin className="w-6 h-6" />
      </Link>
      
      <Link to="/favorites" className={`p-2 flex flex-col items-center ${isActive('/favorites') ? 'text-blitz-purple' : 'text-gray-500'}`}>
        <Heart className="w-6 h-6" />
      </Link>
    </nav>
  );
};

export default BottomNavigation;
