
import React, { useState, useEffect } from 'react';
import { Heart, Bookmark, Star, MapPin, Clock, Check, X, Users, DollarSign, Tag } from 'lucide-react';
import { Badge } from './ui/badge';

export interface Place {
  id: string;
  name: string;
  location: string;
  country: string;
  image: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: number;
  isOpen?: boolean;
  category?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
  budget?: number;
  maxGroupSize?: number;
  tags?: string[];
  time?: string;
  hours?: string;
  matchedVibes?: string[];
}

interface SwipeCardProps {
  place: Place;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  promptFilters?: {
    vibes: string[];
    budget: number | null;
    groupSize: number | null;
    time: string | null;
  };
}

const SwipeCard: React.FC<SwipeCardProps> = ({ place, onSwipe, promptFilters }) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDirectionIndicator, setShowDirectionIndicator] = useState(false);
  
  // Reset card position after animation completes
  useEffect(() => {
    if (swipeDirection) {
      const timer = setTimeout(() => {
        setSwipeDirection(null);
        setOffsetX(0);
        setOffsetY(0);
        setShowDirectionIndicator(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [swipeDirection]);
  
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
      setShowDirectionIndicator(true);
    } else if (diffX > 50) {
      // Right swipe (like)
      setSwipeDirection('right');
      setShowDirectionIndicator(true);
    } else if (diffX < -50) {
      // Left swipe (dislike)
      setSwipeDirection('left');
      setShowDirectionIndicator(true);
    } else {
      setSwipeDirection(null);
      setShowDirectionIndicator(false);
    }
  };
  
  const handleTouchEnd = () => {
    if (swipeDirection) {
      if (swipeDirection === 'right') {
        setLiked(true);
      }
      
      // Trigger animation and wait for it to complete before callback
      setTimeout(() => {
        onSwipe(swipeDirection);
      }, 100);
    } else {
      setOffsetX(0);
      setOffsetY(0);
    }
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(true);
    setSwipeDirection('right');
    setShowDirectionIndicator(true);
    
    setTimeout(() => {
      onSwipe('right');
    }, 300);
  };
  
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSwipeDirection('left');
    setShowDirectionIndicator(true);
    
    setTimeout(() => {
      onSwipe('left');
    }, 300);
  };
  
  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSwipeDirection('up');
    setShowDirectionIndicator(true);
    
    setTimeout(() => {
      onSwipe('up');
    }, 300);
  };
  
  // Helper to render price level
  const renderPriceLevel = () => {
    if (place.priceLevel === undefined && place.budget === undefined) return null;
    
    if (place.budget) {
      return (
        <div className="flex items-center text-blitz-lightgray text-xs">
          <DollarSign className="w-3 h-3 mr-1" />
          ₹{place.budget}/person
        </div>
      );
    }
    
    return (
      <div className="text-blitz-lightgray text-xs">
        {Array(place.priceLevel).fill('$').join('')}
      </div>
    );
  };

  // Helper to render group size
  const renderGroupSize = () => {
    if (place.maxGroupSize === undefined) return null;
    
    return (
      <div className="flex items-center text-blitz-lightgray text-xs">
        <Users className="w-3 h-3 mr-1" />
        Up to {place.maxGroupSize} people
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
  
  // Helper to render hours
  const renderHours = () => {
    if (!place.hours) return null;
    
    return (
      <div className="flex items-center text-xs text-blitz-lightgray">
        <Clock className="w-3 h-3 mr-1" />
        {place.hours}
      </div>
    );
  };
  
  // Helper to render tags
  const renderTags = () => {
    if (!place.tags || place.tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {place.tags.map((tag, index) => {
          const isMatched = promptFilters?.vibes?.includes(tag);
          return (
            <Badge 
              key={index} 
              variant={isMatched ? "default" : "secondary"}
              className={`text-xs py-0.5 px-1.5 ${isMatched ? 'bg-blitz-pink/80' : 'bg-blitz-gray/60'}`}
            >
              {tag}
            </Badge>
          );
        })}
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

  // Render direction indicator overlay
  const renderDirectionIndicator = () => {
    if (!showDirectionIndicator) return null;
    
    let indicator;
    if (swipeDirection === 'right') {
      indicator = (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
        </div>
      );
    } else if (swipeDirection === 'left') {
      indicator = (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
            <X className="w-10 h-10 text-white" />
          </div>
        </div>
      );
    } else if (swipeDirection === 'up') {
      indicator = (
        <div className="absolute inset-0 flex items-center justify-center bg-blitz-pink/20 backdrop-blur-sm rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-blitz-pink flex items-center justify-center">
            <span className="text-white text-xl font-bold">BOOK</span>
          </div>
        </div>
      );
    }
    
    return indicator;
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
        opacity: offsetY > 0 ? 1 - offsetY * 0.005 : 1,
        transition: swipeDirection ? 'transform 300ms ease-out, opacity 300ms ease-out' : 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label={`Place card for ${place.name}`}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
        {/* Main Card with image */}
        <img 
          src={place.image || '/placeholder.svg'} 
          alt={`${place.name} in ${place.location}`} 
          className="w-full h-full object-cover rounded-2xl"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Subtle overlay gradient */}
        <div 
          className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent via-blitz-black/40 to-blitz-black/90 rounded-2xl"
          aria-hidden="true"
        ></div>
        
        {/* Direction indicator overlay */}
        {renderDirectionIndicator()}
        
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
            aria-label={saved ? "Remove from bookmarks" : "Save to bookmarks"}
            aria-pressed={saved}
          >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-blitz-pink text-blitz-pink' : 'text-white'}`} />
          </button>
          
          <button 
            onClick={handleLike}
            className="w-10 h-10 flex items-center justify-center bg-blitz-black/30 backdrop-blur-md rounded-full shadow-lg transition-all duration-200 active:scale-95"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label={liked ? "Unlike place" : "Like place"}
            aria-pressed={liked}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-blitz-pink text-blitz-pink' : 'text-white'}`} />
          </button>
        </div>
        
        {/* Apple-styled content area */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="text-2xl font-semibold mb-1.5 tracking-tight">{place.name}</h2>
          
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            {renderRating()}
            {renderPriceLevel()}
            {renderGroupSize()}
            {renderOpenStatus()}
            {renderHours()}
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
          
          {/* Tags */}
          {renderTags()}
          
          <div className="flex items-center gap-3 mt-2">
            {renderDistance()}
            {place.longitude && place.latitude ? (
              <button 
                className="text-xs text-blitz-pink"
                onClick={() => window.open(`https://maps.google.com/maps?q=${place.latitude},${place.longitude}`, '_blank')}
                aria-label={`View ${place.name} on map`}
              >
                View on map
              </button>
            ) : (
              <button 
                className="text-xs text-blitz-pink"
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`${place.name} ${place.location}`)}`, '_blank')}
                aria-label={`Search for ${place.name} online`}
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
