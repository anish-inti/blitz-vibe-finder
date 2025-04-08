
import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  showMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showMenu = true }) => {
  return (
    <header className="w-full px-4 py-3 flex justify-between items-center z-10">
      <div className="font-heading text-2xl tracking-wider font-light">Blitz</div>
      {showMenu && (
        <button className="p-1">
          <Menu className="w-6 h-6" />
        </button>
      )}
    </header>
  );
};

export default Header;
