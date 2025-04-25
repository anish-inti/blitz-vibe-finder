
import React from "react";
import { Bookmark } from "lucide-react";

interface SavedPlacesSectionProps {
  darkMode?: boolean;
}

const dummyPlaces = [
  { id: 1, name: "La Pizzeria", tag: "Food", visited: false },
  { id: 2, name: "Lakeview Park", tag: "Outdoor", visited: true },
  { id: 3, name: "Neon Nights Bar", tag: "Late Night", visited: false },
  { id: 4, name: "Arcade Arena", tag: "With Friends", visited: true },
  { id: 5, name: "Chai Palace", tag: "Food", visited: false },
];

const tagColors: Record<string, { dark: string; light: string }> = {
  Food: {
    dark: "bg-blitz-pink/30 text-blitz-pink",
    light: "bg-blitz-pink/20 text-blitz-pink",
  },
  Outdoor: {
    dark: "bg-blitz-blue/20 text-blitz-blue",
    light: "bg-blitz-blue/10 text-blitz-blue",
  },
  "Late Night": {
    dark: "bg-blitz-neonred/20 text-blitz-neonred",
    light: "bg-blitz-neonred/10 text-blitz-neonred",
  },
  "With Friends": {
    dark: "bg-blitz-purple/20 text-blitz-purple",
    light: "bg-blitz-purple/10 text-blitz-purple",
  },
};

const SavedPlacesSection: React.FC<SavedPlacesSectionProps> = ({ darkMode = true }) => (
  <section className="mb-8">
    <h3 className={`flex items-center gap-2 text-lg font-semibold ${darkMode ? "text-white" : "text-blitz-black"} mb-3`}>
      <Bookmark className={`w-5 h-5 ${darkMode ? "text-blitz-pink" : "text-blitz-purple"}`} /> Saved Places
    </h3>
    <div className="space-y-2">
      {dummyPlaces.map((place) => (
        <div
          key={place.id}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-sm ${
            darkMode
              ? "bg-blitz-gray/60 border border-white/5"
              : "bg-white/80 border border-gray-100 shadow-sm"
          }`}
        >
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              tagColors[place.tag]
                ? darkMode
                  ? tagColors[place.tag].dark
                  : tagColors[place.tag].light
                : darkMode
                ? "bg-blitz-stardust/20 text-blitz-stardust"
                : "bg-blitz-stardust/10 text-blitz-purple"
            }`}
          >
            {place.tag}
          </span>
          <span className={`font-medium flex-1 ${darkMode ? "text-blitz-offwhite" : "text-blitz-black"}`}>{place.name}</span>
          {!place.visited && (
            <span
              className={`text-xs font-semibold rounded px-2 py-1 animate-pulse-glow ${
                darkMode
                  ? "text-blitz-pink/80 bg-blitz-pink/10"
                  : "text-blitz-purple/80 bg-blitz-purple/10"
              }`}
            >
              Yet to Visit
            </span>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default SavedPlacesSection;
