
import React from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeDeck from '@/components/SwipeDeck';
import { Sparkles, Database, Search } from 'lucide-react';
import { useLocationContext } from '@/contexts/LocationContext';
import { LocationInfo } from '@/components/LocationInfo';
import SearchFilters from '@/components/SearchFilters';
import SwipeResults from '@/components/SwipeResults';
import SwipeActions from '@/components/SwipeActions';
import { useSwipePlaces } from '@/hooks/useSwipePlaces';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PlanData {
  occasion: string;
  outingType: string;
  locality: number;
  timing: Date;
  description: string;
}

const SwipePage: React.FC = () => {
  const location = useRouterLocation();
  const locationContext = useLocationContext();

  const planData: PlanData = location.state as PlanData || {
    occasion: '',
    outingType: '',
    locality: 5,
    timing: new Date(),
    description: ''
  };

  const {
    places,
    likedPlaces,
    showResults,
    isLoading,
    error,
    filters,
    useSimulation,
    handleApplyFilters,
    handleSwipe,
    handleContinuePlanning,
    handleFinishPlanning,
    handleRetry,
    handleToggleDataSource,
  } = useSwipePlaces(planData, {
    type: planData.outingType || undefined,
    keyword: planData.occasion || undefined,
    radius: planData.locality * 1000,
  });

  // Check if showing movies
  const isShowingMovies = places.length > 0 && 
    places.some(place => 'isMovie' in place && place.isMovie);

  return (
    <div className="min-h-screen flex flex-col relative bg-blitz-black">
      <div className="cosmic-bg absolute inset-0 z-0"></div>
      <Header showLocationDebug={true} />
      <main className="flex-1 flex flex-col items-center px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-6">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-semibold text-white relative tracking-tight">
              {isShowingMovies ? "Find Your Movie" : "Find Your Experience"}
              <Sparkles className="absolute -right-5 top-1 w-3.5 h-3.5 text-blitz-pink opacity-70" />
            </h1>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blitz-lightgray hover:text-white"
                    onClick={handleToggleDataSource}
                  >
                    {useSimulation ? (
                      <Search className="h-4 w-4" />
                    ) : (
                      <Database className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{useSimulation ? "Using simulated search data" : "Using database data"}</p>
                  <p className="text-xs text-gray-400">Click to toggle</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="mb-4">
            <SearchFilters 
              onApplyFilters={handleApplyFilters}
              initialFilters={{
                type: planData.outingType || undefined,
                keyword: planData.occasion || undefined,
                radius: planData.locality * 1000,
              }}
            />
          </div>
          
          {import.meta.env.DEV && (
            <div className="mb-4">
              <LocationInfo />
            </div>
          )}
          
          {showResults ? (
            <SwipeResults
              likedPlaces={likedPlaces}
              onContinue={handleContinuePlanning}
              onFinish={handleFinishPlanning}
            />
          ) : isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-blitz-pink/20 border-t-blitz-pink animate-spin mb-4"></div>
              <p className="text-blitz-lightgray text-sm">{isShowingMovies ? "Finding movies..." : "Finding experiences..."}</p>
            </div>
          ) : error ? (
            <div className="w-full p-6 text-center glassmorphism rounded-xl">
              <p className="text-white mb-4 text-sm">{error}</p>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={handleContinuePlanning}
                  className="px-6 py-2.5 text-sm border border-white/10 text-white rounded-full bg-blitz-gray/50 hover:bg-blitz-gray/70 transition-all active:scale-[0.98]"
                >
                  Change filters
                </button>
                <button 
                  onClick={handleRetry}
                  className="px-6 py-2.5 text-sm bg-blitz-pink text-white rounded-full active:scale-[0.98] transition-all"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <SwipeDeck 
                  places={places} 
                  onSwipe={(direction) => handleSwipe(direction)} 
                />
              </div>
              {places.length > 0 && !isShowingMovies && (
                <SwipeActions 
                  onDislike={() => handleSwipe('left')}
                  onBook={() => handleSwipe('up')}
                  onLike={() => handleSwipe('right')}
                />
              )}
            </>
          )}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default SwipePage;
