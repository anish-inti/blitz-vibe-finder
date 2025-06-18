import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export type ActionType = 'like' | 'save' | 'review' | 'visit' | 'share';

// Mock storage for user actions
const userActionsStorage: Record<string, any[]> = {};

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a unique key for the user
      const userKey = profile.id;
      
      // Initialize user's actions array if it doesn't exist
      if (!userActionsStorage[userKey]) {
        userActionsStorage[userKey] = [];
      }
      
      // Check if action already exists
      const existingActionIndex = userActionsStorage[userKey].findIndex(
        action => action.place_id === placeId && action.action_type === actionType
      );
      
      if (existingActionIndex !== -1) {
        // Update existing action
        userActionsStorage[userKey][existingActionIndex].metadata = metadata;
      } else {
        // Create new action
        userActionsStorage[userKey].push({
          id: `action-${Date.now()}`,
          user_id: profile.id,
          place_id: placeId,
          action_type: actionType,
          metadata,
          created_at: new Date().toISOString(),
        });
        
        // Update user stats
        if (profile.stats) {
          if (actionType === 'save') profile.stats.places_saved++;
          if (actionType === 'visit') profile.stats.places_visited++;
          if (actionType === 'review') profile.stats.reviews_written++;
        }
      }
      
      toast({
        title: 'Action recorded',
        description: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} action recorded successfully.`,
      });
      
      return { error: null };
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a unique key for the user
      const userKey = profile.id;
      
      // Check if user has any actions
      if (userActionsStorage[userKey]) {
        // Find the action to remove
        const actionIndex = userActionsStorage[userKey].findIndex(
          action => action.place_id === placeId && action.action_type === actionType
        );
        
        if (actionIndex !== -1) {
          // Remove the action
          userActionsStorage[userKey].splice(actionIndex, 1);
          
          // Update user stats
          if (profile.stats) {
            if (actionType === 'save' && profile.stats.places_saved > 0) profile.stats.places_saved--;
            if (actionType === 'visit' && profile.stats.places_visited > 0) profile.stats.places_visited--;
            if (actionType === 'review' && profile.stats.reviews_written > 0) profile.stats.reviews_written--;
          }
          
          toast({
            title: 'Action removed',
            description: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} action removed successfully.`,
          });
        }
      }
      
      return { error: null };
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
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Create a unique key for the user
      const userKey = profile.id;
      
      // Get user's actions
      const actions = userActionsStorage[userKey] || [];
      
      // Filter by action type if specified
      const filteredActions = actionType 
        ? actions.filter(action => action.action_type === actionType)
        : actions;
      
      return { data: filteredActions, error: null };
    } catch (error) {
      console.error('Error getting user actions:', error);
      return { data: [], error };
    }
  }, [profile]);

  const checkUserAction = useCallback(async (placeId: string, actionType: ActionType) => {
    console.log('useUserActions: Checking user action:', { placeId, actionType });
    
    if (!profile) {
      console.log('useUserActions: No profile found for checkUserAction');
      return { exists: false, error: null };
    }
    
    try {
      // Create a unique key for the user
      const userKey = profile.id;
      
      // Check if user has any actions
      if (!userActionsStorage[userKey]) {
        return { exists: false, error: null };
      }
      
      // Check if action exists
      const exists = userActionsStorage[userKey].some(
        action => action.place_id === placeId && action.action_type === actionType
      );
      
      console.log('useUserActions: Action exists:', exists);
      
      return { exists, error: null };
    } catch (error) {
      console.error('Error checking user action:', error);
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