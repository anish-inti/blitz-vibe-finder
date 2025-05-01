
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

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

  return (
    <div 
      className="relative rounded-2xl overflow-hidden h-48 group transition-all duration-300 hover:shadow-lg cursor-pointer active:scale-[0.99]"
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
        <h3 className={`text-white font-semibold mb-1 group-hover:${darkMode ? "text-blitz-pink" : "text-blitz-offwhite"} transition-colors duration-300`}>
          {place.name}
        </h3>
        <p className="text-sm text-blitz-offwhite/90">
          {place.description}
        </p>
      </div>

      {/* Interactive hover effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent group-hover:from-black/0 group-hover:to-black/50 transition-all duration-300"></div>
    </div>
  );
};

export default FeaturedPlaceCard;
