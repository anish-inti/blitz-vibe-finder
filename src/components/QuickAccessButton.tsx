
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface QuickAccessButtonProps {
  name: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({ name, icon, isActive = false, onClick }) => {
  const { darkMode } = useTheme();
  
  return (
    <button
      className={`
        relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300
        ${isActive 
          ? darkMode 
            ? "bg-blitz-pink/30 border border-blitz-pink/40 shadow-md shadow-blitz-pink/20" 
            : "bg-blitz-black/20 border border-blitz-black/40 shadow-md shadow-black/10"
          : darkMode
            ? "bg-blitz-gray/40 hover:bg-blitz-gray/60 hover:shadow-md hover:shadow-black/20" 
            : "bg-white/20 hover:bg-white/40 backdrop-blur-md hover:shadow-md hover:shadow-black/10"
        }
        active:scale-95
      `}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <div className={`
        relative rounded-full w-10 h-10 flex items-center justify-center mb-1 overflow-hidden
        ${isActive 
          ? darkMode 
            ? "bg-blitz-pink/30 text-blitz-pink" 
            : "bg-blitz-black/20 text-blitz-black"
          : darkMode 
            ? "bg-blitz-gray/60 text-white" 
            : "bg-white/30 text-blitz-black"
        }
      `}>
        {icon}
        {isActive && <div className="absolute inset-0 bg-current opacity-10 animate-pulse-glow"></div>}
      </div>
      <span className={`text-[10px] font-medium
        ${isActive 
          ? darkMode 
            ? "text-blitz-pink" 
            : "text-blitz-black"
          : darkMode 
            ? "text-blitz-lightgray" 
            : "text-blitz-black/80"
        }
      `}>
        {name}
      </span>
      
      {isActive && (
        <span className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${darkMode ? "bg-blitz-pink" : "bg-blitz-black"}`}></span>
      )}
      
      {/* Ripple animation when active */}
      {isActive && (
        <span className={`absolute inset-0 rounded-lg ${darkMode ? "bg-blitz-pink/10" : "bg-blitz-black/10"} animate-ping-slow opacity-70`}></span>
      )}
    </button>
  );
};

export default QuickAccessButton;
