import React from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Heart, Sparkles, MapPin, Star, Clock, TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const FAVORITE_PLACES = [
  {
    id: '1',
    name: 'VM Food Street',
    location: 'Chennai, India',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    rating: 4.5,
    category: 'Street Food',
    visitedAt: '2 days ago',
    tags: ['Budget', 'Outdoor', 'Group-friendly']
  },
  {
    id: '2',
    name: 'Marina Bay Lounge',
    location: 'Chennai, India',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
    rating: 4.8,
    category: 'Rooftop Bar',
    visitedAt: '1 week ago',
    tags: ['Premium', 'Aesthetic', 'Evening']
  },
  {
    id: '3',
    name: 'Phoenix Garden Cafe',
    location: 'Chennai, India',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
    rating: 4.3,
    category: 'Café',
    visitedAt: '3 days ago',
    tags: ['Peaceful', 'Work-friendly', 'Coffee']
  }
];

const Favorites: React.FC = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Luxury background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-blitz-secondary/3 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-blitz-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>
      
      <Header showBackButton title="Saved Places" />
      
      <main className="relative flex-1 px-6 pb-24 pt-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blitz-secondary to-blitz-primary text-white shadow-lg">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            
            <div>
              <h1 className="text-display mb-2 text-gradient">
                Your Collection
              </h1>
              <p className="text-caption text-muted-foreground">
                Places you've discovered and loved
              </p>
            </div>
          </div>
          
          {FAVORITE_PLACES.length > 0 ? (
            <div className="space-y-4 animate-slide-up">
              {FAVORITE_PLACES.map((place, index) => (
                <div 
                  key={place.id}
                  className="card-hero rounded-2xl overflow-hidden interactive-glow animate-scale-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => window.location.href = `/places/${place.id}`}
                >
                  <div className="flex">
                    {/* Image */}
                    <div 
                      className="w-24 h-24 bg-cover bg-center relative overflow-hidden"
                      style={{ backgroundImage: `url(${place.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blitz-primary/10" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-lg line-clamp-1 text-foreground">
                            {place.name}
                          </h3>
                          
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{place.location}</span>
                          </div>
                          
                          <div className="flex items-center mt-2 space-x-3">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 mr-1 fill-current" />
                              <span className="text-sm font-semibold">{place.rating}</span>
                            </div>
                            
                            <span className="px-2 py-1 bg-blitz-primary/10 text-blitz-primary rounded-full text-xs font-medium">
                              {place.category}
                            </span>
                          </div>
                        </div>
                        
                        <button className="p-2 rounded-full text-blitz-secondary hover:bg-blitz-secondary/10 transition-colors interactive">
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {place.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Visit info */}
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Saved {place.visitedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="card-spotify rounded-2xl p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-title mb-2">No saved places yet</h3>
                <p className="text-caption text-muted-foreground mb-6">
                  Start exploring and save places you love
                </p>
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="btn-primary rounded-xl px-6 py-3 font-semibold"
                >
                  Discover Places
                </Button>
              </div>
            </div>
          )}
          
          {/* Stats Card */}
          {FAVORITE_PLACES.length > 0 && (
            <div className="card-spotify rounded-2xl p-6 text-center animate-bounce-in">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-gradient">{FAVORITE_PLACES.length}</div>
                  <div className="text-xs text-muted-foreground">Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">
                    {(FAVORITE_PLACES.reduce((sum, place) => sum + place.rating, 0) / FAVORITE_PLACES.length).toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gradient">3</div>
                  <div className="text-xs text-muted-foreground">Categories</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Favorites;