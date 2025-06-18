import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, MapPin, Clock, DollarSign, MessageCircle, Plus, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { usePlaces } from '@/hooks/use-places';
import { useReviews } from '@/hooks/use-reviews';
import { useUserActions } from '@/hooks/use-user-actions';
import { useAuth } from '@/contexts/AuthContext';
import ReviewCard from '@/components/Reviews/ReviewCard';
import AddReviewModal from '@/components/Reviews/AddReviewModal';
import { toast } from '@/hooks/use-toast';

const PlaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { getPlaceById } = usePlaces();
  const { getReviewsForPlace } = useReviews();
  const { recordAction, removeAction, checkUserAction } = useUserActions();
  
  const [place, setPlace] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      loadPlaceData();
      loadReviews();
      checkUserActions();
    }
  }, [id]);

  const loadPlaceData = async () => {
    if (!id) return;
    
    console.log('Loading place data for ID:', id);
    const { data, error } = await getPlaceById(id);
    if (error || !data) {
      console.error('Place not found:', error);
      toast({
        title: 'Place not found',
        description: 'This place may have been removed.',
        variant: 'destructive',
      });
      navigate('/');
    } else {
      console.log('Place loaded:', data);
      setPlace(data);
    }
    setLoading(false);
  };

  const loadReviews = async () => {
    if (!id) return;
    
    console.log('Loading reviews for place:', id);
    const { data } = await getReviewsForPlace(id);
    console.log('Reviews loaded:', data?.length || 0);
    setReviews(data || []);
  };

  const checkUserActions = async () => {
    if (!id || !profile) return;
    
    console.log('Checking user actions for place:', id);
    const [likeResult, saveResult] = await Promise.all([
      checkUserAction(id, 'like'),
      checkUserAction(id, 'save'),
    ]);
    
    console.log('User actions:', { liked: likeResult.exists, saved: saveResult.exists });
    setIsLiked(likeResult.exists);
    setIsSaved(saveResult.exists);
  };

  const handleLike = async () => {
    if (!profile || !place) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like places.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Toggling like for place:', place.id);
    if (isLiked) {
      await removeAction(place.id, 'like');
      setIsLiked(false);
    } else {
      await recordAction(place.id, 'like');
      setIsLiked(true);
    }
  };

  const handleSave = async () => {
    if (!profile || !place) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save places.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Toggling save for place:', place.id);
    if (isSaved) {
      await removeAction(place.id, 'save');
      setIsSaved(false);
    } else {
      await recordAction(place.id, 'save');
      setIsSaved(true);
    }
  };

  const handleShare = async () => {
    if (!place) return;
    
    console.log('Sharing place:', place.name);
    const shareData = {
      title: place.name,
      text: place.description || `Check out ${place.name} on Blitz!`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log('Native share successful');
        
        if (profile) {
          await recordAction(place.id, 'share');
        }
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        console.log('Copied to clipboard');
        toast({
          title: 'Link copied!',
          description: 'Place link has been copied to your clipboard.',
        });
        
        if (profile) {
          await recordAction(place.id, 'share');
        }
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
        
        if (profile) {
          await recordAction(place.id, 'share');
        }
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
    
    console.log('Visiting place:', place.name);
    
    if (profile) {
      await recordAction(place.id, 'visit');
    }
    
    // Open in maps
    if (place.latitude && place.longitude) {
      const mapsUrl = `https://maps.google.com/maps?q=${place.latitude},${place.longitude}`;
      console.log('Opening maps URL:', mapsUrl);
      window.open(mapsUrl, '_blank');
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${place.name} ${place.address}`)}`;
      console.log('Opening search URL:', searchUrl);
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
            src={place.images[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'} 
            alt={place.name}
            className="w-full h-full object-cover"
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
          {place.tags.length > 0 && (
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
                  {place.opening_hours.open} - {place.opening_hours.close}
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
                  <ReviewCard key={review.id} review={review} />
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
      <AddReviewModal
        open={showAddReview}
        onOpenChange={setShowAddReview}
        placeId={place.id}
        placeName={place.name}
        onReviewAdded={loadReviews}
      />
    </div>
  );
};

export default PlaceDetail;