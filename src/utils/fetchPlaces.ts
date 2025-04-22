
import { supabase } from "@/integrations/supabase/client";
import { Place } from "@/components/SwipeCard";
import { FilterParams } from "@/components/SearchFilters";

interface FetchPlacesOpts {
  planData: {
    occasion: string;
    outingType: string;
    locality: number;
  };
  filters: FilterParams;
}

export async function fetchChennaiPlaces({
  planData,
  filters,
}: FetchPlacesOpts): Promise<{ places: Place[]; error: string | null }> {
  try {
    console.log("Fetching places from database with filters:", { planData, filters });
    
    let query = supabase.from('places').select('*');

    // Restrict to Chennai, India (case-insensitive)
    query = query.ilike('location', '%chennai%').ilike('country', '%india%');

    if (planData.occasion) {
      query = query.ilike('occasion', `%${planData.occasion.toLowerCase()}%`);
    }
    if (planData.outingType) {
      query = query.ilike('category', `%${planData.outingType.toLowerCase()}%`);
    }
    if (planData.locality && planData.locality > 0) {
      query = query.lte('locality', planData.locality);
    }
    if (filters.keyword) {
      query = query.or(`name.ilike.%${filters.keyword}%,category.ilike.%${filters.keyword}%,occasion.ilike.%${filters.keyword}%`);
    }
    if (filters.type) {
      query = query.ilike('category', `%${filters.type}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching places from database:", error);
      return { places: [], error: error.message };
    }
    
    if (!data || data.length === 0) {
      console.log("No places found in database with current filters");
      return { places: [], error: 'No places found in database that match your criteria.' };
    }
    
    console.log("Successfully fetched places from database:", data);
    
    const places: Place[] = data.map((place: any) => ({
      id: place.id,
      name: place.name,
      location: place.location,
      country: place.country,
      image: place.image || 'https://picsum.photos/800/600',
      category: place.category,
      rating: Math.floor(Math.random() * 2 + 3), // Random rating between 3-5
      reviewCount: Math.floor(Math.random() * 500) + 50,
      description: `A beautiful ${place.category} in ${place.location}, perfect for ${place.occasion}.`,
    }));
    
    return { places, error: null };
  } catch (err: any) {
    console.error("Error in fetchChennaiPlaces:", err);
    return { places: [], error: 'Error retrieving places from database.' };
  }
}
