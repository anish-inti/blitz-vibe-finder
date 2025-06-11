import React from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
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
  showMenu = false, 
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          {showBackButton ? (
            <button 
              onClick={handleBack}
              className="mr-3 p-2 -ml-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/8c93f489-9e9c-4ba4-99c4-51175e60293f.png" 
                alt="Blitz" 
                className="h-8 w-auto"
              />
            </Link>
          )}
        </div>
        
        {title && (
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
            {title}
          </h1>
        )}
        
        <div className="flex items-center space-x-2">
          <LocationAccess showDebug={showLocationDebug} />
          
          {showMenu && (
            <button className="p-2 rounded-full hover:bg-accent transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;