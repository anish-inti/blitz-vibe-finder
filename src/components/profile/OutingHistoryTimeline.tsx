import React from "react";
import { CalendarDays, Users, MapPin, Clock, Star } from "lucide-react";

interface OutingHistoryTimelineProps {
  darkMode?: boolean;
}

const dummyOutings = [
  {
    id: 1,
    date: "April 19, 2025",
    title: "Weekend Adventure",
    places: [
      { id: 1, name: "Mountain Trail Hike", type: "outdoor", rating: 4.8 },
      { id: 2, name: "Lakeside Café", type: "food", rating: 4.5 },
    ],
    participants: ["Alex", "Maya", "Ravi"],
    timeSpent: "5h 30m",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    date: "April 10, 2025",
    title: "Date Night",
    places: [
      { id: 1, name: "The Secret Garden Restaurant", type: "food", rating: 4.9 },
      { id: 2, name: "Starlight Rooftop Bar", type: "nightlife", rating: 4.7 },
    ],
    participants: ["Kira"],
    timeSpent: "3h 15m",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop"
  },
];

const getTypeColor = (type: string) => {
  const colors = {
    food: "from-orange-500 to-red-500",
    outdoor: "from-green-500 to-emerald-500",
    nightlife: "from-blitz-primary to-blitz-accent",
    default: "from-gray-500 to-gray-600"
  };
  return colors[type as keyof typeof colors] || colors.default;
};

const OutingHistoryTimeline: React.FC<OutingHistoryTimelineProps> = ({ darkMode = true }) => {
  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-2 text-headline text-foreground">
        <CalendarDays className="w-5 h-5 text-blitz-primary" /> 
        Recent Adventures
      </h3>

      <div className="space-y-4">
        {dummyOutings.map((outing, index) => (
          <div
            key={outing.id}
            className="card-hero rounded-2xl p-6 interactive-glow animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex space-x-4">
              {/* Image */}
              <div 
                className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url(${outing.image})` }}
              />
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-foreground">{outing.title}</h4>
                    <span className="text-xs text-muted-foreground">{outing.date}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{outing.timeSpent}</span>
                  </div>
                </div>

                {/* Places */}
                <div className="space-y-2 mb-3">
                  {outing.places.map((place) => (
                    <div key={place.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${getTypeColor(place.type)}`}
                        />
                        <span className="text-sm text-foreground">{place.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{place.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Participants */}
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    With {outing.participants.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OutingHistoryTimeline;