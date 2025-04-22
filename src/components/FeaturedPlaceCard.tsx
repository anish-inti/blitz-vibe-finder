
import React from 'react';

interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface FeaturedPlaceCardProps {
  place: Place;
}

const FeaturedPlaceCard: React.FC<FeaturedPlaceCardProps> = ({ place }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden h-48 group transition-all duration-300 hover:shadow-lg">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${place.image})` }}
      ></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
      
      {/* Pink tint overlay */}
      <div className="absolute inset-0 bg-blitz-pink/20 mix-blend-overlay"></div>
      
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="text-white font-semibold mb-1 group-hover:text-blitz-pink transition-colors duration-300">
          {place.name}
        </h3>
        <p className="text-sm text-blitz-offwhite/90">
          {place.description}
        </p>
      </div>
    </div>
  );
};

export default FeaturedPlaceCard;
