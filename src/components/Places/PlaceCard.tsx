import React from 'react';
import { Star, Heart, MessageCircle, MapPin, Users, Share2, Eye } from 'lucide-react';

interface Place {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  category: string;
  description?: string;
  tags: string[];
  opening_hours: Record<string, any>;
  price_level?: number;
  images: string[];
  added_by?: string;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
  like_count: number;
  save_count: number;
  visit_count: number;
  share_count: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
  showCommunityStats?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick, showCommunityStats = true }) => {
  return (
    <div 
      className="card-elevated rounded-2xl overflow-hidden cursor-pointer interactive group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={place.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'} 
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop';
          }}
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="badge-community">
            {place.category}
          </span>
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
        {place.tags && place.tags.length > 0 && (
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
                <span className="font-semibold">{place.like_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span className="font-semibold">{place.review_count || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span className="font-semibold">{place.visit_count || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;