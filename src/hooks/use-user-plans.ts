import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      const { data, error } = await supabase
        .from('user_plans')
        .insert([
          {
            user_id: profile.id,
            title: planData.title,
            description: planData.description,
            place_ids: planData.place_ids,
            occasion: planData.occasion,
            timing: planData.timing?.toISOString(),
            locality: planData.locality || 5,
            is_public: planData.is_public || false,
            metadata: planData.metadata || {},
          },
        ])
        .select()
        .single();

      if (!error) {
        toast({
          title: 'Plan saved!',
          description: `"${planData.title}" has been saved to your plans.`,
        });
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const updatePlan = useCallback(async (planId: string, updates: Partial<UserPlan>) => {
    if (!profile) return { data: null, error: new Error('User not authenticated') };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_plans')
        .update(updates)
        .eq('id', planId)
        .eq('user_id', profile.id)
        .select()
        .single();

      if (!error) {
        toast({
          title: 'Plan updated',
          description: 'Your plan has been updated successfully.',
        });
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const deletePlan = useCallback(async (planId: string) => {
    if (!profile) return { error: new Error('User not authenticated') };

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', profile.id);

      if (!error) {
        toast({
          title: 'Plan deleted',
          description: 'Your plan has been deleted successfully.',
        });
      }

      return { error };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const getUserPlans = useCallback(async () => {
    if (!profile) return { data: [], error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  }, [profile]);

  const getPlanByShareToken = useCallback(async (shareToken: string) => {
    const { data, error } = await supabase
      .from('user_plans')
      .select('*')
      .eq('share_token', shareToken)
      .eq('is_public', true)
      .single();

    return { data, error };
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