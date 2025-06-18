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

// Mock data for places
const MOCK_PLACES: Place[] = [
  {
    id: '1',
    name: 'Marina Beach',
    address: 'Marina Beach Rd, Chennai',
    category: 'Beach',
    description: 'Famous beach in Chennai perfect for evening walks',
    tags: ['Outdoor', 'Scenic', 'Family-friendly'],
    opening_hours: {},
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'],
    is_verified: true,
    average_rating: 4.2,
    review_count: 1250,
    like_count: 350,
    save_count: 180,
    visit_count: 420,
    share_count: 95,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Phoenix MarketCity',
    address: 'Velachery, Chennai',
    category: 'Shopping Mall',
    description: 'Popular shopping and entertainment destination',
    tags: ['Shopping', 'Entertainment', 'Food'],
    opening_hours: {},
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'],
    is_verified: true,
    average_rating: 4.4,
    review_count: 890,
    like_count: 210,
    save_count: 150,
    visit_count: 380,
    share_count: 75,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Kapaleeshwarar Temple',
    address: 'Mylapore, Chennai',
    category: 'Temple',
    description: 'Historic temple with beautiful architecture',
    tags: ['Historic', 'Cultural', 'Spiritual'],
    opening_hours: {},
    images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop'],
    is_verified: true,
    average_rating: 4.6,
    review_count: 2100,
    like_count: 420,
    save_count: 280,
    visit_count: 560,
    share_count: 130,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

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
      console.error('Error adding place:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const getPlaces = useCallback(async (filters: PlaceFilters = {}) => {
    try {
      // Try to fetch from database first
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
      
      if (error) {
        console.warn('Database query failed, using mock data:', error);
        // Filter mock data based on filters
        let filteredData = [...MOCK_PLACES];
        
        if (filters.category) {
          filteredData = filteredData.filter(place => 
            place.category.toLowerCase().includes(filters.category!.toLowerCase())
          );
        }
        
        if (filters.search) {
          filteredData = filteredData.filter(place => 
            place.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
            place.description?.toLowerCase().includes(filters.search!.toLowerCase()) ||
            place.address.toLowerCase().includes(filters.search!.toLowerCase())
          );
        }
        
        return { data: filteredData, error: null };
      }

      return { data: data || [], error };
    } catch (error) {
      console.warn('Error fetching places, using mock data:', error);
      return { data: MOCK_PLACES, error: null };
    }
  }, []);

  const getPlaceById = useCallback(async (placeId: string) => {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('id', placeId)
        .single();

      if (error) {
        // Fallback to mock data
        const mockPlace = MOCK_PLACES.find(place => place.id === placeId);
        return { data: mockPlace || null, error: mockPlace ? null : error };
      }

      return { data, error };
    } catch (error) {
      console.warn('Error fetching place by ID, using mock data:', error);
      const mockPlace = MOCK_PLACES.find(place => place.id === placeId);
      return { data: mockPlace || null, error: mockPlace ? null : error };
    }
  }, []);

  const getTrendingPlaces = useCallback(async (limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('like_count', { ascending: false })
        .order('average_rating', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Error fetching trending places, using mock data:', error);
        return { data: MOCK_PLACES.slice(0, limit), error: null };
      }

      return { data: data || [], error };
    } catch (error) {
      console.warn('Error fetching trending places, using mock data:', error);
      return { data: MOCK_PLACES.slice(0, limit), error: null };
    }
  }, []);

  const getCommunityFavorites = useCallback(async (limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .gte('average_rating', 4.0)
        .gte('review_count', 5)
        .order('save_count', { ascending: false })
        .order('average_rating', { ascending: false })
        .limit(limit);

      if (error) {
        console.warn('Error fetching community favorites, using mock data:', error);
        return { data: MOCK_PLACES.slice(0, limit), error: null };
      }

      return { data: data || [], error };
    } catch (error) {
      console.warn('Error fetching community favorites, using mock data:', error);
      return { data: MOCK_PLACES.slice(0, limit), error: null };
    }
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
      console.error('Error updating place:', error);
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