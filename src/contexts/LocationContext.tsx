
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocation, LocationState } from '@/hooks/use-location';

// Create context with default values
const LocationContext = createContext<LocationState & { 
  getLocation: () => Promise<void>;
  canRequestPermission: boolean;
}>({
  status: 'initializing',
  data: null,
  isLoading: false,
  error: null,
  getLocation: async () => {},
  canRequestPermission: false,
});

export const useLocationContext = () => useContext(LocationContext);

interface LocationProviderProps {
  children: ReactNode;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
  enableHighAccuracy = true,
  timeout = 10000,
  maximumAge = 0,
}) => {
  const locationState = useLocation({
    enableHighAccuracy,
    timeout,
    maximumAge,
    showToasts: false, // Don't show toasts from the context provider
  });

  return (
    <LocationContext.Provider value={locationState}>
      {children}
    </LocationContext.Provider>
  );
};
