
import React from 'react';
import { 
  MapPin, 
  Compass, 
  AlertCircle, 
  Loader2, 
  ArrowUpCircle, 
  LocateFixed, 
  Settings 
} from 'lucide-react';
import { useLocation } from '@/hooks/use-location';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface LocationAccessProps {
  showDebug?: boolean;
  className?: string;
}

export function LocationAccess({ showDebug = false, className = '' }: LocationAccessProps) {
  const [open, setOpen] = React.useState(false);
  const { status, data, isLoading, error, getLocation, canRequestPermission } = useLocation();

  // Format coordinates for display
  const formattedCoordinates = React.useMemo(() => {
    if (!data?.latitude || !data?.longitude) return 'No location data';
    return `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`;
  }, [data?.latitude, data?.longitude]);

  // Render status icon based on current state
  const StatusIcon = React.useMemo(() => {
    switch (status) {
      case 'initializing':
      case 'requesting':
        return <Loader2 className="h-4 w-4 animate-spin text-[#ff6ec7]" />;
      case 'granted':
        return <LocateFixed className="h-4 w-4 text-[#ff6ec7]" />;
      case 'denied':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'unavailable':
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Compass className="h-4 w-4 text-[#ff6ec7]" />;
    }
  }, [status]);

  // Get a user-friendly status message
  const statusMessage = React.useMemo(() => {
    switch (status) {
      case 'initializing':
        return 'Initializing location...';
      case 'requesting':
        return 'Requesting location...';
      case 'granted':
        return 'Location accessed';
      case 'denied':
        return 'Location permission denied';
      case 'unavailable':
        return 'Location services unavailable';
      case 'error':
        return error || 'Error accessing location';
      default:
        return 'Unknown status';
    }
  }, [status, error]);

  // Open the location sheet when permission is denied or there's an error
  React.useEffect(() => {
    if (status === 'denied' || status === 'unavailable' || (status === 'error' && !isLoading)) {
      setOpen(true);
    }
  }, [status, isLoading]);

  // Handle opening device settings
  const handleOpenSettings = () => {
    // This is just a placeholder since we can't actually open device settings from the browser
    // In a real Capacitor/Cordova app, you would use plugins to open device settings
    alert('In a native app, this would open device settings. For now, please enable location services manually.');
  };

  return (
    <>
      {/* Location Status Indicator */}
      <div 
        className={`flex items-center ${className}`}
        onClick={() => setOpen(true)}
      >
        {StatusIcon}
        {showDebug && (
          <span className="ml-2 text-sm text-white/80">
            {status === 'granted' ? formattedCoordinates : statusMessage}
          </span>
        )}
      </div>

      {/* Location Permission Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent 
          className="bg-[#1A1A1A] border-[#333] text-white"
          side="bottom"
        >
          <SheetHeader className="mb-4">
            <SheetTitle className="text-white flex items-center justify-center">
              <MapPin className="mr-2 h-5 w-5 text-[#ff6ec7]" />
              Location Access
            </SheetTitle>
            <SheetDescription className="text-center text-gray-400">
              {status === 'granted' 
                ? 'Your current location is being used to find experiences near you'
                : 'Blitz needs your location to find experiences near you'}
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            {status === 'granted' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#252525] text-center">
                  <p className="text-white/80 text-sm mb-1">Current Location</p>
                  <p className="text-white text-lg font-medium">{formattedCoordinates}</p>
                  {data?.accuracy && (
                    <p className="text-white/60 text-xs mt-1">
                      Accuracy: ±{Math.round(data.accuracy)}m
                    </p>
                  )}
                </div>
                
                <Button 
                  onClick={getLocation} 
                  className="w-full bg-[#2A2A2A] hover:bg-[#333] text-white border-none"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                  )}
                  Refresh Location
                </Button>
              </div>
            )}

            {(status === 'denied' || status === 'unavailable' || status === 'error') && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#252525] text-center">
                  <AlertCircle className="mx-auto h-10 w-10 text-orange-500 mb-2" />
                  <p className="text-white text-lg font-medium">
                    {status === 'denied' 
                      ? 'Location Access Denied' 
                      : status === 'unavailable'
                        ? 'Location Services Unavailable'
                        : 'Location Error'}
                  </p>
                  <p className="text-white/60 text-sm mt-1">
                    {error || statusMessage}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {canRequestPermission && (
                    <Button 
                      onClick={getLocation} 
                      className="bg-[#ff6ec7] hover:bg-[#ff6ec7]/90 text-white border-none"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Compass className="mr-2 h-4 w-4" />
                      )}
                      Try Again
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleOpenSettings} 
                    variant="outline"
                    className="border-[#333] text-white hover:bg-[#2A2A2A]"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Open Settings
                  </Button>
                </div>
              </div>
            )}

            {(status === 'initializing' || status === 'requesting') && (
              <div className="p-6 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-[#ff6ec7] animate-spin mb-4" />
                <p className="text-white text-lg">Accessing Location...</p>
                <p className="text-white/60 text-sm mt-1">
                  Please allow access when prompted
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
