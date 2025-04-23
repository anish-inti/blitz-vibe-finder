
import React from "react";
import { Bookmark } from "lucide-react";

const dummyPlaces = [
  { id: 1, name: "La Pizzeria", tag: "Food", visited: false },
  { id: 2, name: "Lakeview Park", tag: "Outdoor", visited: true },
  { id: 3, name: "Neon Nights Bar", tag: "Late Night", visited: false },
  { id: 4, name: "Arcade Arena", tag: "With Friends", visited: true },
  { id: 5, name: "Chai Palace", tag: "Food", visited: false },
];

const tagColors: Record<string, string> = {
  Food: "bg-blitz-pink/30 text-blitz-pink",
  Outdoor: "bg-blitz-blue/20 text-blitz-blue",
  "Late Night": "bg-blitz-neonred/20 text-blitz-neonred",
  "With Friends": "bg-blitz-purple/20 text-blitz-purple",
};

const SavedPlacesSection: React.FC = () => (
  <section className="mb-8">
    <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
      <Bookmark className="w-5 h-5 text-blitz-pink" /> Saved Places
    </h3>
    <div className="space-y-2">
      {dummyPlaces.map((place) => (
        <div key={place.id} className="flex items-center gap-3 bg-blitz-gray/60 rounded-lg px-4 py-3 shadow-sm border border-white/5">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${tagColors[place.tag] || "bg-blitz-stardust/20 text-blitz-stardust"}`}>
            {place.tag}
          </span>
          <span className="text-blitz-offwhite font-medium flex-1">{place.name}</span>
          {!place.visited && (
            <span className="text-xs text-blitz-pink/80 bg-blitz-pink/10 rounded px-2 py-1 font-semibold animate-pulse-glow">
              Yet to Visit
            </span>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default SavedPlacesSection;
