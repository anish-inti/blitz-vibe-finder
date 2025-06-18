import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  place_id: string;
  user_id: string;
  rating: number;
  title?: string;
  content: string;
  images: string[];
  helpful_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: {
    display_name?: string;
    avatar_url?: string;
  };
}

export interface ReviewVote {
  id: string;
  review_id: string;
  user_id: string;
  vote_type: 'helpful' | 'not_helpful';
  created_at: string;
}

// Mock storage for reviews and votes
const reviewsStorage: Record<string, Review[]> = {};
const votesStorage: Record<string, ReviewVote[]> = {};

export const useReviews = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const addReview = useCallback(async (reviewData: {
    place_id: string;
    rating: number;
    title?: string;
    content: string;
    images?: string[];
  }) => {
    if (!profile) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to write reviews.',
        variant: 'destructive',
      });
      return { data: null, error: new Error('User not authenticated') };
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new review
      const newReview: Review = {
        id: `review-${Date.now()}`,
        place_id: reviewData.place_id,
        user_id: profile.id,
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        images: reviewData.images || [],
        helpful_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
        },
      };
      
      // Initialize place's reviews array if it doesn't exist
      if (!reviewsStorage[reviewData.place_id]) {
        reviewsStorage[reviewData.place_id] = [];
      }
      
      // Add the review
      reviewsStorage[reviewData.place_id].push(newReview);
      
      // Update user stats
      if (profile.stats) {
        profile.stats.reviews_written++;
      }
      
      toast({
        title: 'Review added!',
        description: 'Your review has been posted successfully.',
      });
      
      return { data: newReview, error: null };
    } catch (error) {
      console.error('Error adding review:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const getReviewsForPlace = useCallback(async (placeId: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get place's reviews
      const reviews = reviewsStorage[placeId] || [];
      
      return { data: reviews, error: null };
    } catch (error) {
      console.error('Error getting reviews for place:', error);
      return { data: [], error };
    }
  }, []);

  const getUserReviews = useCallback(async (userId?: string) => {
    if (!profile && !userId) return { data: [], error: new Error('User not authenticated') };

    const targetUserId = userId || profile?.id;
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get all reviews
      const allReviews: Review[] = [];
      Object.values(reviewsStorage).forEach(placeReviews => {
        allReviews.push(...placeReviews);
      });
      
      // Filter by user ID
      const userReviews = allReviews.filter(review => review.user_id === targetUserId);
      
      return { data: userReviews, error: null };
    } catch (error) {
      console.error('Error getting user reviews:', error);
      return { data: [], error };
    }
  }, [profile]);

  const updateReview = useCallback(async (reviewId: string, updates: Partial<Review>) => {
    if (!profile) return { data: null, error: new Error('User not authenticated') };

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the review
      let updatedReview: Review | null = null;
      
      // Check all places
      for (const placeId in reviewsStorage) {
        const reviewIndex = reviewsStorage[placeId].findIndex(review => review.id === reviewId);
        
        if (reviewIndex !== -1) {
          // Check if user owns the review
          if (reviewsStorage[placeId][reviewIndex].user_id !== profile.id) {
            return { data: null, error: new Error('You can only update your own reviews') };
          }
          
          // Update the review
          reviewsStorage[placeId][reviewIndex] = {
            ...reviewsStorage[placeId][reviewIndex],
            ...updates,
            updated_at: new Date().toISOString(),
          };
          
          updatedReview = reviewsStorage[placeId][reviewIndex];
          break;
        }
      }
      
      if (!updatedReview) {
        return { data: null, error: new Error('Review not found') };
      }
      
      toast({
        title: 'Review updated',
        description: 'Your review has been updated successfully.',
      });
      
      return { data: updatedReview, error: null };
    } catch (error) {
      console.error('Error updating review:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const deleteReview = useCallback(async (reviewId: string) => {
    if (!profile) return { error: new Error('User not authenticated') };

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the review
      let deleted = false;
      
      // Check all places
      for (const placeId in reviewsStorage) {
        const reviewIndex = reviewsStorage[placeId].findIndex(review => review.id === reviewId);
        
        if (reviewIndex !== -1) {
          // Check if user owns the review
          if (reviewsStorage[placeId][reviewIndex].user_id !== profile.id) {
            return { error: new Error('You can only delete your own reviews') };
          }
          
          // Delete the review
          reviewsStorage[placeId].splice(reviewIndex, 1);
          deleted = true;
          
          // Update user stats
          if (profile.stats && profile.stats.reviews_written > 0) {
            profile.stats.reviews_written--;
          }
          
          break;
        }
      }
      
      if (!deleted) {
        return { error: new Error('Review not found') };
      }
      
      toast({
        title: 'Review deleted',
        description: 'Your review has been deleted successfully.',
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting review:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const voteOnReview = useCallback(async (reviewId: string, voteType: 'helpful' | 'not_helpful') => {
    if (!profile) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to vote on reviews.',
        variant: 'destructive',
      });
      return { error: new Error('User not authenticated') };
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Initialize votes array if it doesn't exist
      if (!votesStorage[reviewId]) {
        votesStorage[reviewId] = [];
      }
      
      // Check if user already voted
      const existingVoteIndex = votesStorage[reviewId].findIndex(vote => vote.user_id === profile.id);
      
      if (existingVoteIndex !== -1) {
        const existingVote = votesStorage[reviewId][existingVoteIndex];
        
        if (existingVote.vote_type === voteType) {
          // Remove vote if same type
          votesStorage[reviewId].splice(existingVoteIndex, 1);
        } else {
          // Update vote type
          votesStorage[reviewId][existingVoteIndex].vote_type = voteType;
        }
      } else {
        // Create new vote
        votesStorage[reviewId].push({
          id: `vote-${Date.now()}`,
          review_id: reviewId,
          user_id: profile.id,
          vote_type: voteType,
          created_at: new Date().toISOString(),
        });
      }
      
      // Update helpful count for the review
      for (const placeId in reviewsStorage) {
        const reviewIndex = reviewsStorage[placeId].findIndex(review => review.id === reviewId);
        
        if (reviewIndex !== -1) {
          // Count helpful votes
          const helpfulCount = votesStorage[reviewId]?.filter(vote => vote.vote_type === 'helpful').length || 0;
          
          // Update review
          reviewsStorage[placeId][reviewIndex].helpful_count = helpfulCount;
          break;
        }
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error voting on review:', error);
      return { error };
    }
  }, [profile]);

  const getUserVoteForReview = useCallback(async (reviewId: string) => {
    if (!profile) return { data: null, error: null };

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if user voted on this review
      const vote = votesStorage[reviewId]?.find(vote => vote.user_id === profile.id);
      
      return { data: vote || null, error: null };
    } catch (error) {
      console.error('Error getting user vote for review:', error);
      return { data: null, error };
    }
  }, [profile]);

  return {
    loading,
    addReview,
    getReviewsForPlace,
    getUserReviews,
    updateReview,
    deleteReview,
    voteOnReview,
    getUserVoteForReview,
  };
};