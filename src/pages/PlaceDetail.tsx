import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, MapPin, Clock, DollarSign, MessageCircle, Plus, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Mock data for demonstration
const MOCK_PLACES = {
  '1': {
    id: '1',
    name: 'Marina Beach',
    address: 'Marina Beach Rd, Chennai',
    category: 'Beach',
    description: 'Famous beach in Chennai perfect for evening walks. One of the longest urban beaches in the world, Marina Beach runs along the Bay of Bengal. The beach is primarily sandy, and the average width of the beach is 300 m and the width at the widest stretch is 437 m.',
    tags: ['Outdoor', 'Scenic', 'Family-friendly'],
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'],
    average_rating: 4.2,
    review_count: 1250,
    like_count: 350,
    save_count: 180,
    visit_count: 420,
    share_count: 95,
    is_verified: true,
    price_level: 1,
    opening_hours: { open: '24 hours' },
    latitude: 13.0500,
    longitude: 80.2824
  },
  '2': {
    id: '2',
    name: 'Phoenix MarketCity',
    address: 'Velachery, Chennai',
    category: 'Shopping Mall',
    description: 'Popular shopping and entertainment destination with a wide range of stores, restaurants, and a multiplex cinema. The mall spans over 1.5 million square feet and houses more than 300 national and international brands.',
    tags: ['Shopping', 'Entertainment', 'Food'],
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'],
    average_rating: 4.4,
    review_count: 890,
    like_count: 210,
    save_count: 150,
    visit_count: 380,
    share_count: 75,
    is_verified: true,
    price_level: 3,
    opening_hours: { open: '10:00 AM', close: '10:00 PM' },
    latitude: 12.9914,
    longitude: 80.2181
  },
  '3': {
    id: '3',
    name: 'Kapaleeshwarar Temple',
    address: 'Mylapore, Chennai',
    category: 'Temple',
    description: 'Historic temple with beautiful architecture dedicated to Lord Shiva. The temple was built around the 7th century CE in the Dravidian style of architecture and features a 40-meter high gopuram (entrance tower) with intricate carvings.',
    tags: ['Historic', 'Cultural', 'Spiritual'],
    images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop'],
    average_rating: 4.6,
    review_count: 2100,
    like_count: 420,
    save_count: 280,
    visit_count: 560,
    share_count: 130,
    is_verified: true,
    price_level: 1,
    opening_hours: { open: '5:00 AM', close: '12:00 PM', open2: '4:00 PM', close2: '8:00 PM' },
    latitude: 13.0343,
    longitude: 80.2698
  },
  '4': {
    id: '4',
    name: 'Cafe Coffee Day',
    address: 'T. Nagar, Chennai',
    category: 'Cafe',
    description: 'Cozy cafe perfect for hanging out with friends, working, or enjoying a cup of coffee. The cafe offers a variety of coffee beverages, snacks, and desserts in a comfortable atmosphere with free Wi-Fi.',
    tags: ['Coffee', 'Casual', 'Work-friendly'],
    images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop'],
    average_rating: 4.0,
    review_count: 456,
    like_count: 180,
    save_count: 120,
    visit_count: 320,
    share_count: 65,
    is_verified: false,
    price_level: 2,
    opening_hours: { open: '9:00 AM', close: '11:00 PM' },
    latitude: 13.0418,
    longitude: 80.2341
  },
  '5': {
    id: '5',
    name: 'Express Avenue',
    address: 'Royapettah, Chennai',
    category: 'Shopping Mall',
    description: 'Modern shopping mall with restaurants and entertainment options. The mall features a mix of international and local brands, a food court with diverse cuisine options, and a multiplex cinema.',
    tags: ['Shopping', 'Entertainment', 'Food'],
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'],
    average_rating: 4.3,
    review_count: 678,
    like_count: 195,
    save_count: 140,
    visit_count: 350,
    share_count: 85,
    is_verified: true,
    price_level: 3,
    opening_hours: { open: '10:00 AM', close: '9:00 PM' },
    latitude: 13.0569,
    longitude: 80.2425
  }
};

// Mock reviews
const MOCK_REVIEWS = {
  '1': [
    {
      id: 'r1',
      user: { display_name: 'Anish', avatar_url: null },
      rating: 5,
      title: 'Beautiful Beach!',
      content: 'One of the best beaches in Chennai. Perfect for evening walks and watching the sunrise. The beach is clean and well-maintained.',
      created_at: '2025-03-15T10:30:00Z',
      helpful_count: 24
    },
    {
      id: 'r2',
      user: { display_name: 'Priya', avatar_url: null },
      rating: 4,
      content: 'Great place to spend time with family. The beach is quite crowded during weekends but peaceful on weekdays.',
      created_at: '2025-02-20T14:15:00Z',
      helpful_count: 18
    }
  ],
  '2': [
    {
      id: 'r3',
      user: { display_name: 'Raj', avatar_url: null },
      rating: 4,
      title: 'Great Shopping Experience',
      content: 'Phoenix MarketCity has a great collection of brands. The food court offers good variety. Parking can be a bit challenging during weekends.',
      created_at: '2025-03-10T16:45:00Z',
      helpful_count: 15
    }
  ],
  '3': [
    {
      id: 'r4',
      user: { display_name: 'Meera', avatar_url: null },
      rating: 5,
      title: 'Peaceful Temple',
      content: 'Beautiful architecture and peaceful atmosphere. The temple has a rich history and the sculptures are amazing. A must-visit in Chennai.',
      created_at: '2025-03-05T09:20:00Z',
      helpful_count: 32
    },
    {
      id: 'r5',
      user: { display_name: 'Karthik', avatar_url: null },
      rating: 5,
      content: 'One of the oldest temples in Chennai with beautiful architecture. The temple pond is well-maintained and the surroundings are peaceful.',
      created_at: '2025-02-15T11:30:00Z',
      helpful_count: 27
    }
  ],
  '4': [
    {
      id: 'r6',
      user: { display_name: 'Divya', avatar_url: null },
      rating: 4,
      title: 'Good Place to Work',
      content: 'Nice ambiance and good coffee. The Wi-Fi is reliable and there are enough power outlets. Gets a bit crowded in the evenings.',
      created_at: '2025-03-12T13:10:00Z',
      helpful_count: 12
    }
  ],
  '5': [
    {
      id: 'r7',
      user: { display_name: 'Vikram', avatar_url: null },
      rating: 4,
      title: 'Good Mall in Central Chennai',
      content: 'Express Avenue has a good mix of brands and restaurants. The cinema is good and the mall is well-maintained. Parking is convenient.',
      created_at: '2025-03-08T18:25:00Z',
      helpful_count: 19
    }
  ]
};

const PlaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<any>(id ? MOCK_PLACES[id as keyof typeof MOCK_PLACES] : null);
  const [reviews, setReviews] = useState<any[]>(id ? MOCK_REVIEWS[id as keyof typeof MOCK_REVIEWS] || [] : []);
  const [loading, setLoading] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? 'Removed from likes' : 'Added to likes',
      description: isLiked ? 'This place has been removed from your likes' : 'This place has been added to your likes',
    });
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? 'Removed from favorites' : 'Added to favorites',
      description: isSaved ? 'This place has been removed from your favorites' : 'This place has been added to your favorites',
    });
  };

  const handleShare = async () => {
    if (!place) return;
    
    const shareData = {
      title: place.name,
      text: place.description || `Check out ${place.name}!`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: 'Shared successfully',
          description: 'Place has been shared',
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied!',
          description: 'Place link has been copied to your clipboard.',
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link copied!',
          description: 'Place link has been copied to your clipboard.',
        });
      } catch (clipboardError) {
        console.error('Clipboard failed:', clipboardError);
        toast({
          title: 'Share failed',
          description: 'Could not share or copy link.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleVisit = async () => {
    if (!place) return;
    
    toast({
      title: 'Opening location',
      description: `Opening ${place.name} in maps`,
    });
    
    // Open in maps
    if (place.latitude && place.longitude) {
      const mapsUrl = `https://maps.google.com/maps?q=${place.latitude},${place.longitude}`;
      window.open(mapsUrl, '_blank');
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${place.name} ${place.address}`)}`;
      window.open(searchUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton title="Place Details" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBackButton title="Place Not Found" />
        <div className="flex flex-col items-center justify-center h-64 px-6">
          <h2 className="text-xl font-bold mb-2">Place Not Found</h2>
          <p className="text-muted-foreground text-center mb-4">
            This place may have been removed or doesn't exist.
          </p>
          <Button onClick={() => navigate('/')} className="btn-primary">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton />
      
      <main className="pb-24">
        {/* Hero Image */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={place.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'} 
            alt={place.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleLike}
              className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 border-2 ${
                isLiked 
                  ? 'bg-[hsl(var(--blitz-primary))] text-white border-white/30' 
                  : 'bg-black/40 text-white hover:bg-black/60 border-white/20'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-3 rounded-full backdrop-blur-md bg-black/40 text-white hover:bg-black/60 transition-all duration-300 border-2 border-white/20"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Category badge */}
          <div className="absolute bottom-4 left-4">
            <span className="badge-community">
              {place.category}
            </span>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{place.name}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{place.address}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6">
              {place.average_rating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-foreground">{place.average_rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({place.review_count} reviews)</span>
                </div>
              )}
              
              {place.price_level && (
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-bold text-foreground">
                    {'$'.repeat(place.price_level)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {place.description && (
            <div>
              <h3 className="font-bold text-lg mb-2">About</h3>
              <p className="text-body text-foreground leading-relaxed">
                {place.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {place.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hours */}
          {place.opening_hours && Object.keys(place.opening_hours).length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">Hours</h3>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">
                  {place.opening_hours.open === '24 hours' 
                    ? '24 hours' 
                    : `${place.opening_hours.open} - ${place.opening_hours.close}`}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleSave}
              variant="outline"
              className={`${isSaved ? 'bg-[hsl(var(--blitz-primary))]/10 text-[hsl(var(--blitz-primary))] border-[hsl(var(--blitz-primary))]/30' : ''}`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button onClick={handleVisit} className="btn-primary">
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit
            </Button>
          </div>

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Reviews ({reviews.length})</h3>
              <Button
                onClick={() => setShowAddReview(true)}
                size="sm"
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Review
              </Button>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="card-spotify rounded-2xl p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--blitz-primary))] to-[hsl(var(--blitz-secondary))] flex items-center justify-center text-white font-bold">
                          {review.user?.display_name?.[0] || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {review.user?.display_name || 'Anonymous User'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    {review.title && (
                      <h4 className="font-bold text-foreground">{review.title}</h4>
                    )}

                    {/* Content */}
                    <p className="text-body text-foreground leading-relaxed">
                      {review.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center space-x-4">
                        <button
                          className="flex items-center space-x-2 px-3 py-1 rounded-full transition-all text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 border-2 border-transparent"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="font-semibold">{review.helpful_count}</span>
                        </button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Was this helpful?
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No reviews yet</p>
                <Button onClick={() => setShowAddReview(true)} className="btn-primary">
                  Be the first to review
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Review Modal */}
      {showAddReview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Review {place.name}</h2>
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex justify-center space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className="w-8 h-8 text-gray-300"
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Tap to rate</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Title (optional)</label>
                <input
                  type="text"
                  placeholder="Summarize your experience"
                  className="w-full p-2 rounded-md border border-border bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Review</label>
                <textarea
                  placeholder="Share your experience with others..."
                  rows={4}
                  className="w-full p-2 rounded-md border border-border bg-background resize-none"
                ></textarea>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddReview(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 btn-primary"
                  onClick={() => {
                    setShowAddReview(false);
                    toast({
                      title: 'Review submitted',
                      description: 'Your review has been submitted successfully.',
                    });
                  }}
                >
                  Post Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceDetail;