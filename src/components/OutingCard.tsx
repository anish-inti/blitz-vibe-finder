import React from 'react';
import { Star, Heart, Clock } from 'lucide-react';

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
      className="flex rounded-xl overflow-hidden bg-card border hover:shadow-md transition-all cursor-pointer interactive"
      onClick={onClick}
    >
      <div 
        className="w-20 h-20 flex-shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${outing.image})` }}
      />
      
      <div className="flex-1 p-3 min-w-0">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-base line-clamp-1">{outing.name}</h3>
            
            <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-2">
              <span>{outing.type}</span>
              <span>•</span>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-500 mr-1 fill-current" />
                <span>{outing.rating}</span>
              </div>
            </div>
            
            {showCommunityBadge && (
              <span className="inline-flex items-center mt-1 bg-blitz-primary/10 text-blitz-primary px-2 py-0.5 rounded-full text-xs font-medium">
                Community Pick
              </span>
            )}
            
            {outing.openStatus && (
              <div className={`flex items-center mt-1 text-xs ${
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
            className={`p-1.5 rounded-full transition-all ml-2 ${
              isLiked 
                ? 'text-blitz-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={handleLikeClick}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutingCard;