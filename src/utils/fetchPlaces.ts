
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
      query = query.ilike('name', `%${filters.keyword}%`);
    }
    if (filters.type) {
      query = query.ilike('category', `%${filters.type}%`);
    }

    // Add further filters as/when needed

    const { data, error } = await query;

    if (error) {
      return { places: [], error: error.message };
    }
    if (!data || data.length === 0) {
      return { places: [], error: 'No places found for Chennai, India with your filters.' };
    }
    const places: Place[] = data.map((place: any) => ({
      id: place.id,
      name: place.name,
      location: place.location,
      country: place.country,
      image: place.image,
      category: place.category,
      occasion: place.occasion,
      locality: place.locality,
    }));
    return { places, error: null };
  } catch (err: any) {
    return { places: [], error: 'Error retrieving places.' };
  }
}
