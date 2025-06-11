import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface FeaturedPlaceCardProps {
  place: Place;
  onClick?: () => void;
}

const FeaturedPlaceCard: React.FC<FeaturedPlaceCardProps> = ({ place, onClick }) => {
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className="relative rounded-2xl overflow-hidden h-48 group cursor-pointer interactive-glow"
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
        style={{ backgroundImage: `url(${place.image})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Animated sparkles */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Sparkles className="w-4 h-4 text-blitz-secondary animate-pulse-glow" />
      </div>
      
      {/* Heart button */}
      <button 
        className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 interactive group/heart ${
          isLiked 
            ? 'bg-blitz-primary text-white shadow-lg shadow-blitz-primary/30' 
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
        onClick={handleLikeClick}
      >
        <Heart className={`w-4 h-4 transition-transform duration-300 group-hover/heart:scale-110 ${isLiked ? 'fill-current' : ''}`} />
      </button>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-blitz-secondary transition-colors duration-300">
          {place.name}
        </h3>
        <p className="text-sm text-white/90 line-clamp-2 group-hover:text-white transition-colors duration-300">
          {place.description}
        </p>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-blitz-primary/0 to-blitz-primary/0 group-hover:from-blitz-primary/10 group-hover:to-blitz-secondary/10 transition-all duration-500 pointer-events-none" />
    </div>
  );
};

export default FeaturedPlaceCard;