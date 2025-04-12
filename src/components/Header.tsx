
import React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  showMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showMenu = true }) => {
  return (
    <header className="w-full px-6 py-5 flex justify-between items-center z-10 relative bg-blitz-black/60 backdrop-blur-xl">
      <Link to="/" className="flex items-center">
        <div className="font-heading text-xl tracking-tight font-semibold relative">
          <span className="text-white">
            Blitz
          </span>
          <Sparkles className="absolute -right-5 top-0 w-3.5 h-3.5 text-blitz-pink opacity-80" />
        </div>
      </Link>
      
      {showMenu && (
        <button className="p-2 rounded-full bg-blitz-gray/50 backdrop-blur-lg transition-all duration-200 active:scale-95">
          <Menu className="w-5 h-5 text-white" />
        </button>
      )}
    </header>
  );
};

export default Header;
