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
    console.log('useUserActions: Recording action:', { placeId, actionType, metadata });
    
    if (!profile) {
      console.log('useUserActions: No profile found, showing auth toast');
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
      const { data: existingAction, error: checkError } = await supabase
        .from('user_actions')
        .select('id')
        .eq('user_id', profile.id)
        .eq('place_id', placeId)
        .eq('action_type', actionType)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('useUserActions: Error checking existing action:', checkError);
        return { error: checkError };
      }

      if (existingAction) {
        console.log('useUserActions: Action already exists, updating metadata');
        // Update existing action
        const { error } = await supabase
          .from('user_actions')
          .update({ metadata })
          .eq('id', existingAction.id);

        return { error };
      } else {
        console.log('useUserActions: Creating new action');
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
          console.log('useUserActions: Action recorded successfully');
          // Update user stats
          const newStats = { ...profile.stats };
          if (actionType === 'save') newStats.places_saved++;
          if (actionType === 'visit') newStats.places_visited++;
          if (actionType === 'review') newStats.reviews_written++;

          await supabase
            .from('users')
            .update({ stats: newStats })
            .eq('id', profile.id);
        } else {
          console.error('useUserActions: Error recording action:', error);
        }

        return { error };
      }
    } catch (error) {
      console.error('useUserActions: Exception in recordAction:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const removeAction = useCallback(async (placeId: string, actionType: ActionType) => {
    console.log('useUserActions: Removing action:', { placeId, actionType });
    
    if (!profile) {
      console.error('useUserActions: No profile found for removeAction');
      return { error: new Error('User not authenticated') };
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_actions')
        .delete()
        .eq('user_id', profile.id)
        .eq('place_id', placeId)
        .eq('action_type', actionType);

      if (!error) {
        console.log('useUserActions: Action removed successfully');
        // Update user stats
        const newStats = { ...profile.stats };
        if (actionType === 'save' && newStats.places_saved > 0) newStats.places_saved--;
        if (actionType === 'visit' && newStats.places_visited > 0) newStats.places_visited--;
        if (actionType === 'review' && newStats.reviews_written > 0) newStats.reviews_written--;

        await supabase
          .from('users')
          .update({ stats: newStats })
          .eq('id', profile.id);
      } else {
        console.error('useUserActions: Error removing action:', error);
      }

      return { error };
    } catch (error) {
      console.error('useUserActions: Exception in removeAction:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const getUserActions = useCallback(async (actionType?: ActionType) => {
    console.log('useUserActions: Getting user actions:', { actionType });
    
    if (!profile) {
      console.error('useUserActions: No profile found for getUserActions');
      return { data: [], error: new Error('User not authenticated') };
    }

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
      console.error('useUserActions: Error getting user actions:', error);
    } else {
      console.log('useUserActions: User actions retrieved successfully:', data?.length || 0);
    }
    
    return { data: data || [], error };
  }, [profile]);

  const checkUserAction = useCallback(async (placeId: string, actionType: ActionType) => {
    console.log('useUserActions: Checking user action:', { placeId, actionType });
    
    if (!profile) {
      console.log('useUserActions: No profile found for checkUserAction');
      return { exists: false, error: null };
    }

    const { data, error } = await supabase
      .from('user_actions')
      .select('id')
      .eq('user_id', profile.id)
      .eq('place_id', placeId)
      .eq('action_type', actionType)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('useUserActions: Error checking user action:', error);
    }

    const exists = !!data;
    console.log('useUserActions: Action exists:', exists);
    
    return { exists, error: error?.code === 'PGRST116' ? null : error };
  }, [profile]);

  return {
    loading,
    recordAction,
    removeAction,
    getUserActions,
    checkUserAction,
  };
};