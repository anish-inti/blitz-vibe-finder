
import { toast } from '@/hooks/use-toast';

// Define the interface for place details
export interface GooglePlace {
  place_id: string;
  name: string;
  types: string[];
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: {
    photo_reference: string;
    width: number;
    height: number;
  }[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
}

// Interface for Google Places API response
interface PlacesResponse {
  results: GooglePlace[];
  status: string;
  error_message?: string;
  next_page_token?: string;
}

// Interface for nearby search parameters
export interface NearbySearchParams {
  latitude: number;
  longitude: number;
  radius?: number; // meters, max 50000
  type?: string; // restaurant, cafe, park, etc.
  keyword?: string; // free text search
  minprice?: number; // 0 to 4
  maxprice?: number; // 0 to 4
  opennow?: boolean;
}

// Convert from GooglePlace to our app's Place interface
export const mapGooglePlaceToPlace = (place: GooglePlace): any => {
  // Get image URL from photo reference or use a placeholder
  const imageUrl = place.photos && place.photos.length > 0
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    : '/placeholder.svg';
  
  // Get primary type for category
  const primaryType = place.types && place.types.length > 0 
    ? place.types[0].replace('_', ' ') 
    : 'place';
  
  // Parse vicinity to get location and country (simplified)
  const locationParts = place.vicinity ? place.vicinity.split(', ') : ['Unknown'];
  const location = locationParts[0] || 'Unknown';
  const country = locationParts.length > 1 ? locationParts[locationParts.length - 1] : 'Unknown';

  return {
    id: place.place_id,
    name: place.name,
    location,
    country,
    image: imageUrl,
    rating: place.rating || 0,
    reviewCount: place.user_ratings_total || 0,
    priceLevel: place.price_level,
    isOpen: place.opening_hours?.open_now,
    category: primaryType,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
  };
};

// Function to search for nearby places
export const searchNearbyPlaces = async (params: NearbySearchParams): Promise<any[]> => {
  try {
    // Create and validate parameters for the API
    if (!params.latitude || !params.longitude) {
      throw new Error("Location coordinates are required");
    }

    // Create URL with parameters
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("Google Maps API key is missing");
    }

    const queryParams = new URLSearchParams({
      location: `${params.latitude},${params.longitude}`,
      radius: `${params.radius || 5000}`, // Default 5km
      key: apiKey,
    });

    if (params.type) queryParams.append('type', params.type);
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.minprice !== undefined) queryParams.append('minprice', params.minprice.toString());
    if (params.maxprice !== undefined) queryParams.append('maxprice', params.maxprice.toString());
    if (params.opennow) queryParams.append('opennow', 'true');

    const url = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?${queryParams.toString()}`;

    // Make request to Google Places API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: PlacesResponse = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(data.error_message || `API returned status: ${data.status}`);
    }

    // Map Google Places to our app format
    const places = data.results.map(mapGooglePlaceToPlace);
    
    return places;
  } catch (error) {
    console.error('Error fetching places:', error);
    toast({
      title: 'Error fetching places',
      description: error instanceof Error ? error.message : 'An unknown error occurred',
      variant: 'destructive',
    });
    return [];
  }
};

// Function to parse user preferences from free text
export const parseUserPreferences = (text: string): {
  type?: string;
  keyword?: string;
  minprice?: number;
  maxprice?: number;
  radius?: number;
} => {
  const result: {
    type?: string;
    keyword?: string;
    minprice?: number;
    maxprice?: number;
    radius?: number;
  } = {};

  const lowercaseText = text.toLowerCase();

  // Detect place types
  const placeTypes = [
    { keywords: ['restaurant', 'food', 'dinner', 'lunch', 'eat'], type: 'restaurant' },
    { keywords: ['cafe', 'coffee', 'tea'], type: 'cafe' },
    { keywords: ['bar', 'pub', 'drink', 'beer', 'wine'], type: 'bar' },
    { keywords: ['park', 'outdoors', 'nature', 'outdoor'], type: 'park' },
    { keywords: ['museum', 'art', 'culture', 'history'], type: 'museum' },
    { keywords: ['shopping', 'mall', 'store', 'shop'], type: 'shopping_mall' },
    { keywords: ['movie', 'cinema', 'theater', 'film'], type: 'movie_theater' },
  ];

  // Look for matching place types
  for (const placeType of placeTypes) {
    if (placeType.keywords.some(keyword => lowercaseText.includes(keyword))) {
      result.type = placeType.type;
      break;
    }
  }

  // Detect price level
  if (lowercaseText.includes('cheap') || lowercaseText.includes('budget') || lowercaseText.includes('inexpensive')) {
    result.minprice = 0;
    result.maxprice = 1;
  } else if (lowercaseText.includes('expensive') || lowercaseText.includes('luxury') || lowercaseText.includes('high-end')) {
    result.minprice = 3;
    result.maxprice = 4;
  } else if (lowercaseText.includes('moderate') || lowercaseText.includes('mid-range')) {
    result.minprice = 1;
    result.maxprice = 2;
  }

  // Detect pricing from currency symbols
  const priceRegex = /([\$₹€£])(\1{0,3})/g;
  const priceMatch = lowercaseText.match(priceRegex);
  if (priceMatch && priceMatch.length > 0) {
    const priceSymbols = priceMatch[0];
    result.maxprice = Math.min(priceSymbols.length, 4);
  }

  // Extract keywords for atmosphere
  const vibeKeywords = ['cozy', 'romantic', 'family', 'quiet', 'lively', 'trendy', 'hip', 'chill', 'rooftop'];
  const foundVibes = vibeKeywords.filter(vibe => lowercaseText.includes(vibe));
  if (foundVibes.length > 0) {
    result.keyword = foundVibes.join(' ');
  }

  // Detect distance
  const distanceRegex = /(\d+)\s*(km|kilometer|mile|m|meter)/i;
  const distanceMatch = lowercaseText.match(distanceRegex);
  if (distanceMatch) {
    const value = parseInt(distanceMatch[1]);
    const unit = distanceMatch[2].toLowerCase();
    
    if (unit === 'km' || unit === 'kilometer') {
      result.radius = value * 1000; // Convert km to meters
    } else if (unit === 'mile') {
      result.radius = value * 1609; // Convert miles to meters
    } else if (unit === 'm' || unit === 'meter') {
      result.radius = value;
    }
  }

  return result;
};
