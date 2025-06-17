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
      className="relative rounded-2xl overflow-hidden h-48 group cursor-pointer interactive border-2 border-transparent hover:border-[hsl(var(--blitz-primary))]/30"
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
        style={{ backgroundImage: `url(${place.image})` }}
      />
      
      {/* High contrast overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      {/* Community indicators with better contrast - FIXED TRENDING BADGE */}
      <div className="absolute top-4 left-4 flex space-x-2">
        <div className="badge-trending">
          TRENDING
        </div>
      </div>
      
      {/* Heart button with better contrast */}
      <button 
        className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 interactive group/heart border-2 ${
          isLiked 
            ? 'bg-[hsl(var(--blitz-primary))] text-white shadow-lg border-white/30' 
            : 'bg-black/40 text-white hover:bg-black/60 border-white/20'
        }`}
        onClick={handleLikeClick}
      >
        <Heart className={`w-5 h-5 transition-transform duration-300 group-hover/heart:scale-110 ${isLiked ? 'fill-current' : ''}`} />
      </button>
      
      {/* Content with better contrast */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="font-bold text-xl mb-3 line-clamp-1 text-white drop-shadow-lg">
          {place.name}
        </h3>
        <p className="text-sm text-white/95 line-clamp-2 mb-4 drop-shadow-md">
          {place.description}
        </p>
        
        {/* Community stats with better contrast */}
        <div className="flex items-center space-x-4 text-sm text-white/90">
          <div className="flex items-center space-x-1 bg-black/30 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-bold">{(Math.random() * 2 + 3).toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1 bg-black/30 px-2 py-1 rounded-full">
            <Users className="w-4 h-4" />
            <span className="font-bold">{Math.floor(Math.random() * 100) + 50}</span>
          </div>
          <div className="flex items-center space-x-1 bg-black/30 px-2 py-1 rounded-full">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="font-bold">{Math.floor(Math.random() * 50) + 20}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPlaceCard;