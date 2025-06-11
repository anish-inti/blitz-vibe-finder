import React from "react";
import { Bookmark, MapPin, Star } from "lucide-react";

interface SavedPlacesSectionProps {
  darkMode?: boolean;
}

const dummyPlaces = [
  { id: 1, name: "La Pizzeria", tag: "Dining", visited: false, rating: 4.5, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop" },
  { id: 2, name: "Lakeview Park", tag: "Outdoor", visited: true, rating: 4.2, image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop" },
  { id: 3, name: "Neon Nights Bar", tag: "Nightlife", visited: false, rating: 4.7, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100&h=100&fit=crop" },
  { id: 4, name: "Arcade Arena", tag: "Entertainment", visited: true, rating: 4.3, image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop" },
];

const tagColors: Record<string, { gradient: string }> = {
  Dining: { gradient: "from-orange-500 to-red-500" },
  Outdoor: { gradient: "from-green-500 to-emerald-500" },
  Nightlife: { gradient: "from-blitz-primary to-blitz-accent" },
  Entertainment: { gradient: "from-blue-500 to-cyan-500" },
};

const SavedPlacesSection: React.FC<SavedPlacesSectionProps> = ({ darkMode = true }) => (
  <section className="space-y-4">
    <h3 className="flex items-center gap-2 text-headline text-foreground">
      <Bookmark className="w-5 h-5 text-blitz-primary" /> 
      Saved Places
    </h3>
    
    <div className="space-y-3">
      {dummyPlaces.map((place, index) => (
        <div
          key={place.id}
          className="card-spotify rounded-2xl p-4 interactive-glow animate-scale-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center space-x-4">
            {/* Image */}
            <div 
              className="w-12 h-12 rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${place.image})` }}
            />
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground line-clamp-1">{place.name}</h4>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium">{place.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
                    tagColors[place.tag]?.gradient || "from-gray-500 to-gray-600"
                  }`}
                >
                  {place.tag}
                </span>
                
                {!place.visited && (
                  <span className="text-xs font-semibold text-blitz-secondary animate-pulse-glow">
                    Yet to Visit
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default SavedPlacesSection;