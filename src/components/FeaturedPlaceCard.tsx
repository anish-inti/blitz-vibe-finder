import React from 'react';
import { Heart, Users, Star, MapPin } from 'lucide-react';

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
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
        style={{ backgroundImage: `url(${place.image})` }}
      />
      
      {/* Clean overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      {/* Community indicators */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <div className="badge-trending">
          TRENDING
        </div>
      </div>
      
      {/* Heart button - Spotify style */}
      <button 
        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 interactive group/heart ${
          isLiked 
            ? 'bg-[hsl(var(--blitz-primary))] text-white shadow-lg' 
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
        onClick={handleLikeClick}
      >
        <Heart className={`w-4 h-4 transition-transform duration-300 group-hover/heart:scale-110 ${isLiked ? 'fill-current' : ''}`} />
      </button>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-white transition-colors duration-300">
          {place.name}
        </h3>
        <p className="text-sm text-white/90 line-clamp-2 group-hover:text-white transition-colors duration-300 mb-3">
          {place.description}
        </p>
        
        {/* Community stats */}
        <div className="flex items-center space-x-4 text-xs text-white/80">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{Math.floor(Math.random() * 100) + 50} visits</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-3 h-3 text-red-400" />
            <span>{Math.floor(Math.random() * 50) + 20}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPlaceCard;