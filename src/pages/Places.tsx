import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Sparkles, Filter, TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlaces } from '@/hooks/use-places';
import PlaceCard from '@/components/Places/PlaceCard';

const Places: React.FC = () => {
  const { darkMode } = useTheme();
  const { getPlaces } = usePlaces();
  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);
  
  useEffect(() => {
    loadInitialPlaces();
  }, []);

  const loadInitialPlaces = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getPlaces({ limit: 20 });
      if (error) {
        console.error('Error loading places:', error);
        toast({
          title: "Error loading places",
          description: "Could not load places. Please try again.",
          variant: "destructive",
        });
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
        toast({
          title: "Search error",
          description: "Could not search places. Please try again.",
          variant: "destructive",
        });
        setPlaces([]);
      } else if (data.length === 0) {
        toast({
          title: "No matches found",
          description: "Try a different search criteria.",
        });
        setPlaces([]);
      } else {
        setPlaces(data);
        toast({
          title: "Places found",
          description: `Found ${data.length} places matching your criteria.`,
        });
      }
    } catch (error) {
      console.error('Error searching places:', error);
      toast({
        title: "Search error",
        description: "Could not search places. Please try again.",
        variant: "destructive",
      });
      setPlaces([]);
    } finally {
      setIsLoading(false);
      setShowPromptInput(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header title="Discover Places" />
      
      <main className="flex-1 px-6 pb-24 pt-8">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-foreground relative">
              Discover Places
              <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-blitz-stardust animate-pulse-glow" />
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
                  placeholder="e.g., We're 4 people, ₹300 per person, looking for rooftop cafes"
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
              <p className="text-sm text-muted-foreground">Loading places...</p>
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
                      onClick={() => window.location.href = `/places/${place.id}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="card-spotify rounded-2xl p-8">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-title mb-2">No places found</h3>
                <p className="text-caption text-muted-foreground mb-6">
                  Try a different search or explore our categories
                </p>
                <Button 
                  onClick={loadInitialPlaces}
                  className="btn-primary rounded-xl px-6 py-3 font-semibold"
                >
                  Refresh Places
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

export default Places