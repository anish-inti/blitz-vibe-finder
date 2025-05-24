
import React from 'react';
import { useLocationContext } from '@/contexts/LocationContext';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LocationInfo() {
  const { location, coordinates, isLoading, error, requestLocation } = useLocationContext();

  // Format the timestamp to a readable date/time
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="w-full rounded-xl bg-[#1A1A1A]/80 border border-white/5 backdrop-blur-sm p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-[#ff6ec7]" />
          Location Info
        </h3>
        <Button 
          size="sm" 
          onClick={requestLocation}
          variant="ghost"
          className="h-8 text-xs text-white/70 hover:text-white hover:bg-white/10"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      {coordinates ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-white/60">Latitude:</span>
            <span className="font-mono">{coordinates.lat?.toFixed(6)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Longitude:</span>
            <span className="font-mono">{coordinates.lng?.toFixed(6)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">Location:</span>
            <span>{location}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-2 text-sm text-white/70">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Getting location...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <AlertCircle className="w-4 w-4 mr-2 text-orange-400" />
              <span>{error || 'Location not available'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
