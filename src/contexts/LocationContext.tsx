
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  location: string;
  coordinates: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState('Chennai, India');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    setIsLoading(true);
    setError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setIsLoading(false);
        },
        (error) => {
          setError('Failed to get location');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setIsLoading(false);
    }
  };

  return (
    <LocationContext.Provider value={{
      location,
      coordinates,
      isLoading,
      error,
      requestLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
