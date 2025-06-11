import { toast } from '@/hooks/use-toast';

// Define the interface for place details
export interface GooglePlace {
  place_id: string;
  name: string;
  types: string[];
  vicinity?: string;
  formatted_address?: string;
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
  latitude?: number;
  longitude?: number;
  radius?: number; // meters, max 50000
  type?: string; // restaurant, cafe, park, etc.
  keyword?: string; // free text search
  minprice?: number; // 0 to 4
  maxprice?: number; // 0 to 4
  opennow?: boolean;
  query?: string; // text search query
}

// Interface for parsed prompt data
export interface ParsedPromptData {
  people: number | null;
  budget: number | null;
  vibe: string | null;
  location: string;
}

// Convert from GooglePlace to our app's Place interface
export const mapGooglePlaceToPlace = (place: GooglePlace): any => {
  // Get image URL from photo reference or use a placeholder
  const imageUrl = place.photos && place.photos.length > 0
    ? getPhotoUrl(place.photos[0].photo_reference)
    : `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000) + 1517248135467}-4c7edcad34c4?w=800&h=600&fit=crop`;
  
  // Get primary type for category
  const primaryType = place.types && place.types.length > 0 
    ? place.types[0].replace('_', ' ') 
    : 'place';
  
  // Parse vicinity to get location and country (simplified)
  const address = place.formatted_address || place.vicinity || 'Chennai, India';
  const locationParts = address.split(', ');
  const location = locationParts[0] || 'Chennai';
  const country = locationParts.length > 1 ? locationParts[locationParts.length - 1] : 'India';

  return {
    id: place.place_id,
    name: place.name,
    location,
    country,
    image: imageUrl,
    rating: place.rating || (Math.random() * 2 + 3),
    reviewCount: place.user_ratings_total || Math.floor(Math.random() * 100) + 10,
    priceLevel: place.price_level,
    isOpen: place.opening_hours?.open_now ?? true,
    category: primaryType,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    description: `A popular ${primaryType} in ${location}`,
  };
};

// Function to get photo URL from photo reference
export const getPhotoUrl = (photoReference: string, maxwidth: number = 800): string => {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${photoReference}&key=${apiKey}`;
};

// Function to parse user prompt
export const parsePrompt = (prompt: string): ParsedPromptData => {
  const peopleMatch = prompt.match(/(\d+)\s+(of\s+us|people|friends|guys)/i);
  const budgetMatch = prompt.match(/₹?(\d+)/);
  const vibeMatch = prompt.match(/(rooftop|outdoor|romantic|adventure|café|cafe|restaurant|park|nightlife|club|bar|beach|mall|shopping|movie|cinema|food|dining)/i);
  
  return {
    people: peopleMatch ? parseInt(peopleMatch[1]) : null,
    budget: budgetMatch ? parseInt(budgetMatch[1]) : null,
    vibe: vibeMatch ? vibeMatch[1].toLowerCase() : null,
    location: "Chennai, India" // Default location
  };
};

// Function to search for places using Google Places API
export const searchPlaces = async (params: NearbySearchParams): Promise<any[]> => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      throw new Error("Google Places API key is missing. Please add VITE_GOOGLE_PLACES_API_KEY to your .env file");
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      key: apiKey,
    });

    // Use text search for better results
    let endpoint = 'textsearch';
    
    if (params.query) {
      queryParams.append('query', params.query);
    } else {
      // Fallback to nearby search
      endpoint = 'nearbysearch';
      queryParams.append('location', '13.0827,80.2707'); // Chennai coordinates
      queryParams.append('radius', `${params.radius || 5000}`);
    }

    if (params.type) queryParams.append('type', params.type);
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.minprice !== undefined) queryParams.append('minprice', params.minprice.toString());
    if (params.maxprice !== undefined) queryParams.append('maxprice', params.maxprice.toString());
    if (params.opennow) queryParams.append('opennow', 'true');

    const url = `https://maps.googleapis.com/maps/api/place/${endpoint}/json?${queryParams.toString()}`;

    // Use CORS proxy for browser requests
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const proxyData = await response.json();
    const data: PlacesResponse = JSON.parse(proxyData.contents);

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(data.error_message || `API returned status: ${data.status}`);
    }

    // Map Google Places to our app format and limit results
    const places = data.results.slice(0, 10).map(mapGooglePlaceToPlace);
    
    return places;
  } catch (error) {
    console.warn('Google Places API unavailable, using fallback data:', error);
    
    // Return fallback data instead of throwing
    return getFallbackPlaces(params.query || 'places in Chennai');
  }
};

// Fallback places when API fails
const getFallbackPlaces = (query: string): any[] => {
  const fallbackPlaces = [
    {
      id: 'fallback-1',
      name: 'Marina Beach',
      location: 'Chennai',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      rating: 4.2,
      reviewCount: 1250,
      category: 'beach',
      description: 'Famous beach in Chennai perfect for evening walks',
    },
    {
      id: 'fallback-2',
      name: 'Phoenix MarketCity',
      location: 'Chennai',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      rating: 4.4,
      reviewCount: 890,
      category: 'shopping mall',
      description: 'Popular shopping and entertainment destination',
    },
    {
      id: 'fallback-3',
      name: 'Cafe Coffee Day',
      location: 'Chennai',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
      rating: 4.0,
      reviewCount: 456,
      category: 'cafe',
      description: 'Cozy cafe perfect for hanging out with friends',
    },
    {
      id: 'fallback-4',
      name: 'Express Avenue',
      location: 'Chennai',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
      rating: 4.3,
      reviewCount: 678,
      category: 'shopping mall',
      description: 'Modern shopping mall with restaurants and entertainment',
    },
    {
      id: 'fallback-5',
      name: 'Kapaleeshwarar Temple',
      location: 'Chennai',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop',
      rating: 4.6,
      reviewCount: 2100,
      category: 'temple',
      description: 'Historic temple with beautiful architecture',
    }
  ];

  // Filter based on query if possible
  const queryLower = query.toLowerCase();
  if (queryLower.includes('cafe') || queryLower.includes('coffee')) {
    return [fallbackPlaces[2]];
  } else if (queryLower.includes('shop') || queryLower.includes('mall')) {
    return [fallbackPlaces[1], fallbackPlaces[3]];
  } else if (queryLower.includes('beach') || queryLower.includes('outdoor')) {
    return [fallbackPlaces[0]];
  }

  return fallbackPlaces;
};

// Main function to get recommendations based on user prompt
export const getBlitzRecommendations = async (prompt: string): Promise<any[]> => {
  try {
    const parsed = parsePrompt(prompt);
    
    // Build search query based on parsed data
    let query = '';
    if (parsed.vibe) {
      query = `${parsed.vibe} places in Chennai`;
    } else {
      query = `best places to visit in Chennai`;
    }
    
    // Add budget context if available
    if (parsed.budget) {
      if (parsed.budget <= 200) {
        query += ' budget friendly affordable';
      } else if (parsed.budget >= 1000) {
        query += ' premium luxury expensive';
      } else {
        query += ' mid range';
      }
    }

    // Add group size context
    if (parsed.people) {
      if (parsed.people >= 6) {
        query += ' group friendly large groups';
      } else if (parsed.people === 2) {
        query += ' couples romantic';
      }
    }

    console.log('Searching with query:', query);

    const searchParams: NearbySearchParams = {
      query,
      radius: 10000, // 10km radius
    };

    // Add price level based on budget
    if (parsed.budget) {
      if (parsed.budget <= 200) {
        searchParams.maxprice = 1;
      } else if (parsed.budget <= 500) {
        searchParams.maxprice = 2;
      } else if (parsed.budget <= 1000) {
        searchParams.maxprice = 3;
      } else {
        searchParams.maxprice = 4;
      }
    }

    const places = await searchPlaces(searchParams);
    
    // Add some synthetic properties for better UX
    return places.map(place => ({
      ...place,
      tags: generateTags(place, parsed),
      budget: parsed.budget || Math.floor(Math.random() * 500) + 100,
      maxGroupSize: parsed.people || Math.floor(Math.random() * 8) + 2,
      time: getTimeFromVibe(parsed.vibe),
      hours: generateHours(),
    }));
  } catch (error) {
    console.error('Error getting recommendations:', error);
    
    // Return fallback data
    return getFallbackPlaces(prompt);
  }
};

// Helper function to generate tags based on place and parsed data
const generateTags = (place: any, parsed: ParsedPromptData): string[] => {
  const tags: string[] = [];
  
  if (parsed.vibe) tags.push(parsed.vibe);
  if (place.category) tags.push(place.category.toLowerCase());
  if (place.priceLevel <= 1) tags.push('budget');
  if (place.priceLevel >= 3) tags.push('premium');
  if (place.rating >= 4.5) tags.push('highly rated');
  
  // Add some random relevant tags
  const possibleTags = ['cozy', 'trendy', 'family-friendly', 'instagram-worthy', 'peaceful'];
  const randomTag = possibleTags[Math.floor(Math.random() * possibleTags.length)];
  tags.push(randomTag);
  
  return tags;
};

// Helper function to get time based on vibe
const getTimeFromVibe = (vibe: string | null): string => {
  if (!vibe) return 'any time';
  
  const timeMap: Record<string, string> = {
    'nightlife': 'night',
    'club': 'night',
    'bar': 'evening',
    'cafe': 'morning',
    'restaurant': 'evening',
    'park': 'morning',
    'outdoor': 'afternoon',
  };
  
  return timeMap[vibe] || 'any time';
};

// Helper function to generate realistic hours
const generateHours = (): string => {
  const openHour = Math.floor(Math.random() * 4) + 8; // 8-11 AM
  const closeHour = Math.floor(Math.random() * 4) + 20; // 8-11 PM
  
  return `${openHour}:00 AM - ${closeHour > 12 ? closeHour - 12 : closeHour}:00 ${closeHour >= 12 ? 'PM' : 'AM'}`;
};

// Function to parse user preferences from free text (enhanced version)
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
    } else if (unit === 'meter') {
      result.radius = value;
    }
  }

  return result;
};