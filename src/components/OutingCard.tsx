
import React from 'react';
import { Star } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface Outing {
  id: string;
  name: string;
  type: string;
  rating: number;
  reviews: number;
  budget?: string;
  tags: string[];
  image: string;
  category?: string;
}

interface OutingCardProps {
  outing: Outing;
  showCommunityBadge?: boolean;
  onClick?: () => void;
}

const OutingCard: React.FC<OutingCardProps> = ({ outing, showCommunityBadge = false, onClick }) => {
  const { darkMode } = useTheme();
  
  return (
    <div 
      className={`flex rounded-xl overflow-hidden glassmorphism hover:border-${darkMode ? "white/20" : "black/20"} transition-all duration-300 cursor-pointer active:scale-[0.99]`}
      onClick={onClick}
    >
      <div 
        className="w-24 h-24 flex-shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${outing.image})` }}
      ></div>
      
      <div className="flex-1 p-3 pl-4">
        <div className="flex justify-between">
          <h3 className={`${darkMode ? "text-white" : "text-blitz-black"} font-medium text-base`}>{outing.name}</h3>
          
          {showCommunityBadge && (
            <span className={`inline-flex items-center ${darkMode ? "bg-blitz-pink/20 text-blitz-pink" : "bg-blitz-black/20 text-blitz-black"} px-2 py-0.5 rounded-full text-xs`}>
              <Star className="h-3 w-3 mr-1" /> Top Pick
            </span>
          )}
        </div>
        
        <div className={`flex items-center text-xs ${darkMode ? "text-blitz-lightgray" : "text-blitz-black/60"} mt-1 space-x-2`}>
          <span>{outing.type}</span>
          <span className={`w-1 h-1 rounded-full ${darkMode ? "bg-blitz-lightgray/50" : "bg-blitz-black/40"}`}></span>
          <div className="flex items-center">
            <Star className="h-3 w-3 text-amber-400 mr-1 fill-amber-400" />
            <span>{outing.rating} ({outing.reviews})</span>
          </div>
        </div>
        
        <div className="flex mt-2">
          {outing.budget && (
            <span className={`mr-2 px-2 py-0.5 rounded-full text-[11px] ${darkMode ? "bg-blitz-gray/70 text-blitz-lightgray" : "bg-blitz-black/10 text-blitz-black/70"}`}>
              {outing.budget}
            </span>
          )}
          
          {outing.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index} 
              className={`mr-2 px-2 py-0.5 rounded-full text-[11px] ${darkMode ? "bg-blitz-gray/70 text-blitz-lightgray" : "bg-blitz-black/10 text-blitz-black/70"}`}
            >
              {tag}
            </span>
          ))}
          
          {outing.tags.length > 2 && (
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${darkMode ? "bg-blitz-gray/70 text-blitz-lightgray" : "bg-blitz-black/10 text-blitz-black/70"}`}>
              +{outing.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutingCard;
