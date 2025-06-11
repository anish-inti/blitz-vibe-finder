import React from 'react';
import { Star, Heart, Clock, TrendingUp } from 'lucide-react';

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
  const [isLiked, setIsLiked] = React.useState(false);
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  
  return (
    <div 
      className="flex rounded-2xl overflow-hidden card-elevated hover:shadow-xl transition-all duration-300 cursor-pointer interactive group"
      onClick={onClick}
    >
      <div 
        className="w-20 h-20 flex-shrink-0 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${outing.image})` }}
      >
        {/* Image overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blitz-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="flex-1 p-4 min-w-0">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base line-clamp-1 group-hover:text-blitz-primary transition-colors duration-300">
              {outing.name}
            </h3>
            
            <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-2">
              <span className="font-medium">{outing.type}</span>
              <span>•</span>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-500 mr-1 fill-current" />
                <span className="font-semibold">{outing.rating}</span>
              </div>
            </div>
            
            {showCommunityBadge && (
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center bg-blitz-secondary/10 text-blitz-secondary px-2 py-1 rounded-full text-xs font-bold">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Community Pick
                </span>
              </div>
            )}
            
            {outing.openStatus && (
              <div className={`flex items-center mt-1 text-xs font-semibold ${
                outing.openStatus === 'Open' 
                  ? 'text-green-600' 
                  : outing.openStatus === 'Closing Soon' 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
              }`}>
                <Clock className="h-3 w-3 mr-1" /> {outing.openStatus}
              </div>
            )}
          </div>
          
          {/* Heart button */}
          <button
            className={`p-2 rounded-full transition-all duration-300 ml-3 interactive group/heart ${
              isLiked 
                ? 'text-blitz-primary bg-blitz-primary/10' 
                : 'text-muted-foreground hover:text-blitz-primary hover:bg-blitz-primary/5'
            }`}
            onClick={handleLikeClick}
          >
            <Heart className={`w-4 h-4 transition-transform duration-300 group-hover/heart:scale-110 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutingCard;