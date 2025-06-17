import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Place {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  category: string;
  description?: string;
  tags: string[];
  opening_hours: Record<string, any>;
  price_level?: number;
  images: string[];
  added_by?: string;
  is_verified: boolean;
  average_rating: number;
  review_count: number;
  like_count: number;
  save_count: number;
  visit_count: number;
  share_count: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PlaceFilters {
  category?: string;
  tags?: string[];
  price_level?: number;
  min_rating?: number;
  search?: string;
  sort_by?: 'created_at' | 'average_rating' | 'review_count' | 'like_count';
  sort_order?: 'asc' | 'desc';
  limit?: number;
}

export const usePlaces = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const addPlace = useCallback(async (placeData: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    category: string;
    description?: string;
    tags?: string[];
    opening_hours?: Record<string, any>;
    price_level?: number;
    images?: string[];
  }) => {
    if (!profile) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add places.',
        variant: 'destructive',
      });
      return { data: null, error: new Error('User not authenticated') };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('places')
        .insert([
          {
            ...placeData,
            added_by: profile.id,
            tags: placeData.tags || [],
            opening_hours: placeData.opening_hours || {},
            images: placeData.images || [],
          },
        ])
        .select()
        .single();

      if (!error) {
        toast({
          title: 'Place added!',
          description: `"${placeData.name}" has been added successfully.`,
        });
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const getPlaces = useCallback(async (filters: PlaceFilters = {}) => {
    let query = supabase
      .from('places')
      .select('*');

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    if (filters.price_level) {
      query = query.eq('price_level', filters.price_level);
    }

    if (filters.min_rating) {
      query = query.gte('average_rating', filters.min_rating);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
    }

    // Apply sorting
    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply limit
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    return { data: data || [], error };
  }, []);

  const getPlaceById = useCallback(async (placeId: string) => {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', placeId)
      .single();

    return { data, error };
  }, []);

  const getTrendingPlaces = useCallback(async (limit: number = 10) => {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('like_count', { ascending: false })
      .order('average_rating', { ascending: false })
      .limit(limit);

    return { data: data || [], error };
  }, []);

  const getCommunityFavorites = useCallback(async (limit: number = 10) => {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .gte('average_rating', 4.0)
      .gte('review_count', 5)
      .order('save_count', { ascending: false })
      .order('average_rating', { ascending: false })
      .limit(limit);

    return { data: data || [], error };
  }, []);

  const updatePlace = useCallback(async (placeId: string, updates: Partial<Place>) => {
    if (!profile) return { data: null, error: new Error('User not authenticated') };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('places')
        .update(updates)
        .eq('id', placeId)
        .eq('added_by', profile.id)
        .select()
        .single();

      if (!error) {
        toast({
          title: 'Place updated',
          description: 'Place has been updated successfully.',
        });
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  return {
    loading,
    addPlace,
    getPlaces,
    getPlaceById,
    getTrendingPlaces,
    getCommunityFavorites,
    updatePlace,
  };
};