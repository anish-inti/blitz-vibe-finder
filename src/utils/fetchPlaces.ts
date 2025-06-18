import { Place } from "@/components/SwipeCard";
import { FilterParams } from "@/components/SearchFilters";
import { getBlitzRecommendations } from "@/services/googlePlacesService";

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
    console.log("Fetching places with options:", { planData, filters });
    
    // Build a comprehensive prompt for Google Places API
    let prompt = '';
    if (planData.occasion) prompt += `${planData.occasion} `;
    if (planData.outingType) prompt += `${planData.outingType} `;
    prompt += 'places in Chennai';
    if (filters.keyword) prompt += ` ${filters.keyword}`;
    
    console.log("Using prompt:", prompt);
    
    const places = await getBlitzRecommendations(prompt);
    
    if (places.length === 0) {
      return { 
        places: [], 
        error: 'No places found matching your criteria.' 
      };
    }
    
    return { places, error: null };
  } catch (err: any) {
    console.error("Error in fetchChennaiPlaces:", err);
    return { places: [], error: err.message || 'Error retrieving places.' };
  }
}