
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
        flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
        ${isActive 
          ? darkMode 
            ? "bg-blitz-pink/20 border border-blitz-pink/30" 
            : "bg-blitz-black/20 border border-blitz-black/30"
          : darkMode
            ? "bg-blitz-gray/40 hover:bg-blitz-gray/60" 
            : "bg-white/20 hover:bg-white/40 backdrop-blur-md"
        }
        active:scale-95
      `}
      onClick={onClick}
    >
      <div className={`
        rounded-full w-10 h-10 flex items-center justify-center mb-1
        ${isActive 
          ? darkMode 
            ? "bg-blitz-pink/20 text-blitz-pink" 
            : "bg-blitz-black/20 text-blitz-black"
          : darkMode 
            ? "bg-blitz-gray/60 text-white" 
            : "bg-white/30 text-blitz-black"
        }
      `}>
        {icon}
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
    </button>
  );
};

export default QuickAccessButton;
