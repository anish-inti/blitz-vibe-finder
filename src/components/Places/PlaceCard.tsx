import React from 'react';
import { Star, Heart, MessageCircle, MapPin, Users, Share2, Eye } from 'lucide-react';
import { Place } from '@/hooks/use-places';
import { useUserActions } from '@/hooks/use-user-actions';
import { useAuth } from '@/contexts/AuthContext';

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
  showCommunityStats?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick, showCommunityStats = true }) => {
  const { profile } = useAuth();
  const { recordAction, removeAction } = useUserActions();
  const [isLiked, setIsLiked] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!profile) return;

    if (isLiked) {
      await removeAction(place.id, 'like');
      setIsLiked(false);
    } else {
      await recordAction(place.id, 'like');
      setIsLiked(true);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!profile) return;

    if (isSaved) {
      await removeAction(place.id, 'save');
      setIsSaved(false);
    } else {
      await recordAction(place.id, 'save');
      setIsSaved(true);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: place.description || `Check out ${place.name} on Blitz!`,
          url: `${window.location.origin}/places/${place.id}`,
        });
        
        if (profile) {
          await recordAction(place.id, 'share');
        }
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/places/${place.id}`);
      if (profile) {
        await recordAction(place.id, 'share');
      }
    }
  };

  return (
    <div 
      className="card-elevated rounded-2xl overflow-hidden cursor-pointer interactive group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={place.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'} 
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="badge-community">
            {place.category}
          </span>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 border-2 ${
              isLiked 
                ? 'bg-[hsl(var(--blitz-primary))] text-white border-white/30' 
                : 'bg-black/40 text-white hover:bg-black/60 border-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 rounded-full backdrop-blur-md bg-black/40 text-white hover:bg-black/60 transition-all duration-300 border-2 border-white/20"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Verification badge */}
        {place.is_verified && (
          <div className="absolute bottom-4 left-4">
            <span className="badge-featured">
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-title text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {place.name}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{place.address}</span>
          </div>
        </div>

        {place.description && (
          <p className="text-caption text-muted-foreground line-clamp-2">
            {place.description}
          </p>
        )}

        {/* Tags */}
        {place.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {place.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
            {place.tags.length > 3 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-semibold">
                +{place.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Rating and stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {place.average_rating > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-bold text-foreground">{place.average_rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({place.review_count})</span>
              </div>
            )}
            
            {place.price_level && (
              <div className="text-sm font-bold text-foreground">
                {'$'.repeat(place.price_level)}
              </div>
            )}
          </div>

          {showCommunityStats && (
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span className="font-semibold">{place.like_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span className="font-semibold">{place.review_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span className="font-semibold">{place.visit_count}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;