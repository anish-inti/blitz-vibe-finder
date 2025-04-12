
import React, { useState } from 'react';
import { Heart, Bookmark } from 'lucide-react';

export interface Place {
  id: string;
  name: string;
  location: string;
  country: string;
  image: string;
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
  };
  
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
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
          <p className="text-base text-blitz-offwhite mb-1">{place.location}</p>
          <p className="text-sm text-blitz-lightgray">{place.country}</p>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
