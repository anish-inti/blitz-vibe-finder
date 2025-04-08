
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
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ place, onSwipe }) => {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
    
    if (diff > 50) {
      setSwipeDirection('right');
    } else if (diff < -50) {
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
      className={`swipe-card w-full rounded-2xl overflow-hidden shadow-lg relative max-w-md mx-auto
        ${swipeDirection === 'left' ? 'swiping-left' : ''}
        ${swipeDirection === 'right' ? 'swiping-right' : ''}
      `}
      style={{ transform: `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <img 
          src={place.image} 
          alt={place.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={handleSave}
            className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full"
          >
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-white text-white' : 'text-white'}`} />
          </button>
          
          <button 
            onClick={handleLike}
            className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full"
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-blitz-pink text-blitz-pink' : 'text-white'}`} />
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="text-3xl font-bold text-shadow mb-1">{place.name}</h2>
          <p className="text-lg opacity-90 text-shadow">{place.location}</p>
          <p className="text-sm opacity-80 text-shadow">{place.country}</p>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
