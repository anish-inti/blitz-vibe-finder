
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
      darkMode ? 'bg-blitz-black/80 border-blitz-gray/20' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={handleBack}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-blitz-gray/20 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
              }`}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          {title && (
            <h1 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h1>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
