
import React from 'react';
import { Check, X, ArrowUp } from 'lucide-react';

interface SwipeActionsProps {
  onLike?: () => void;
  onDislike?: () => void;
  onBook?: () => void;
}

const SwipeActions: React.FC<SwipeActionsProps> = ({ 
  onLike = () => {}, 
  onDislike = () => {}, 
  onBook = () => {} 
}) => (
  <div className="flex justify-between items-center mt-6 px-6 py-4 glassmorphism rounded-full w-72 mx-auto">
    <button 
      onClick={onDislike}
      className="flex flex-col items-center cursor-pointer focus:outline-none transition-transform active:scale-95"
      aria-label="Skip"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-blitz-gray/60 rounded-full hover:bg-blitz-gray/80 transition-all">
        <X className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs text-blitz-lightgray mt-1.5">Skip</span>
    </button>
    
    <button 
      onClick={onBook}
      className="flex flex-col items-center cursor-pointer focus:outline-none transition-transform active:scale-95"
      aria-label="Book"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-blitz-gray/60 rounded-full hover:bg-blitz-gray/80 transition-all">
        <ArrowUp className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs text-blitz-lightgray mt-1.5">Book</span>
    </button>
    
    <button 
      onClick={onLike}
      className="flex flex-col items-center cursor-pointer focus:outline-none transition-transform active:scale-95"
      aria-label="Like"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-blitz-pink rounded-full hover:bg-blitz-pink/90 transition-all shadow-[0_0_15px_rgba(255,110,199,0.5)]">
        <Check className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs text-blitz-lightgray mt-1.5">Like</span>
    </button>
  </div>
);

export default SwipeActions;
