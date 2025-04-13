
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { MapPin, Compass, AlertCircle } from 'lucide-react';

export type LocationStatus = 
  | 'initializing' 
  | 'requesting' 
  | 'granted' 
  | 'denied' 
  | 'unavailable' 
  | 'error';

export type LocationData = {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  cityName?: string | null;
};

export interface LocationState {
  status: LocationStatus;
  data: LocationData | null;
  isLoading: boolean;
  error: string | null;
}

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  showToasts?: boolean;
}

export function useLocation(options: UseLocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    showToasts = true
  } = options;

  const [state, setState] = useState<LocationState>({
    status: 'initializing',
    data: null,
    isLoading: false,
    error: null
  });

  // Request location permission and get current position
  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState({
        status: 'unavailable',
        data: null,
        isLoading: false,
        error: 'Geolocation is not supported by your browser'
      });
      
      if (showToasts) {
        toast({
          title: 'Location Unavailable',
          description: 'Geolocation is not supported by your browser',
          variant: 'destructive',
        });
      }
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, status: 'requesting' }));

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy, timeout, maximumAge }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;
      const timestamp = position.timestamp;

      setState({
        status: 'granted',
        data: { latitude, longitude, accuracy, timestamp },
        isLoading: false,
        error: null
      });

      if (showToasts) {
        toast({
          title: 'Location Updated',
          description: (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-[#ff6ec7] mr-2" />
              <span>{`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}</span>
            </div>
          ),
        });
      }
    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      let status: LocationStatus = 'error';
      
      if (error instanceof GeolocationPositionError) {
        if (error.code === error.PERMISSION_DENIED) {
          status = 'denied';
          errorMessage = 'Location permission denied';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          status = 'unavailable';
          errorMessage = 'Location information is unavailable';
        } else if (error.code === error.TIMEOUT) {
          status = 'error';
          errorMessage = 'Location request timed out';
        }
      }

      setState({
        status,
        data: null,
        isLoading: false,
        error: errorMessage
      });

      if (showToasts) {
        toast({
          title: 'Location Error',
          description: (
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{errorMessage}</span>
            </div>
          ),
          variant: 'destructive',
        });
      }
    }
  }, [enableHighAccuracy, timeout, maximumAge, showToasts]);

  // Request location on mount
  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // Check if the app can request for permission
  const canRequestPermission = state.status === 'initializing' || 
    state.status === 'denied' || 
    state.status === 'error';

  return {
    ...state,
    getLocation,
    canRequestPermission,
  };
}
