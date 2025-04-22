
import React from 'react';

interface QuickAccessButtonProps {
  name: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({ 
  name, 
  icon, 
  isActive = false,
  onClick 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-blitz-pink/20 border border-blitz-pink' 
          : 'bg-blitz-gray/40 border border-white/5 hover:border-white/10'
      }`}
    >
      <div className={`p-2 rounded-lg mb-1 ${
        isActive 
          ? 'bg-blitz-pink/20 text-blitz-pink' 
          : 'bg-black/20 text-blitz-lightgray'
      }`}>
        {icon}
      </div>
      <span className={`text-xs ${
        isActive ? 'text-blitz-pink' : 'text-blitz-lightgray'
      }`}>
        {name}
      </span>
    </button>
  );
};

export default QuickAccessButton;
