
import React, { useState } from 'react';
import { Heart, Bookmark, Star, MapPin, Clock } from 'lucide-react';

export interface Place {
  id: string;
  name: string;
  location: string;
  country: string;
  image: string;
  description?: string;    // Added for AI-generated recommendations
  rating?: number;
  reviewCount?: number;
  priceLevel?: number;
  isOpen?: boolean;
  category?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
}

interface SwipeCardProps {
  place: Place;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ place, onSwipe }) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = startY - currentY; // Inverted to make upward positive
    
    setOffsetX(diffX);
    setOffsetY(diffY > 0 ? diffY : 0); // Only allow upward movement
    
    // Determine swipe direction
    if (diffY > 100) {
      // Upward swipe (book)
      setSwipeDirection('up');
    } else if (diffX > 50) {
      // Right swipe (like)
      setSwipeDirection('right');
    } else if (diffX < -50) {
      // Left swipe (dislike)
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };
  
  const handleTouchEnd = () => {
    if (swipeDirection) {
      onSwipe(swipeDirection);
    }
    setOffsetX(0);
    setOffsetY(0);
    setSwipeDirection(null);
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    if (!liked) {
      onSwipe('right');
    }
  };
  
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
  };
  
  // Helper to render price level
  const renderPriceLevel = () => {
    if (place.priceLevel === undefined) return null;
    
    return (
      <div className="text-blitz-lightgray text-xs">
        {Array(place.priceLevel + 1).join('$')}
      </div>
    );
  };
  
  // Helper to render distance
  const renderDistance = () => {
    if (place.distance === undefined) return null;
    
    const formattedDistance = place.distance >= 1000 
      ? `${(place.distance / 1000).toFixed(1)}km` 
      : `${Math.round(place.distance)}m`;
    
    return (
      <div className="flex items-center text-blitz-lightgray text-xs">
        <MapPin className="w-3 h-3 mr-1" />
        {formattedDistance}
      </div>
    );
  };
  
  // Helper to render rating
  const renderRating = () => {
    if (place.rating === undefined) return null;
    
    return (
      <div className="flex items-center text-blitz-lightgray text-xs">
        <Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" />
        {place.rating.toFixed(1)}
        {place.reviewCount !== undefined && (
          <span className="ml-1">({place.reviewCount})</span>
        )}
      </div>
    );
  };
  
  // Helper to render open status
  const renderOpenStatus = () => {
    if (place.isOpen === undefined) return null;
    
    return (
      <div className="flex items-center text-xs">
        <Clock className="w-3 h-3 mr-1" />
        <span className={place.isOpen ? "text-green-400" : "text-red-400"}>
          {place.isOpen ? "Open" : "Closed"}
        </span>
      </div>
    );
  };
  
  // Helper to render category as a badge
  const renderCategory = () => {
    if (!place.category) return null;
    
    return (
      <div className="inline-block bg-blitz-gray/60 backdrop-blur-md px-2 py-0.5 rounded-full text-xs text-white">
        {place.category}
      </div>
    );
  };
  
  return (
    <div 
      className={`swipe-card w-full overflow-hidden relative max-w-md mx-auto
        ${swipeDirection === 'left' ? 'swiping-left' : ''}
        ${swipeDirection === 'right' ? 'swiping-right' : ''}
        ${swipeDirection === 'up' ? 'swiping-up' : ''}
      `}
      style={{ 
        transform: `translateX(${offsetX}px) translateY(-${offsetY}px) rotate(${offsetX * 0.04}deg) scale(${1 - offsetY * 0.001})`,
        opacity: offsetY > 0 ? 1 - offsetY * 0.005 : 1
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
        {/* Main Card with image */}
        <img 
          src={place.image} 
          alt={place.name} 
          className="w-full h-full object-cover rounded-2xl"
        />
        
        {/* Subtle overlay gradient */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent via-blitz-black/40 to-blitz-black/90 rounded-2xl"></div>
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          {renderCategory()}
        </div>
        
        {/* Action buttons with Apple-style design */}
        <div className="absolute top-4 right-4 flex gap-3">
          <button 
            onClick={handleSave}
            className="w-10 h-10 flex items-center justify-center bg-blitz-black/30 backdrop-blur-md rounded-full shadow-lg transition-all duration-200 active:scale-95"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-blitz-pink text-blitz-pink' : 'text-white'}`} />
          </button>
          
          <button 
            onClick={handleLike}
            className="w-10 h-10 flex items-center justify-center bg-blitz-black/30 backdrop-blur-md rounded-full shadow-lg transition-all duration-200 active:scale-95"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-blitz-pink text-blitz-pink' : 'text-white'}`} />
          </button>
        </div>
        
        {/* Apple-styled content area */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="text-2xl font-semibold mb-1.5 tracking-tight">{place.name}</h2>
          
          <div className="flex items-center gap-3 mb-1">
            {renderRating()}
            {renderPriceLevel()}
            {renderOpenStatus()}
          </div>
          
          <p className="text-base text-blitz-offwhite mb-1">
            {place.location}
            {place.country && `, ${place.country}`}
          </p>
          
          {/* Description from AI recommendations */}
          {place.description && (
            <p className="text-sm text-blitz-offwhite/80 mt-1 mb-2 line-clamp-2">
              {place.description}
            </p>
          )}
          
          <div className="flex items-center gap-3 mt-2">
            {renderDistance()}
            {place.longitude && place.latitude ? (
              <button 
                className="text-xs text-blitz-pink"
                onClick={() => window.open(`https://maps.google.com/?q=${place.latitude},${place.longitude}`, '_blank')}
              >
                View on map
              </button>
            ) : (
              <button 
                className="text-xs text-blitz-pink"
                onClick={() => window.open(`https://www.google.com/search?q=${place.name} ${place.location}`, '_blank')}
              >
                Search online
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
