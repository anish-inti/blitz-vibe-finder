
import { Place } from "@/components/SwipeCard";
import { FilterParams } from "@/components/SearchFilters";
import { toast } from "@/hooks/use-toast";

/**
 * Simulates searching Google for places based on user filters
 * This uses client-side logic only (no API keys required)
 */
export async function simulateGoogleSearch(
  location: string,
  filters: FilterParams
): Promise<{ places: Place[]; error: string | null }> {
  try {
    // Build a smart search query based on filters
    const searchQuery = buildSearchQuery(location, filters);
    
    // Simulate the search process
    const simulatedResults = await processSearchQuery(searchQuery);
    
    if (simulatedResults.length === 0) {
      return { 
        places: [], 
        error: `No places found matching your criteria in ${location}.` 
      };
    }
    
    return { places: simulatedResults, error: null };
  } catch (error) {
    console.error('Error in search simulation:', error);
    return { 
      places: [], 
      error: 'Unable to retrieve places. Please try different filters.' 
    };
  }
}

// Builds a smart search query based on location and filters
function buildSearchQuery(location: string, filters: FilterParams): string {
  let query = `Best`;
  
  // Add keyword if available (atmosphere/vibe)
  if (filters.keyword) {
    query += ` ${filters.keyword}`;
  }
  
  // Add place type
  if (filters.type) {
    query += ` ${formatPlaceType(filters.type)}`;
  } else {
    query += ` places to visit`;
  }
  
  // Add location
  query += ` in ${location}`;
  
  // Add distance constraint if specified
  if (filters.radius && filters.radius !== 5000) {
    const radiusInKm = Math.round(filters.radius / 1000);
    query += ` within ${radiusInKm}km`;
  }
  
  // Add price constraint if specified
  if (filters.maxprice && filters.maxprice < 4) {
    query += ` budget-friendly`;
  } else if (filters.maxprice === 4) {
    query += ` luxury`;
  }
  
  // Add open now if specified
  if (filters.opennow) {
    query += ` open now`;
  }
  
  // Add "with photos" to increase chance of getting image results
  query += ` with photos`;
  
  return query;
}

function formatPlaceType(type: string): string {
  // Map API place types to natural language terms
  const typeMap: Record<string, string> = {
    'restaurant': 'restaurants',
    'cafe': 'cafes',
    'bar': 'bars',
    'park': 'parks',
    'museum': 'museums',
    'shopping_mall': 'shopping malls',
    'movie_theater': 'movie theaters',
    'tourist_attraction': 'tourist attractions',
  };
  
  return typeMap[type] || type;
}

// Process the search query and return simulated results
async function processSearchQuery(searchQuery: string): Promise<Place[]> {
  console.log(`Simulating search for: "${searchQuery}"`);
  
  // In a real implementation, this would be where you'd use a language model
  // with web browsing capabilities to fetch and process real search results
  
  // For now, we'll generate synthetic results based on the query
  // This will be replaced with real search simulation in production
  return generateSyntheticResults(searchQuery);
}

// Generate synthetic results based on the search query
function generateSyntheticResults(searchQuery: string): Place[] {
  // Extract location from query
  const locationMatch = searchQuery.match(/in\s+([^within]+)(?:\s+within|$)/i);
  const location = locationMatch ? locationMatch[1].trim() : "the area";
  
  // Extract place type from query
  const placeTypes = [
    'restaurants', 'cafes', 'bars', 'parks', 'museums', 
    'shopping malls', 'movie theaters', 'tourist attractions'
  ];
  
  let placeType = 'place';
  for (const type of placeTypes) {
    if (searchQuery.toLowerCase().includes(type)) {
      placeType = type;
      break;
    }
  }
  
  // Check for keywords that might indicate ambiance/features
  const keywords = [
    'romantic', 'family', 'quiet', 'lively', 'trendy', 'historic',
    'modern', 'outdoor', 'rooftop', 'garden', 'beach', 'lake',
    'budget-friendly', 'luxury', 'pet-friendly', 'view'
  ];
  
  const matchedKeywords = keywords.filter(keyword => 
    searchQuery.toLowerCase().includes(keyword)
  );
  
  // Generate a relevant number of places (3-8)
  const numPlaces = Math.floor(Math.random() * 6) + 3;
  const results: Place[] = [];
  
  // Real restaurant names for Chennai, categorized by type
  const realPlaceNames: Record<string, string[]> = {
    'restaurants': [
      'Dakshin', 'Peshawri', 'Southern Spice', 'Benjarong', 
      'Avartana', 'Jamavar', 'The Flying Elephant', 'Madras Pavilion', 
      'Eden', 'Mainland China', 'Bombay Brasserie', 'Focaccia',
      'Ottimo', 'Pan Asian', 'Royal Vega', 'Buhari', 'Saravana Bhavan',
      'Murugan Idli', 'Junior Kuppanna', 'Dindigul Thalappakatti'
    ],
    'cafes': [
      'Amethyst Cafe', 'Writers Cafe', 'Chamiers Cafe', 'Cafe de Paris',
      'Old Madras Baking Company', 'The English Tearoom', 'Lloyds Tea House',
      'Ciclo Cafe', 'Alwarpet Cafe', 'Cafe Mercara Express', 'Sandy\'s Chocolate Laboratory',
      'The Brew Room', 'Ashvita Cafe', 'French Loaf', 'Tryst Cafe'
    ],
    'bars': [
      'The Vault', 'Radio Room', 'Leather Bar', 'Illusions', 'The Flying Elephant',
      'Pasha', 'Blend Bar', 'The Cheroot Malt & Cigar Lounge', 'Haze',
      'Q Bar', 'The Velveteen Rabbit', 'Library Blu', 'The Vintage Bank'
    ],
    'parks': [
      'Semmozhi Poonga', 'Guindy National Park', 'Tholkappia Poonga', 
      'Chetpet Eco Park', 'Nageswara Rao Park', 'Anna Nagar Tower Park',
      'Elliot\'s Beach', 'Marina Beach', 'Adyar Eco Park', 'Theosophical Society Gardens'
    ],
    'museums': [
      'Government Museum', 'Egmore Museum', 'Fort Museum', 'Chennai Rail Museum',
      'Birla Planetarium', 'Vivekananda House', 'DakshinaChitra Museum',
      'Chennai Citi Centre Heritage Museum', 'Cholamandal Artists\' Village'
    ],
    'shopping malls': [
      'Phoenix Marketcity', 'VR Chennai', 'Express Avenue', 'Palladium', 
      'Forum Vijaya Mall', 'Spencer Plaza', 'Ampa Skywalk', 'Grand Mall',
      'Abirami Mega Mall', 'Chennai Citi Centre'
    ],
    'tourist attractions': [
      'Kapaleeshwarar Temple', 'San Thome Basilica', 'Fort St. George',
      'Marina Beach', 'Valluvar Kottam', 'Elliot\'s Beach', 'MGM Dizzee World',
      'Mahabalipuram Shore Temple', 'Dakshina Chitra', 'Santhome Church',
      'Government Museum', 'Guindy National Park', 'Ripon Building'
    ]
  };
  
  // Sample descriptions based on place type
  const descriptions = {
    'restaurants': [
      'Serves authentic Tamil cuisine in a traditional setting.',
      'Known for its fresh seafood and signature spice blends.',
      'Modern fusion restaurant combining local and international flavors.',
      'Family-owned restaurant serving recipes passed down through generations.',
      'Fine dining experience with innovative takes on South Indian classics.'
    ],
    'cafes': [
      'Cozy spot known for artisanal coffee and freshly baked pastries.',
      'Bright, airy café with homemade desserts and free Wi-Fi.',
      'Literary-themed café perfect for reading or working.',
      'Organic café serving health-conscious options and fresh juices.',
      'European-style café with outdoor seating and great ambiance.'
    ],
    'bars': [
      'Trendy cocktail bar with live music on weekends.',
      'Rooftop bar offering stunning city views and craft cocktails.',
      'Speakeasy-style bar known for creative mixology.',
      'Sports bar with multiple screens and casual South Indian bar food.',
      'Elegant lounge with an extensive wine and whiskey selection.'
    ],
    'parks': [
      'Sprawling green space with walking trails and native flora.',
      'Urban park featuring beautiful gardens and water features.',
      'Family-friendly park with playgrounds and open fields.',
      'Historic park with monuments and seasonal flower displays.',
      'Riverside park offering scenic views and recreational activities.'
    ],
    'default': [
      'Popular local spot highly recommended by Chennai residents.',
      'Hidden gem away from the typical tourist routes.',
      'Highly-rated destination with a unique atmosphere.',
      'Well-known for its welcoming environment and authentic experience.',
      'Top-rated location that showcases the best of Chennai culture.'
    ]
  };
  
  // Generate synthetic places
  for (let i = 0; i < numPlaces; i++) {
    // Select a place name based on category
    const categoryKey = placeType.toLowerCase().includes('restaurant') ? 'restaurants' : 
                        placeType.toLowerCase().includes('cafe') ? 'cafes' :
                        placeType.toLowerCase().includes('bar') ? 'bars' :
                        placeType.toLowerCase().includes('park') ? 'parks' :
                        placeType.toLowerCase().includes('museum') ? 'museums' :
                        placeType.toLowerCase().includes('shopping') ? 'shopping malls' :
                        placeType.toLowerCase().includes('attraction') ? 'tourist attractions' : 'restaurants';
    
    const placeNames = realPlaceNames[categoryKey as keyof typeof realPlaceNames] || realPlaceNames.restaurants;
    
    // Select a random place name
    const nameIndex = Math.floor(Math.random() * placeNames.length);
    let placeName = placeNames[nameIndex];
    
    // Add some uniqueness to avoid duplicate names in a single result set
    if (results.some(p => p.name === placeName)) {
      placeName += ` ${location.split(',')[0]}`;
    }
    
    // Select description based on place type
    const typeKey = placeType.toLowerCase().includes('restaurant') ? 'restaurants' : 
                    placeType.toLowerCase().includes('cafe') ? 'cafes' :
                    placeType.toLowerCase().includes('bar') ? 'bars' :
                    placeType.toLowerCase().includes('park') ? 'parks' : 'default';
                    
    const descriptionOptions = descriptions[typeKey as keyof typeof descriptions] || descriptions.default;
    const description = descriptionOptions[Math.floor(Math.random() * descriptionOptions.length)];
    
    // Create a realistic-looking image URL (placeholder URL format)
    const imageId = Math.floor(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/seed/${placeName.replace(/\s+/g, '-').toLowerCase()}${imageId}/800/600`;
    
    // Generate a category tag based on the query
    let category = placeType;
    if (category.endsWith('s')) {
      category = category.slice(0, -1); // Convert plural to singular
    }
    
    // Generate a synthetic rating between 3.0 and 5.0
    const rating = Math.floor((Math.random() * 2 + 3) * 10) / 10;
    
    // Add the place to results
    results.push({
      id: `sim-${Date.now()}-${i}`,
      name: placeName,
      location: `${location}`,
      country: "India", // Assuming India for Chennai
      image: imageUrl,
      description: description + (matchedKeywords.length > 0 ? ` Perfect for ${matchedKeywords.join(', ')} outings.` : ''),
      category: category,
      rating: rating,
      reviewCount: Math.floor(Math.random() * 500) + 50
    });
  }
  
  // Sort randomly to add variety
  return results.sort(() => Math.random() - 0.5);
}

// Function to generate a more complete place dataset from a basic search result
// This would be triggered when a user selects a place to view details
export async function enrichPlaceData(place: Place): Promise<Place> {
  // In a real implementation, this would make a more specific search for this place
  // and extract detailed information about it
  
  // For now, we'll add some synthetic details
  return {
    ...place,
    rating: place.rating || (Math.random() * 2 + 3),
    reviewCount: Math.floor(Math.random() * 500) + 50,
    priceLevel: Math.floor(Math.random() * 4) + 1,
    isOpen: Math.random() > 0.3, // 70% chance of being open
  };
}
