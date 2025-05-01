
import React from 'react';
import { Star, Heart, Clock } from 'lucide-react';
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
  openStatus?: 'Open' | 'Closing Soon' | 'Closed';
}

interface OutingCardProps {
  outing: Outing;
  showCommunityBadge?: boolean;
  onClick?: () => void;
}

const OutingCard: React.FC<OutingCardProps> = ({ outing, showCommunityBadge = false, onClick }) => {
  const { darkMode } = useTheme();
  const [isLiked, setIsLiked] = React.useState(false);
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  return (
    <div 
      className={`flex rounded-xl overflow-hidden glassmorphism hover:border-${darkMode ? "white/20" : "black/20"} transition-all duration-300 cursor-pointer active:scale-[0.99]`}
      onClick={onClick}
    >
      <div 
        className="w-24 h-24 flex-shrink-0 bg-cover bg-center rounded-l-lg"
        style={{ backgroundImage: `url(${outing.image})` }}
      ></div>
      
      <div className="flex-1 p-3 pl-4 relative">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`${darkMode ? "text-white" : "text-blitz-black"} font-medium text-base`}>{outing.name}</h3>
            
            <div className={`flex items-center text-xs ${darkMode ? "text-blitz-lightgray" : "text-blitz-black/60"} mt-1 space-x-2`}>
              <span>{outing.type}</span>
              <span className={`w-1 h-1 rounded-full ${darkMode ? "bg-blitz-lightgray/50" : "bg-blitz-black/40"}`}></span>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-amber-400 mr-1 fill-amber-400" />
                <span>{outing.rating} ({outing.reviews})</span>
              </div>
            </div>
          </div>
          
          {/* Heart button */}
          <button
            className={`p-1.5 rounded-full transition-all duration-200 
              ${isLiked 
                ? (darkMode ? "bg-blitz-pink/80 text-white" : "bg-blitz-pink text-white") 
                : (darkMode ? "bg-blitz-gray/70 text-white/70" : "bg-gray-100 text-gray-500")
              } hover:scale-110 active:scale-95`}
            onClick={handleLikeClick}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>
        
        {showCommunityBadge && (
          <span className={`inline-flex items-center mt-1 ${darkMode ? "bg-blitz-pink/20 text-blitz-pink" : "bg-blitz-black/20 text-blitz-black"} px-2 py-0.5 rounded-full text-xs`}>
            <Star className="h-3 w-3 mr-1 fill-current" /> Top Pick
          </span>
        )}
        
        {outing.openStatus && (
          <div className={`flex items-center mt-1 text-xs ${
            outing.openStatus === 'Open' 
              ? 'text-green-400' 
              : outing.openStatus === 'Closing Soon' 
                ? 'text-amber-400' 
                : 'text-red-400'
          }`}>
            <Clock className="h-3 w-3 mr-1" /> {outing.openStatus}
          </div>
        )}
        
        <div className="flex flex-wrap mt-2 gap-1.5">
          {outing.budget && (
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${darkMode ? "bg-blitz-gray/70 text-blitz-lightgray" : "bg-blitz-black/10 text-blitz-black/70"}`}>
              {outing.budget}
            </span>
          )}
          
          {outing.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index} 
              className={`px-2 py-0.5 rounded-full text-[11px] ${darkMode ? "bg-blitz-gray/70 text-blitz-lightgray" : "bg-blitz-black/10 text-blitz-black/70"}`}
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
