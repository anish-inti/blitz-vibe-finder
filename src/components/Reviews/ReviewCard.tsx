import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react';
import { Review } from '@/hooks/use-reviews';
import { useReviews } from '@/hooks/use-reviews';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit, onDelete }) => {
  const { profile } = useAuth();
  const { voteOnReview, getUserVoteForReview } = useReviews();
  const [userVote, setUserVote] = useState<'helpful' | 'not_helpful' | null>(null);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count);

  useEffect(() => {
    if (profile) {
      loadUserVote();
    }
  }, [profile, review.id]);

  const loadUserVote = async () => {
    const { data } = await getUserVoteForReview(review.id);
    setUserVote(data?.vote_type || null);
  };

  const handleVote = async (voteType: 'helpful' | 'not_helpful') => {
    if (!profile) return;

    const previousVote = userVote;
    const { error } = await voteOnReview(review.id, voteType);
    
    if (!error) {
      if (previousVote === voteType) {
        // Removing vote
        setUserVote(null);
        if (voteType === 'helpful') {
          setHelpfulCount(prev => prev - 1);
        }
      } else {
        // Adding or changing vote
        setUserVote(voteType);
        if (voteType === 'helpful') {
          setHelpfulCount(prev => previousVote === 'not_helpful' ? prev + 1 : prev + 1);
        } else if (previousVote === 'helpful') {
          setHelpfulCount(prev => prev - 1);
        }
      }
    }
  };

  const isOwnReview = profile?.id === review.user_id;

  return (
    <div className="card-spotify rounded-2xl p-6 space-y-4">
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
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
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

          {/* Menu for own reviews */}
          {isOwnReview && (
            <Button variant="ghost" size="sm" className="p-1">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          )}
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

      {/* Images */}
      {review.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {review.images.slice(0, 4).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleVote('helpful')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all text-sm ${
              userVote === 'helpful'
                ? 'bg-[hsl(var(--blitz-primary))]/10 text-[hsl(var(--blitz-primary))] border-2 border-[hsl(var(--blitz-primary))]/30'
                : 'text-muted-foreground hover:text-[hsl(var(--blitz-primary))] hover:bg-[hsl(var(--blitz-primary))]/5 border-2 border-transparent'
            }`}
            disabled={!profile}
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="font-semibold">{helpfulCount}</span>
          </button>

          <button
            onClick={() => handleVote('not_helpful')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all text-sm ${
              userVote === 'not_helpful'
                ? 'bg-red-500/10 text-red-500 border-2 border-red-500/30'
                : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/5 border-2 border-transparent'
            }`}
            disabled={!profile}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-muted-foreground">
          Was this helpful?
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;