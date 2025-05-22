
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

  const prompt = userPrompt.toLowerCase();

  // Extract budget (₹ amount per person)
  const budgetMatch = prompt.match(/₹\s?(\d{2,5})/);
  if (budgetMatch) filters.budget = parseInt(budgetMatch[1]);

  // Extract group size
  const groupMatch = prompt.match(/(\d+)\s+(friends|people|guys|us)/);
  if (groupMatch) filters.groupSize = parseInt(groupMatch[1]);

  // Extract time
  if (prompt.includes("night")) filters.time = "night";
  else if (prompt.includes("evening")) filters.time = "evening";
  else if (prompt.includes("morning")) filters.time = "morning";
  else if (prompt.includes("afternoon")) filters.time = "afternoon";
  else if (prompt.includes("brunch")) filters.time = "morning";
  else if (prompt.includes("late night")) filters.time = "night";

  // Extract vibe tags
  const vibeKeywords = [
    "rooftop", "outdoors", "outdoor", "cafe", "club", "aesthetic", 
    "chill", "romantic", "budget", "premium", "dance", "cozy", 
    "quiet", "peaceful", "nightlife"
  ];
  
  filters.vibes = vibeKeywords.filter(tag => prompt.includes(tag));

  return filters;
}

/**
 * Filters places based on parsed filters from user prompt
 */
export function filterPlaces(places: Place[], filters: ParsedFilters): Place[] {
  if (!filters) return places;
  
  return places.filter(place => {
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
      (place.tags ? filters.vibes.some(v => place.tags.includes(v)) : false) : 
      true;
    
    return budgetMatch && groupMatch && timeMatch && vibeMatch;
  });
}

/**
 * Parses a user prompt and filters places in one step
 */
export function parseAndFilterPlaces(userPrompt: string, places: Place[]): Place[] {
  const filters = parseUserPrompt(userPrompt);
  return filterPlaces(places, filters);
}
