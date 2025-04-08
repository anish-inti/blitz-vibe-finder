
import React from 'react';
import { Menu, Sparkles } from 'lucide-react';

interface HeaderProps {
  showMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showMenu = true }) => {
  return (
    <header className="w-full px-6 py-4 flex justify-between items-center z-10 relative glassmorphism backdrop-blur-lg">
      <div className="flex items-center">
        <div className="font-heading text-2xl tracking-wider font-light relative neon-text">
          <span className="bg-gradient-to-r from-blitz-pink via-blitz-purple to-blitz-blue bg-clip-text text-transparent">
            Blitz
          </span>
          <Sparkles className="absolute -right-6 -top-1 w-4 h-4 text-blitz-stardust animate-pulse-glow" />
        </div>
      </div>
      
      {showMenu && (
        <button className="p-2 rounded-full glassmorphism hover:neon-glow transition-all duration-300">
          <Menu className="w-5 h-5" />
        </button>
      )}
    </header>
  );
};

export default Header;
