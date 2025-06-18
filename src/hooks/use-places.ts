import { useState, useCallback } from 'react';
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

// Mock storage for places
const placesStorage: Record<string, Place> = {};
MOCK_PLACES.forEach(place => {
  placesStorage[place.id] = place;
});

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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new place
      const newPlace: Place = {
        id: `place-${Date.now()}`,
        name: placeData.name,
        address: placeData.address,
        latitude: placeData.latitude,
        longitude: placeData.longitude,
        category: placeData.category,
        description: placeData.description,
        tags: placeData.tags || [],
        opening_hours: placeData.opening_hours || {},
        price_level: placeData.price_level,
        images: placeData.images || [],
        added_by: profile.id,
        is_verified: false,
        average_rating: 0,
        review_count: 0,
        like_count: 0,
        save_count: 0,
        visit_count: 0,
        share_count: 0,
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Add the place to storage
      placesStorage[newPlace.id] = newPlace;
      
      toast({
        title: 'Place added!',
        description: `"${placeData.name}" has been added successfully.`,
      });
      
      return { data: newPlace, error: null };
    } catch (error) {
      console.error('Error adding place:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const getPlaces = useCallback(async (filters: PlaceFilters = {}) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get all places
      let places = Object.values(placesStorage);
      
      // Apply filters
      if (filters.category) {
        places = places.filter(place => 
          place.category.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }
      
      if (filters.tags && filters.tags.length > 0) {
        places = places.filter(place => 
          filters.tags!.some(tag => place.tags.includes(tag))
        );
      }
      
      if (filters.price_level) {
        places = places.filter(place => place.price_level === filters.price_level);
      }
      
      if (filters.min_rating) {
        places = places.filter(place => place.average_rating >= filters.min_rating!);
      }
      
      if (filters.search) {
        places = places.filter(place => 
          place.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          place.description?.toLowerCase().includes(filters.search!.toLowerCase()) ||
          place.address.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      
      // Apply sorting
      const sortBy = filters.sort_by || 'created_at';
      const sortOrder = filters.sort_order || 'desc';
      
      places.sort((a, b) => {
        let valueA: any = a[sortBy as keyof Place];
        let valueB: any = b[sortBy as keyof Place];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
        
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      });
      
      // Apply limit
      if (filters.limit) {
        places = places.slice(0, filters.limit);
      }
      
      return { data: places, error: null };
    } catch (error) {
      console.error('Error getting places:', error);
      return { data: [], error };
    }
  }, []);

  const getPlaceById = useCallback(async (placeId: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get place by ID
      const place = placesStorage[placeId];
      
      if (!place) {
        return { data: null, error: new Error('Place not found') };
      }
      
      return { data: place, error: null };
    } catch (error) {
      console.error('Error getting place by ID:', error);
      return { data: null, error };
    }
  }, []);

  const getTrendingPlaces = useCallback(async (limit: number = 10) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get all places
      let places = Object.values(placesStorage);
      
      // Sort by like count and average rating
      places.sort((a, b) => {
        if (b.like_count !== a.like_count) {
          return b.like_count - a.like_count;
        }
        return b.average_rating - a.average_rating;
      });
      
      // Apply limit
      places = places.slice(0, limit);
      
      return { data: places, error: null };
    } catch (error) {
      console.error('Error getting trending places:', error);
      return { data: [], error };
    }
  }, []);

  const getCommunityFavorites = useCallback(async (limit: number = 10) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get all places
      let places = Object.values(placesStorage);
      
      // Filter by rating and review count
      places = places.filter(place => place.average_rating >= 4.0 && place.review_count >= 5);
      
      // Sort by save count and average rating
      places.sort((a, b) => {
        if (b.save_count !== a.save_count) {
          return b.save_count - a.save_count;
        }
        return b.average_rating - a.average_rating;
      });
      
      // Apply limit
      places = places.slice(0, limit);
      
      return { data: places, error: null };
    } catch (error) {
      console.error('Error getting community favorites:', error);
      return { data: [], error };
    }
  }, []);

  const updatePlace = useCallback(async (placeId: string, updates: Partial<Place>) => {
    if (!profile) return { data: null, error: new Error('User not authenticated') };

    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get place by ID
      const place = placesStorage[placeId];
      
      if (!place) {
        return { data: null, error: new Error('Place not found') };
      }
      
      // Check if user owns the place
      if (place.added_by !== profile.id) {
        return { data: null, error: new Error('You can only update your own places') };
      }
      
      // Update the place
      const updatedPlace = {
        ...place,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      // Save the updated place
      placesStorage[placeId] = updatedPlace;
      
      toast({
        title: 'Place updated',
        description: 'Place has been updated successfully.',
      });
      
      return { data: updatedPlace, error: null };
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