import React, { useState } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Sparkles, Database, Search, Filter, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlaces } from '@/hooks/use-places';
import PlaceCard from '@/components/Places/PlaceCard';

interface PlanData {
  occasion: string;
  outingType: string;
  locality: number;
  timing: Date;
  description: string;
}

const SwipePage: React.FC = () => {
  const location = useRouterLocation();
  const { getPlaces } = usePlaces();
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const planData: PlanData = location.state as PlanData || {
    occasion: '',
    outingType: '',
    locality: 5,
    timing: new Date(),
    description: ''
  };

  React.useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    setIsLoading(true);
    try {
      const filters: any = { limit: 20 };
      
      if (planData.outingType) {
        filters.category = planData.outingType;
      }
      
      const { data, error } = await getPlaces(filters);
      if (error) {
        console.error('Error loading places:', error);
        setPlaces([]);
      } else {
        setPlaces(data);
      }
    } catch (error) {
      console.error('Exception loading places:', error);
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSearch = async () => {
    if (!userPrompt.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await getPlaces({ 
        search: userPrompt,
        limit: 20 
      });
      
      if (error) {
        console.error('Search error:', error);
        setPlaces([]);
      } else {
        setPlaces(data);
      }
    } catch (error) {
      console.error('Exception searching places:', error);
      setPlaces([]);
    } finally {
      setIsLoading(false);
      setShowPromptInput(false);
    }
  };

  const handlePlaceClick = (place: any) => {
    window.location.href = `/places/${place.id}`;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton title="Find Places" />
      
      <main className="flex-1 px-6 pb-24 pt-8">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-foreground relative tracking-tight">
              Find Your Experience
              <Sparkles className="absolute -right-5 top-1 w-3.5 h-3.5 text-primary opacity-70" />
            </h1>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setShowPromptInput(!showPromptInput)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {showPromptInput && (
            <div className="mb-4 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., We're 4 people, ₹300 per person, looking for rooftop cafes in the evening"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePromptSearch()}
                  className="bg-background border-border text-foreground"
                />
                <Button 
                  onClick={handlePromptSearch}
                  size="sm"
                  className="whitespace-nowrap btn-primary"
                >
                  Search
                </Button>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-primary/20 border-t-primary animate-spin mb-4"></div>
              <p className="text-muted-foreground text-sm">Finding experiences...</p>
            </div>
          ) : places.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Found {places.length} places
                </p>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              
              <div className="grid gap-4">
                {places.map((place, index) => (
                  <div key={place.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <PlaceCard 
                      place={place}
                      onClick={() => handlePlaceClick(place)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full p-6 text-center card-spotify rounded-xl">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-foreground mb-4 text-sm">No places found matching your criteria</p>
              <div className="flex justify-center gap-3">
                <Button 
                  onClick={() => window.location.href = '/planner'}
                  variant="outline"
                  className="px-6 py-2.5 text-sm"
                >
                  Change filters
                </Button>
                <Button 
                  onClick={loadPlaces}
                  className="px-6 py-2.5 text-sm btn-primary"
                >
                  Try again
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default SwipePage;