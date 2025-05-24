
import React from 'react';
import { Menu, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LocationAccess } from './LocationAccess';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  showMenu?: boolean;
  showLocationDebug?: boolean;
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  showMenu = true, 
  showLocationDebug = false,
  title,
  showBackButton = false
}) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <header className={`w-full px-6 py-4 flex justify-between items-center z-10 relative transition-colors ${
      darkMode ? "bg-blitz-black/60" : "bg-blitz-offwhite/60"
    } backdrop-blur-xl`}>
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className={`p-2 mr-2 rounded-full transition-all duration-200 active:scale-95 ${
              darkMode ? "bg-blitz-gray/50 hover:bg-blitz-gray/70" : "bg-gray-200/70 hover:bg-gray-300/70"
            }`}
            aria-label="Go back"
          >
            <ChevronLeft className={`w-5 h-5 ${darkMode ? "text-white" : "text-blitz-black"}`} />
          </button>
        )}
        
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/8c93f489-9e9c-4ba4-99c4-51175e60293f.png" 
            alt="Blitz Logo" 
            className="h-9 object-contain transition-all duration-200 hover:opacity-90"
          />
        </Link>
      </div>
      
      {title && (
        <h1 className={`absolute left-1/2 transform -translate-x-1/2 text-lg font-medium ${
          darkMode ? "text-white" : "text-blitz-black"
        }`}>
          {title}
        </h1>
      )}
      
      <div className="flex items-center space-x-3">
        <LocationAccess showDebug={showLocationDebug} />
        
        {showMenu && (
          <button className={`p-2 rounded-full transition-all duration-200 active:scale-95 ${
            darkMode ? "bg-blitz-gray/50" : "bg-gray-200/70"
          } backdrop-blur-lg`}>
            <Menu className={`w-5 h-5 ${darkMode ? "text-white" : "text-blitz-black"}`} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
