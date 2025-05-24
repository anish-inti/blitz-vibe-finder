
import { Place } from "@/components/SwipeCard";

export interface ParsedFilters {
  budget: number | null;
  groupSize: number | null;
  vibes: string[];
  time: string | null;
}

/**
 * Parses a user prompt to extract structured filters
 */
export function parseUserPrompt(userPrompt: string): ParsedFilters {
  const filters: ParsedFilters = {
    budget: null,
    groupSize: null,
    vibes: [],
    time: null,
  };

  if (!userPrompt || typeof userPrompt !== 'string') {
    return filters;
  }

  const prompt = userPrompt.toLowerCase().trim();

  try {
    // Extract budget (₹ amount per person)
    const budgetMatch = prompt.match(/₹\s?(\d{2,5})/);
    if (budgetMatch) {
      const budgetValue = parseInt(budgetMatch[1]);
      if (!isNaN(budgetValue) && budgetValue > 0) {
        filters.budget = budgetValue;
      }
    }

    // Extract group size
    const groupMatch = prompt.match(/(\d+)\s+(friends|people|guys|us)/);
    if (groupMatch) {
      const groupValue = parseInt(groupMatch[1]);
      if (!isNaN(groupValue) && groupValue > 0) {
        filters.groupSize = groupValue;
      }
    }

    // Extract time
    if (prompt.includes("late night")) filters.time = "night";
    else if (prompt.includes("night")) filters.time = "night";
    else if (prompt.includes("evening")) filters.time = "evening";
    else if (prompt.includes("morning") || prompt.includes("brunch")) filters.time = "morning";
    else if (prompt.includes("afternoon")) filters.time = "afternoon";

    // Extract vibe tags
    const vibeKeywords = [
      "rooftop", "outdoors", "outdoor", "cafe", "club", "aesthetic", 
      "chill", "romantic", "budget", "premium", "dance", "cozy", 
      "quiet", "peaceful", "nightlife", "lounge", "bar"
    ];
    
    filters.vibes = vibeKeywords.filter(tag => prompt.includes(tag));
  } catch (error) {
    console.error('Error parsing user prompt:', error);
  }

  return filters;
}

/**
 * Filters places based on parsed filters from user prompt
 */
export function filterPlaces(places: Place[], filters: ParsedFilters): Place[] {
  if (!filters || !Array.isArray(places)) return places;
  
  try {
    return places.filter(place => {
      if (!place || typeof place !== 'object') return false;

      // Budget matching (if budget filter is provided)
      const budgetMatch = filters.budget ? 
        (place.budget ? place.budget <= filters.budget : true) : 
        true;
      
      // Group size matching (if group size filter is provided)
      const groupMatch = filters.groupSize ? 
        (place.maxGroupSize ? place.maxGroupSize >= filters.groupSize : true) : 
        true;
      
      // Time matching (if time filter is provided)
      const timeMatch = filters.time ? 
        (place.time === filters.time || 
         (place.hours?.toLowerCase()?.includes(filters.time || '') ?? false)) : 
        true;
      
      // Vibe tag matching (if vibe filters are provided)
      const vibeMatch = filters.vibes.length > 0 ? 
        (place.tags ? filters.vibes.some(v => place.tags?.includes(v)) : false) : 
        true;
      
      return budgetMatch && groupMatch && timeMatch && vibeMatch;
    });
  } catch (error) {
    console.error('Error filtering places:', error);
    return places;
  }
}

/**
 * Parses a user prompt and filters places in one step
 */
export function parseAndFilterPlaces(userPrompt: string, places: Place[]): Place[] {
  try {
    const filters = parseUserPrompt(userPrompt);
    return filterPlaces(places, filters);
  } catch (error) {
    console.error('Error in parseAndFilterPlaces:', error);
    return places;
  }
}
