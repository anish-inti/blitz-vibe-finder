
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Coffee, Utensils, Martini, Palmtree, Building2, Moon, Music } from "lucide-react";

interface VenueTypeSelectorProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

const venueTypes = [
  { id: "cafe", label: "Café", icon: Coffee },
  { id: "restaurant", label: "Restaurant", icon: Utensils },
  { id: "bar", label: "Bar", icon: Martini },
  { id: "park", label: "Park", icon: Palmtree },
  { id: "rooftop", label: "Rooftop", icon: Building2 },
  { id: "club", label: "Club", icon: Music },
  { id: "lounge", label: "Lounge", icon: Moon }
];

const VenueTypeSelector: React.FC<VenueTypeSelectorProps> = ({ selectedType, onSelectType }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className="grid grid-cols-4 gap-2">
      {venueTypes.map(({ id, label, icon: Icon }) => {
        const isSelected = id === selectedType;
        
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectType(id)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-lg transition-colors
              ${isSelected 
                ? 'bg-blitz-pink text-white' 
                : darkMode 
                  ? 'bg-blitz.card border border-gray-700 hover:bg-gray-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }
            `}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default VenueTypeSelector;
