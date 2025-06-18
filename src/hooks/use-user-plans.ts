import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface UserPlan {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  place_ids: string[];
  occasion?: string;
  timing?: string;
  locality: number;
  is_public: boolean;
  share_token: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Mock storage for user plans
const userPlansStorage: Record<string, UserPlan[]> = {};
const shareTokensMap: Record<string, string> = {};

export const useUserPlans = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const savePlan = useCallback(async (planData: {
    title: string;
    description?: string;
    place_ids: string[];
    occasion?: string;
    timing?: Date;
    locality?: number;
    is_public?: boolean;
    metadata?: Record<string, any>;
  }) => {
    if (!profile) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save your plans.',
        variant: 'destructive',
      });
      return { data: null, error: new Error('User not authenticated') };
    }

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a unique share token
      const shareToken = `share-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      // Create a new plan
      const newPlan: UserPlan = {
        id: `plan-${Date.now()}`,
        user_id: profile.id,
        title: planData.title,
        description: planData.description,
        place_ids: planData.place_ids,
        occasion: planData.occasion,
        timing: planData.timing?.toISOString(),
        locality: planData.locality || 5,
        is_public: planData.is_public || false,
        share_token: shareToken,
        metadata: planData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Initialize user's plans array if it doesn't exist
      if (!userPlansStorage[profile.id]) {
        userPlansStorage[profile.id] = [];
      }
      
      // Add the plan
      userPlansStorage[profile.id].push(newPlan);
      
      // Map share token to plan ID
      shareTokensMap[shareToken] = newPlan.id;
      
      toast({
        title: 'Plan saved!',
        description: `"${planData.title}" has been saved to your plans.`,
      });
      
      return { data: newPlan, error: null };
    } catch (error) {
      console.error('Error saving plan:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const updatePlan = useCallback(async (planId: string, updates: Partial<UserPlan>) => {
    if (!profile) return { data: null, error: new Error('User not authenticated') };

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user has any plans
      if (!userPlansStorage[profile.id]) {
        return { data: null, error: new Error('No plans found') };
      }
      
      // Find the plan to update
      const planIndex = userPlansStorage[profile.id].findIndex(plan => plan.id === planId);
      
      if (planIndex === -1) {
        return { data: null, error: new Error('Plan not found') };
      }
      
      // Update the plan
      const updatedPlan = {
        ...userPlansStorage[profile.id][planIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      // Save the updated plan
      userPlansStorage[profile.id][planIndex] = updatedPlan;
      
      // Update share token mapping if it changed
      if (updates.share_token && updates.share_token !== userPlansStorage[profile.id][planIndex].share_token) {
        delete shareTokensMap[userPlansStorage[profile.id][planIndex].share_token];
        shareTokensMap[updates.share_token] = planId;
      }
      
      toast({
        title: 'Plan updated',
        description: 'Your plan has been updated successfully.',
      });
      
      return { data: updatedPlan, error: null };
    } catch (error) {
      console.error('Error updating plan:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const deletePlan = useCallback(async (planId: string) => {
    if (!profile) return { error: new Error('User not authenticated') };

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user has any plans
      if (!userPlansStorage[profile.id]) {
        return { error: new Error('No plans found') };
      }
      
      // Find the plan to delete
      const planIndex = userPlansStorage[profile.id].findIndex(plan => plan.id === planId);
      
      if (planIndex === -1) {
        return { error: new Error('Plan not found') };
      }
      
      // Remove share token mapping
      delete shareTokensMap[userPlansStorage[profile.id][planIndex].share_token];
      
      // Delete the plan
      userPlansStorage[profile.id].splice(planIndex, 1);
      
      toast({
        title: 'Plan deleted',
        description: 'Your plan has been deleted successfully.',
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting plan:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const getUserPlans = useCallback(async () => {
    if (!profile) return { data: [], error: new Error('User not authenticated') };

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get user's plans
      const plans = userPlansStorage[profile.id] || [];
      
      // Sort by created date (newest first)
      plans.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      return { data: plans, error: null };
    } catch (error) {
      console.error('Error getting user plans:', error);
      return { data: [], error };
    }
  }, [profile]);

  const getPlanByShareToken = useCallback(async (shareToken: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get plan ID from share token
      const planId = shareTokensMap[shareToken];
      
      if (!planId) {
        return { data: null, error: new Error('Plan not found') };
      }
      
      // Find the plan
      let plan: UserPlan | null = null;
      
      // Check all users' plans
      for (const userId in userPlansStorage) {
        const foundPlan = userPlansStorage[userId].find(p => p.id === planId);
        
        if (foundPlan) {
          // Check if plan is public
          if (!foundPlan.is_public) {
            return { data: null, error: new Error('Plan is not public') };
          }
          
          plan = foundPlan;
          break;
        }
      }
      
      if (!plan) {
        return { data: null, error: new Error('Plan not found') };
      }
      
      return { data: plan, error: null };
    } catch (error) {
      console.error('Error getting plan by share token:', error);
      return { data: null, error };
    }
  }, []);

  const generateShareLink = useCallback((plan: UserPlan) => {
    return `${window.location.origin}/plan/${plan.share_token}`;
  }, []);

  return {
    loading,
    savePlan,
    updatePlan,
    deletePlan,
    getUserPlans,
    getPlanByShareToken,
    generateShareLink,
  };
};