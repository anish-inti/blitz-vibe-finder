
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ value, onChange }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className="relative">
      <Clock className="absolute left-3 top-3 h-4 w-4 text-blitz-lightgray" />
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full pl-9 pr-3 py-2 rounded-md border 
          ${darkMode 
            ? 'bg-transparent border-gray-700 text-white' 
            : 'bg-white border-gray-300 text-black'
          }
          focus:outline-none focus:ring-1 focus:ring-blitz-pink
        `}
      />
    </div>
  );
};

export default TimeSelector;
