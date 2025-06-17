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
      // Check if action already exists
      const { data: existingAction } = await supabase
        .from('user_actions')
        .select('id')
        .eq('user_id', profile.id)
        .eq('place_id', placeId)
        .eq('action_type', actionType)
        .single();

      if (existingAction) {
        // Update existing action
        const { error } = await supabase
          .from('user_actions')
          .update({ metadata })
          .eq('id', existingAction.id);

        return { error };
      } else {
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

        if (!error) {
          // Update user stats
          const newStats = { ...profile.stats };
          if (actionType === 'save') newStats.places_saved++;
          if (actionType === 'visit') newStats.places_visited++;
          if (actionType === 'review') newStats.reviews_written++;

          await supabase
            .from('users')
            .update({ stats: newStats })
            .eq('id', profile.id);
        }

        return { error };
      }
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const removeAction = useCallback(async (placeId: string, actionType: ActionType) => {
    if (!profile) return { error: new Error('User not authenticated') };

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_actions')
        .delete()
        .eq('user_id', profile.id)
        .eq('place_id', placeId)
        .eq('action_type', actionType);

      if (!error) {
        // Update user stats
        const newStats = { ...profile.stats };
        if (actionType === 'save' && newStats.places_saved > 0) newStats.places_saved--;
        if (actionType === 'visit' && newStats.places_visited > 0) newStats.places_visited--;
        if (actionType === 'review' && newStats.reviews_written > 0) newStats.reviews_written--;

        await supabase
          .from('users')
          .update({ stats: newStats })
          .eq('id', profile.id);
      }

      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const getUserActions = useCallback(async (actionType?: ActionType) => {
    if (!profile) return { data: [], error: new Error('User not authenticated') };

    let query = supabase
      .from('user_actions')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (actionType) {
      query = query.eq('action_type', actionType);
    }

    const { data, error } = await query;
    return { data: data || [], error };
  }, [profile]);

  const checkUserAction = useCallback(async (placeId: string, actionType: ActionType) => {
    if (!profile) return { exists: false, error: null };

    const { data, error } = await supabase
      .from('user_actions')
      .select('id')
      .eq('user_id', profile.id)
      .eq('place_id', placeId)
      .eq('action_type', actionType)
      .single();

    return { exists: !!data, error };
  }, [profile]);

  return {
    loading,
    recordAction,
    removeAction,
    getUserActions,
    checkUserAction,
  };
};