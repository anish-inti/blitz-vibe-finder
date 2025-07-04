import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  DollarSign, 
  MapPin, 
  Clock,
  Tag,
  X,
  Filter
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const placeTypes = [
  { value: '', label: 'Any Type' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'cafe', label: 'Cafes' },
  { value: 'bar', label: 'Bars' },
  { value: 'park', label: 'Parks' },
  { value: 'museum', label: 'Museums' },
  { value: 'shopping_mall', label: 'Shopping' },
  { value: 'movie_theater', label: 'Cinemas' },
  { value: 'tourist_attraction', label: 'Attractions' },
];

export interface FilterParams {
  type?: string;
  keyword?: string;
  radius?: number;
  minprice?: number;
  maxprice?: number;
  opennow?: boolean;
  prompt?: string;
}

interface SearchFiltersProps {
  onApplyFilters: (filters: FilterParams) => void;
  initialFilters?: FilterParams;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onApplyFilters,
  initialFilters = {}
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [prompt, setPrompt] = useState(initialFilters.prompt || '');
  const [filters, setFilters] = useState<FilterParams>({
    type: initialFilters.type || '',
    keyword: initialFilters.keyword || '',
    radius: initialFilters.radius || 5000,
    minprice: initialFilters.minprice || 0,
    maxprice: initialFilters.maxprice || 4,
    opennow: initialFilters.opennow || false,
  });
  
  const handlePromptSubmit = () => {
    if (!prompt.trim()) return;
    
    // Simple prompt parsing for demo
    const newFilters = { ...filters, prompt: prompt };
    
    // Basic keyword extraction
    if (prompt.toLowerCase().includes('cafe')) {
      newFilters.type = 'cafe';
    } else if (prompt.toLowerCase().includes('restaurant')) {
      newFilters.type = 'restaurant';
    } else if (prompt.toLowerCase().includes('bar')) {
      newFilters.type = 'bar';
    }
    
    // Budget extraction
    const budgetMatch = prompt.match(/₹(\d+)/);
    if (budgetMatch) {
      const budget = parseInt(budgetMatch[1]);
      if (budget <= 200) {
        newFilters.maxprice = 1;
      } else if (budget <= 500) {
        newFilters.maxprice = 2;
      } else if (budget <= 1000) {
        newFilters.maxprice = 3;
      } else {
        newFilters.maxprice = 4;
      }
    }
    
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };
  
  const handleFilterChange = (field: keyof FilterParams, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  const handleApplyFilters = () => {
    onApplyFilters({ ...filters, prompt: prompt });
    setShowFilters(false);
  };
  
  const getPriceLabel = (price: number) => {
    return Array(price + 1).join('$');
  };
  
  const getDistanceLabel = (meters: number) => {
    return meters >= 1000 
      ? `${(meters / 1000).toFixed(1)}km` 
      : `${meters}m`;
  };

  return (
    <div className="w-full">
      {/* Natural language prompt */}
      <div className="mb-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Describe what you're looking for..."
            className="pl-10 pr-10 py-3 bg-background border-border text-foreground placeholder:text-muted-foreground rounded-xl"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePromptSubmit()}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary hover:text-primary/80 transition-colors"
            onClick={handlePromptSubmit}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-1">
          Try: "Romantic dinner under $50" or "Casual café within 2km"
        </p>
      </div>
      
      {/* Current filters display */}
      {(filters.type || filters.keyword || filters.opennow || filters.maxprice < 4) && (
        <div className="flex flex-wrap gap-2 my-3">
          {filters.type && (
            <Badge variant="outline" className="bg-muted text-foreground border-border">
              {placeTypes.find(t => t.value === filters.type)?.label || filters.type}
              <button 
                className="ml-1" 
                onClick={() => handleFilterChange('type', '')}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.keyword && (
            <Badge variant="outline" className="bg-muted text-foreground border-border">
              {filters.keyword}
              <button 
                className="ml-1" 
                onClick={() => handleFilterChange('keyword', '')}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.maxprice < 4 && (
            <Badge variant="outline" className="bg-muted text-foreground border-border">
              {getPriceLabel(filters.maxprice)}
              <button 
                className="ml-1" 
                onClick={() => handleFilterChange('maxprice', 4)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.opennow && (
            <Badge variant="outline" className="bg-muted text-foreground border-border">
              Open Now
              <button 
                className="ml-1" 
                onClick={() => handleFilterChange('opennow', false)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          <Badge variant="outline" className="bg-muted text-foreground border-border">
            {getDistanceLabel(filters.radius || 5000)}
            <button 
              className="ml-1" 
              onClick={() => handleFilterChange('radius', 5000)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}
      
      {/* Toggle filters button */}
      <div className="text-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'More Filters'}
        </Button>
      </div>
      
      {/* Detailed filters */}
      {showFilters && (
        <Card className="bg-card border-border text-foreground mb-4">
          <CardContent className="pt-4">
            <div className="space-y-4">
              {/* Place type filter */}
              <div>
                <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Tag className="h-3 w-3" /> Type
                </label>
                <Select
                  value={filters.type || ''}
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border text-foreground">
                    {placeTypes.map((type) => (
                      <SelectItem 
                        key={type.value} 
                        value={type.value}
                        className="hover:bg-muted"
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Price level slider */}
              <div>
                <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3" /> Max Price: {getPriceLabel(filters.maxprice || 0)}
                </label>
                <Slider
                  value={[filters.maxprice || 0]}
                  min={0}
                  max={4}
                  step={1}
                  onValueChange={(value) => handleFilterChange('maxprice', value[0])}
                  className="py-4"
                />
              </div>
              
              {/* Distance slider */}
              <div>
                <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <MapPin className="h-3 w-3" /> Distance: {getDistanceLabel(filters.radius || 5000)}
                </label>
                <Slider
                  value={[filters.radius || 5000]}
                  min={500}
                  max={50000}
                  step={500}
                  onValueChange={(value) => handleFilterChange('radius', value[0])}
                  className="py-4"
                />
              </div>
              
              {/* Open now toggle */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Open Now
                </label>
                <Switch
                  checked={filters.opennow || false}
                  onCheckedChange={(checked) => handleFilterChange('opennow', checked)}
                />
              </div>
              
              {/* Keyword/Vibe input */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Atmosphere/Keywords
                </label>
                <Input
                  type="text"
                  placeholder="e.g., cozy, romantic, rooftop"
                  className="bg-background border-border text-foreground"
                  value={filters.keyword || ''}
                  onChange={(e) => handleFilterChange('keyword', e.target.value)}
                />
              </div>
              
              {/* Apply button */}
              <Button 
                className="w-full btn-primary"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchFilters;