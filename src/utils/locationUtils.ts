
/**
 * Calculates the distance between two points using the Haversine formula
 * @param lat1 Latitude of the first point in decimal degrees
 * @param lon1 Longitude of the first point in decimal degrees
 * @param lat2 Latitude of the second point in decimal degrees
 * @param lon2 Longitude of the second point in decimal degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  // Radius of the Earth in kilometers
  const R = 6371;
  
  // Convert latitude and longitude from degrees to radians
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
}

/**
 * Returns a formatted string of the coordinates
 * @param lat Latitude in decimal degrees
 * @param lon Longitude in decimal degrees
 * @param digits Number of decimal places to include
 * @returns Formatted coordinates string
 */
export function formatCoordinates(
  lat: number | null,
  lon: number | null,
  digits: number = 6
): string {
  if (lat === null || lon === null) {
    return 'Unknown location';
  }
  
  return `${lat.toFixed(digits)}, ${lon.toFixed(digits)}`;
}

/**
 * Checks if location services are available in the browser
 * @returns True if geolocation is supported
 */
export function isLocationAvailable(): boolean {
  return 'geolocation' in navigator;
}
