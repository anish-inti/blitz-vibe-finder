import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  metadata: Record<string, any>;
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
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            ...reviewData,
            user_id: profile.id,
            images: reviewData.images || [],
          },
        ])
        .select()
        .single();

      if (!error) {
        toast({
          title: 'Review added!',
          description: 'Your review has been posted successfully.',
        });
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const getReviewsForPlace = useCallback(async (placeId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users!reviews_user_id_fkey(display_name, avatar_url)
      `)
      .eq('place_id', placeId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  }, []);

  const getUserReviews = useCallback(async (userId?: string) => {
    if (!profile && !userId) return { data: [], error: new Error('User not authenticated') };

    const targetUserId = userId || profile?.id;
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        place:places!reviews_place_id_fkey(name, category, images)
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  }, [profile]);

  const updateReview = useCallback(async (reviewId: string, updates: Partial<Review>) => {
    if (!profile) return { data: null, error: new Error('User not authenticated') };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId)
        .eq('user_id', profile.id)
        .select()
        .single();

      if (!error) {
        toast({
          title: 'Review updated',
          description: 'Your review has been updated successfully.',
        });
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const deleteReview = useCallback(async (reviewId: string) => {
    if (!profile) return { error: new Error('User not authenticated') };

    setLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', profile.id);

      if (!error) {
        toast({
          title: 'Review deleted',
          description: 'Your review has been deleted successfully.',
        });
      }

      return { error };
    } catch (error) {
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
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('review_votes')
        .select('id, vote_type')
        .eq('review_id', reviewId)
        .eq('user_id', profile.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote if same type
          const { error } = await supabase
            .from('review_votes')
            .delete()
            .eq('id', existingVote.id);
          return { error };
        } else {
          // Update vote type
          const { error } = await supabase
            .from('review_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
          return { error };
        }
      } else {
        // Create new vote
        const { error } = await supabase
          .from('review_votes')
          .insert([
            {
              review_id: reviewId,
              user_id: profile.id,
              vote_type: voteType,
            },
          ]);
        return { error };
      }
    } catch (error) {
      return { error };
    }
  }, [profile]);

  const getUserVoteForReview = useCallback(async (reviewId: string) => {
    if (!profile) return { data: null, error: null };

    const { data, error } = await supabase
      .from('review_votes')
      .select('vote_type')
      .eq('review_id', reviewId)
      .eq('user_id', profile.id)
      .single();

    return { data, error };
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