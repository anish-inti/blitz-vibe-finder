import React from 'react';
import { Heart } from 'lucide-react';

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
      className="relative rounded-2xl overflow-hidden h-48 group cursor-pointer interactive"
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${place.image})` }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      {/* Heart button */}
      <button 
        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
          isLiked 
            ? 'bg-blitz-primary text-white' 
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
        onClick={handleLikeClick}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {place.name}
        </h3>
        <p className="text-sm text-white/80 line-clamp-2">
          {place.description}
        </p>
      </div>
    </div>
  );
};

export default FeaturedPlaceCard;