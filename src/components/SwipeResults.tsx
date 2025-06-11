import React from 'react';
import { Place } from './SwipeCard';
import { Sparkles, Heart, MapPin, Star } from 'lucide-react';

interface SwipeResultsProps {
  likedPlaces: Place[];
  onContinue: () => void;
  onFinish: () => void;
}

const SwipeResults: React.FC<SwipeResultsProps> = ({ likedPlaces, onContinue, onFinish }) => (
  <div className="animate-fade-in text-center space-y-6">
    <div className="card-hero rounded-3xl p-8">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blitz-secondary to-blitz-primary text-white shadow-lg">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        
        <div>
          <h2 className="text-display mb-2 text-gradient">
            Your Perfect Plan
          </h2>
          <p className="text-caption text-muted-foreground">
            {likedPlaces.length > 0 
              ? `You've discovered ${likedPlaces.length} amazing ${likedPlaces.length === 1 ? 'place' : 'places'}!`
              : "Ready to explore more options?"
            }
          </p>
        </div>
      </div>

      {/* Places List */}
      {likedPlaces.length > 0 ? (
        <div className="space-y-3 mb-8 max-h-64 overflow-y-auto">
          {likedPlaces.map((place, index) => (
            <div 
              key={place.id} 
              className="card-spotify rounded-2xl p-4 text-left animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                <img 
                  src={place.image} 
                  alt={place.name} 
                  className="w-12 h-12 rounded-xl object-cover" 
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-1">{place.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{place.location}</span>
                    </div>
                    {place.rating && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium">{place.rating}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Heart className="w-4 h-4 text-blitz-secondary fill-current" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Sparkles className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            No places caught your eye? Let's find something perfect for you!
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onContinue}
          className="flex-1 py-3 px-4 border border-border text-muted-foreground rounded-2xl hover:bg-muted/50 transition-all font-semibold interactive"
        >
          Explore More
        </button>
        <button
          onClick={onFinish}
          className="flex-1 btn-primary rounded-2xl py-3 font-bold interactive-glow"
        >
          {likedPlaces.length > 0 ? 'Save Plan' : 'Try Again'}
        </button>
      </div>
    </div>
  </div>
);

export default SwipeResults;