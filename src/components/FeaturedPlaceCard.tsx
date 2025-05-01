
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { darkMode } = useTheme();
  const [isLiked, setIsLiked] = React.useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className="relative rounded-2xl overflow-hidden h-52 group transition-all duration-300 hover:shadow-xl cursor-pointer active:scale-[0.99]"
      onClick={onClick}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${place.image})` }}
      ></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
      
      {/* Pink tint overlay */}
      <div className={`absolute inset-0 ${darkMode ? "bg-blitz-pink/20" : "bg-blitz-black/20"} mix-blend-overlay`}></div>
      
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className={`text-white font-semibold text-lg mb-1 group-hover:${darkMode ? "text-blitz-pink" : "text-blitz-offwhite"} transition-colors duration-300`}>
          {place.name}
        </h3>
        <p className="text-sm text-blitz-offwhite/90 line-clamp-2">
          {place.description}
        </p>
      </div>

      {/* Heart button for liking */}
      <button 
        className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 
          ${isLiked 
            ? (darkMode ? "bg-blitz-pink/80 text-white" : "bg-blitz-pink text-white") 
            : (darkMode ? "bg-black/40 text-white/70" : "bg-white/40 text-black/70")
          } hover:scale-110 active:scale-95`}
        onClick={handleLikeClick}
      >
        <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
      </button>

      {/* Interactive hover effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent group-hover:from-black/0 group-hover:to-black/50 transition-all duration-300"></div>
    </div>
  );
};

export default FeaturedPlaceCard;
