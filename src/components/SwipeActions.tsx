
import React from 'react';
import { Check, X, ArrowUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface SwipeActionsProps {
  onLike?: () => void;
  onDislike?: () => void;
  onBook?: () => void;
}

const SwipeActions: React.FC<SwipeActionsProps> = ({ 
  onLike = () => {}, 
  onDislike = () => {}, 
  onBook = () => {} 
}) => {
  const { darkMode } = useTheme();
  
  return (
    <div className="flex justify-center items-center mt-6 px-4 py-4 w-full">
      <div className={`flex justify-between items-center ${darkMode ? 'glassmorphism' : 'bg-white/90 shadow-md'} rounded-full px-6 py-3.5 w-full max-w-xs mx-auto`}>
        <button 
          onClick={onDislike}
          className="flex flex-col items-center cursor-pointer focus:outline-none transition-transform active:scale-95"
          aria-label="Skip this place"
        >
          <div className={`w-12 h-12 flex items-center justify-center ${darkMode ? 'bg-blitz-gray/60 hover:bg-blitz-gray/80' : 'bg-gray-200 hover:bg-gray-300'} rounded-full transition-all`}>
            <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-500'}`} />
          </div>
        </button>
        
        <button 
          onClick={onBook}
          className="flex flex-col items-center cursor-pointer focus:outline-none transition-transform active:scale-95"
          aria-label="Book this place"
        >
          <div className={`w-12 h-12 flex items-center justify-center ${darkMode ? 'bg-blitz-gray/60 hover:bg-blitz-gray/80' : 'bg-gray-200 hover:bg-gray-300'} rounded-full transition-all`}>
            <ArrowUp className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-500'}`} />
          </div>
        </button>
        
        <button 
          onClick={onLike}
          className="flex flex-col items-center cursor-pointer focus:outline-none transition-transform active:scale-95"
          aria-label="Like this place"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-blitz-pink rounded-full hover:bg-blitz-pink/90 transition-all shadow-[0_0_15px_rgba(255,110,199,0.5)]">
            <Check className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default SwipeActions;
