import React from 'react';
import { ChevronLeft, MoreHorizontal, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LocationAccess } from './LocationAccess';

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
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full glassmorphism-strong border-b-2 border-border/30">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          {showBackButton ? (
            <button 
              onClick={handleBack}
              className="mr-3 p-2 -ml-2 rounded-full hover:bg-[hsl(var(--blitz-primary))]/10 transition-all duration-300 interactive group border-2 border-transparent hover:border-[hsl(var(--blitz-primary))]/20"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 group-hover:text-[hsl(var(--blitz-primary))] transition-colors text-foreground" />
            </button>
          ) : (
            <Link to="/" className="flex items-center group">
              <img 
                src="/lovable-uploads/8c93f489-9e9c-4ba4-99c4-51175e60293f.png" 
                alt="Blitz" 
                className="h-8 w-auto group-hover:scale-105 transition-transform duration-300"
              />
              <span className="ml-2 text-xl font-black text-[hsl(var(--blitz-primary))]">Blitz</span>
            </Link>
          )}
        </div>
        
        {title && (
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold text-foreground">
            {title}
          </h1>
        )}
        
        <div className="flex items-center space-x-2">
          <LocationAccess showDebug={showLocationDebug} />
          
          {/* Notifications with better contrast */}
          <button className="p-2 rounded-full hover:bg-[hsl(var(--blitz-primary))]/10 transition-all duration-300 interactive group relative border-2 border-transparent hover:border-[hsl(var(--blitz-primary))]/20">
            <Bell className="w-5 h-5 group-hover:text-[hsl(var(--blitz-primary))] transition-colors text-foreground" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[hsl(var(--blitz-live))] rounded-full animate-pulse border-2 border-white" />
          </button>
          
          {showMenu && (
            <button className="p-2 rounded-full hover:bg-[hsl(var(--blitz-primary))]/10 transition-all duration-300 interactive group border-2 border-transparent hover:border-[hsl(var(--blitz-primary))]/20">
              <MoreHorizontal className="w-5 h-5 group-hover:text-[hsl(var(--blitz-primary))] transition-colors text-foreground" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;