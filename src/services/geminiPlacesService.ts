
import { toast } from '@/hooks/use-toast';

// Define the interface for AI-generated place recommendations
export interface GeminiPlace {
  id: string;  // Unique identifier (generated)
  name: string;
  description: string;
  price_range: string;
  location: string;
  country?: string;
  image?: string;  // Will use placeholder if not provided
  category?: string;
}

// Interface for the format of data returned by Gemini
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// Interface for place search parameters
export interface PlaceSearchParams {
  type?: string;        // Café, Restaurant, Activity, etc.
  vibe?: string;        // Chill, Energetic, Aesthetic, Romantic
  location?: string;    // User's location or typed input
  budget?: number;      // 1-3 ($, $$, $$$)
  timeWindow?: string;  // Morning, Afternoon, Evening, Night
  familyMode?: string;  // family, friends, date
  latitude?: number;    // Optional coordinates for geo-location hints
  longitude?: number;
  opennow?: boolean;    // Filter for places likely open
  prompt?: string;      // Free text prompt from user
}

// Convert budget number to symbol string
const budgetToSymbol = (budget: number | undefined): string => {
  if (budget === undefined) return "₹₹";
  
  switch(budget) {
    case 0:
    case 1:
      return "₹";
    case 2:
      return "₹₹";
    case 3:
    case 4:
      return "₹₹₹";
    default:
      return "₹₹";
  }
};

// Convert from Gemini response to our app's Place interface
export const mapGeminiResponseToPlaces = (responseJson: any): any[] => {
  try {
    // Extract places from JSON response
    const places = Array.isArray(responseJson) ? responseJson : [];
    
    // Map to our Place interface with unique IDs
    return places.map((place, index) => {
      // Parse location into city and country if possible
      const locationParts = (place.location || '').split(', ');
      const city = locationParts[0] || 'Unknown';
      const country = locationParts.length > 1 ? locationParts[locationParts.length - 1] : 'Unknown';
      
      // Extract category from description or use default
      const categoryKeywords = {
        'cafe': ['cafe', 'coffee', 'tea'],
        'restaurant': ['restaurant', 'dine', 'dining', 'eatery', 'food'],
        'bar': ['bar', 'pub', 'brewery', 'cocktail'],
        'park': ['park', 'garden', 'outdoor'],
        'museum': ['museum', 'gallery', 'exhibition'],
        'shopping_mall': ['mall', 'shopping'],
        'movie_theater': ['cinema', 'theater', 'movies'],
        'tourist_attraction': ['tourist', 'attraction', 'landmark', 'monument']
      };
      
      let inferredCategory = 'place';
      const lowerDesc = (place.description || '').toLowerCase();
      
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(keyword => lowerDesc.includes(keyword))) {
          inferredCategory = category;
          break;
        }
      }
      
      // Generate a predictable but unique ID based on name and index
      const id = `ai-${Math.floor(Date.now() / 1000)}-${index}-${place.name.replace(/\s+/g, '-').toLowerCase()}`;
      
      // Get price level from price_range string (count currency symbols)
      const priceRegex = /[₹$€£]/g;
      const priceMatches = place.price_range?.match(priceRegex) || [];
      const priceLevel = Math.min(priceMatches.length, 4);
      
      return {
        id,
        name: place.name,
        location: city,
        country,
        // Use a placeholder image for AI-generated places
        image: place.image || '/placeholder.svg',
        rating: Math.floor(Math.random() * 2) + 3, // Random rating between 3-5
        reviewCount: Math.floor(Math.random() * 100) + 10, // Random review count
        priceLevel,
        isOpen: true, // Assuming all suggested places are open
        category: place.category || inferredCategory,
        description: place.description || '',
      };
    });
  } catch (error) {
    console.error('Error mapping Gemini response to places:', error);
    return [];
  }
};

// Function to generate place recommendations using Gemini AI
export const getPlaceRecommendations = async (params: PlaceSearchParams): Promise<any[]> => {
  try {
    // Validate required parameters
    if (!params.location && !params.latitude && !params.longitude) {
      // If no location info, use a default or allow the AI to suggest general places
      params.location = "your area";
    }
    
    const locationString = params.location || "the area";
    const budgetSymbol = budgetToSymbol(params.budget);
    
    // Build the base prompt
    let prompt = `Give me 5 suggestions for `;
    
    // Add type if specified
    if (params.type) {
      prompt += `${params.type} places `;
    } else {
      prompt += "places ";
    }
    
    // Add location
    prompt += `in ${locationString} `;
    
    // Add vibe if specified
    if (params.vibe) {
      prompt += `with a ${params.vibe} atmosphere, `;
    }
    
    // Add budget
    prompt += `budget category ${budgetSymbol}, `;
    
    // Add time window if specified
    if (params.timeWindow) {
      prompt += `suitable for ${params.timeWindow.toLowerCase()}. `;
    } else {
      prompt += "at any time of day. ";
    }
    
    // Add basic requirements for response
    prompt += "Include name, one-line description, and approximate cost for two. ";
    
    // Add open now filter if specified
    if (params.opennow) {
      prompt += "Only include places that are likely open right now. ";
    }
    
    // Add family/friends/date mode if specified
    if (params.familyMode) {
      prompt += `Make suggestions that are great for a ${params.familyMode}. `;
    }
    
    // Add geolocation hint if available
    if (params.latitude && params.longitude) {
      prompt += `The user is currently located near [${params.latitude}, ${params.longitude}], suggest places nearby first. `;
    }
    
    // Override prompt with user's free text if provided
    if (params.prompt && params.prompt.trim()) {
      // Parse locations from their prompt and add geolocation hints
      const userPrompt = params.prompt.trim();
      
      // Replace the entire prompt with a structured version of the user's request
      prompt = `Based on the user's request: "${userPrompt}", give me 5 detailed suggestions for places to visit that match this request. `;
      
      if (params.latitude && params.longitude) {
        prompt += `The user is currently located at [${params.latitude}, ${params.longitude}]. `;
      }
    }
    
    // Add instruction to return JSON format
    prompt += `Make sure they are realistic places. Respond with ONLY a JSON array in this exact format without any other text, explanation or markdown formatting:
[
  {
    "name": "Place Name",
    "description": "A brief description of the place",
    "price_range": "${budgetSymbol}",
    "location": "Neighborhood, City"
  },
  ...more places
]`;
    
    // Prepare the request
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBaqSa1VVV-PRR-0MsjwFdVOo8BMqpDFFU"; // Use env var or fallback to provided key
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    };
    
    console.log('Sending request to Gemini API with prompt:', prompt);
    
    // Call the Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data: GeminiResponse = await response.json();
    console.log('Gemini API response:', data);
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
      throw new Error('Invalid response format from Gemini API');
    }
    
    // Extract the text from the response
    const responseText = data.candidates[0].content.parts[0].text;
    
    try {
      // Extract JSON from text (in case there's any wrapping text)
      const jsonRegex = /\[.*\]/s;
      const jsonMatch = responseText.match(jsonRegex);
      
      if (!jsonMatch) {
        throw new Error('Could not find JSON array in response');
      }
      
      const placesJson = JSON.parse(jsonMatch[0]);
      const places = mapGeminiResponseToPlaces(placesJson);
      
      return places;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError, 'Response text:', responseText);
      throw new Error('Failed to parse place recommendations. Gemini API response was not in the expected format.');
    }
  } catch (error) {
    console.error('Error fetching place recommendations:', error);
    toast({
      title: 'Error fetching recommendations',
      description: error instanceof Error ? error.message : 'An unknown error occurred',
      variant: 'destructive',
    });
    return [];
  }
};

// Function to generate fallback recommendations when specific search fails
export const getFallbackRecommendations = async (city: string): Promise<any[]> => {
  const params: PlaceSearchParams = {
    location: city,
    prompt: `Give 5 popular hangout spots in ${city} that are trending among youth, with a fun and safe vibe.`
  };
  
  return getPlaceRecommendations(params);
};
