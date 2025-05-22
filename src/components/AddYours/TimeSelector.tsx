
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ value, onChange, label = "Opening Time" }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className="space-y-2">
      {label && <label className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-blitz-black'}`}>{label}</label>}
      <div className="relative">
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blitz-lightgray" />
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full pl-9 pr-3 py-2.5 rounded-md border 
            ${darkMode 
              ? 'bg-transparent border-gray-700 text-white' 
              : 'bg-white border-gray-300 text-black'
            }
            focus:outline-none focus:ring-1 focus:ring-blitz-pink focus:border-blitz-pink
          `}
        />
      </div>
    </div>
  );
};

export default TimeSelector;
