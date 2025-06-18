import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export type ActionType = 'like' | 'save' | 'review' | 'visit' | 'share';

interface UserAction {
  id: string;
  user_id: string;
  place_id: string;
  action_type: ActionType;
  metadata: Record<string, any>;
  created_at: string;
}

export const useUserActions = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const recordAction = useCallback(async (
    placeId: string,
    actionType: ActionType,
    metadata: Record<string, any> = {}
  ) => {
    if (!profile) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save your preferences.',
        variant: 'destructive',
      });
      return { error: new Error('User not authenticated') };
    }

    setLoading(true);
    try {
      console.log('Recording action:', { placeId, actionType, userId: profile.id });
      
      // Check if action already exists
      const { data: existingAction } = await supabase
        .from('user_actions')
        .select('id')
        .eq('user_id', profile.id)
        .eq('place_id', placeId)
        .eq('action_type', actionType)
        .single();

      if (existingAction) {
        console.log('Action already exists, updating metadata');
        // Update existing action
        const { error } = await supabase
          .from('user_actions')
          .update({ metadata })
          .eq('id', existingAction.id);

        if (error) {
          console.error('Error updating action:', error);
        } else {
          console.log('Action updated successfully');
        }

        return { error };
      } else {
        console.log('Creating new action');
        // Create new action
        const { error } = await supabase
          .from('user_actions')
          .insert([
            {
              user_id: profile.id,
              place_id: placeId,
              action_type: actionType,
              metadata,
            },
          ]);

        if (error) {
          console.error('Error creating action:', error);
          toast({
            title: 'Action failed',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          console.log('Action recorded successfully');
          
          // Update user stats
          const newStats = { ...profile.stats };
          if (actionType === 'save') newStats.places_saved++;
          if (actionType === 'visit') newStats.places_visited++;
          if (actionType === 'review') newStats.reviews_written++;

          await supabase
            .from('users')
            .update({ stats: newStats })
            .eq('id', profile.id);

          // Show success message
          const actionMessages = {
            like: 'Place liked!',
            save: 'Place saved to your favorites!',
            visit: 'Visit recorded!',
            share: 'Place shared!',
            review: 'Review submitted!'
          };

          toast({
            title: actionMessages[actionType],
            description: 'Your action has been recorded.',
          });
        }

        return { error };
      }
    } catch (error) {
      console.error('Exception recording action:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const removeAction = useCallback(async (placeId: string, actionType: ActionType) => {
    if (!profile) return { error: new Error('User not authenticated') };

    setLoading(true);
    try {
      console.log('Removing action:', { placeId, actionType, userId: profile.id });
      
      const { error } = await supabase
        .from('user_actions')
        .delete()
        .eq('user_id', profile.id)
        .eq('place_id', placeId)
        .eq('action_type', actionType);

      if (error) {
        console.error('Error removing action:', error);
        toast({
          title: 'Action failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('Action removed successfully');
        
        // Update user stats
        const newStats = { ...profile.stats };
        if (actionType === 'save' && newStats.places_saved > 0) newStats.places_saved--;
        if (actionType === 'visit' && newStats.places_visited > 0) newStats.places_visited--;
        if (actionType === 'review' && newStats.reviews_written > 0) newStats.reviews_written--;

        await supabase
          .from('users')
          .update({ stats: newStats })
          .eq('id', profile.id);

        // Show success message
        const actionMessages = {
          like: 'Like removed',
          save: 'Removed from favorites',
          visit: 'Visit removed',
          share: 'Share removed',
          review: 'Review removed'
        };

        toast({
          title: actionMessages[actionType],
          description: 'Your action has been removed.',
        });
      }

      return { error };
    } catch (error) {
      console.error('Exception removing action:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const getUserActions = useCallback(async (actionType?: ActionType) => {
    if (!profile) return { data: [], error: new Error('User not authenticated') };

    try {
      console.log('Fetching user actions:', { userId: profile.id, actionType });
      
      let query = supabase
        .from('user_actions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (actionType) {
        query = query.eq('action_type', actionType);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching user actions:', error);
      } else {
        console.log('User actions fetched:', data?.length || 0);
      }
      
      return { data: data || [], error };
    } catch (error) {
      console.error('Exception fetching user actions:', error);
      return { data: [], error };
    }
  }, [profile]);

  const checkUserAction = useCallback(async (placeId: string, actionType: ActionType) => {
    if (!profile) return { exists: false, error: null };

    try {
      const { data, error } = await supabase
        .from('user_actions')
        .select('id')
        .eq('user_id', profile.id)
        .eq('place_id', placeId)
        .eq('action_type', actionType)
        .single();

      return { exists: !!data, error };
    } catch (error) {
      return { exists: false, error };
    }
  }, [profile]);

  return {
    loading,
    recordAction,
    removeAction,
    getUserActions,
    checkUserAction,
  };
};