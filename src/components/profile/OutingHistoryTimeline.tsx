
import React from "react";
import { CalendarDays, Users, MapPin, Clock } from "lucide-react";

interface OutingHistoryTimelineProps {
  darkMode?: boolean;
}

const dummyOutings = [
  {
    id: 1,
    date: "April 19, 2025",
    title: "Weekend Adventure",
    places: [
      { id: 1, name: "Mountain Trail Hike", type: "outdoor" },
      { id: 2, name: "Lakeside Café", type: "food" },
    ],
    participants: ["Alex", "Maya", "Ravi"],
    timeSpent: "5h 30m",
  },
  {
    id: 2,
    date: "April 10, 2025",
    title: "Date Night",
    places: [
      { id: 1, name: "The Secret Garden Restaurant", type: "food" },
      { id: 2, name: "Starlight Rooftop Bar", type: "nightlife" },
    ],
    participants: ["Kira"],
    timeSpent: "3h 15m",
  },
];

const OutingHistoryTimeline: React.FC<OutingHistoryTimelineProps> = ({ darkMode = true }) => {
  const getTypeColor = (type: string) => {
    if (darkMode) {
      switch (type) {
        case "food":
          return "bg-blitz-pink/20 text-blitz-pink";
        case "outdoor":
          return "bg-blitz-blue/20 text-blitz-blue";
        case "nightlife":
          return "bg-blitz-neonred/20 text-blitz-neonred";
        default:
          return "bg-blitz-purple/20 text-blitz-purple";
      }
    } else {
      switch (type) {
        case "food":
          return "bg-blitz-pink/10 text-blitz-pink";
        case "outdoor":
          return "bg-blitz-blue/10 text-blitz-blue";
        case "nightlife":
          return "bg-blitz-neonred/10 text-blitz-neonred";
        default:
          return "bg-blitz-purple/10 text-blitz-purple";
      }
    }
  };

  return (
    <section className="mb-8">
      <h3 className={`flex items-center gap-2 text-lg font-semibold ${darkMode ? "text-white" : "text-blitz-black"} mb-3`}>
        <CalendarDays className={`w-5 h-5 ${darkMode ? "text-blitz-blue" : "text-blitz-purple"}`} /> Outing History
      </h3>

      <div className="space-y-4">
        {dummyOutings.map((outing) => (
          <div
            key={outing.id}
            className={`rounded-xl p-4 ${
              darkMode
                ? "bg-blitz-gray/40 shadow-sm border border-white/5"
                : "bg-white/80 shadow-sm border border-gray-100"
            }`}
          >
            <div className="mb-3">
              <span className={`text-xs ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"}`}>{outing.date}</span>
              <h4 className={`font-medium ${darkMode ? "text-white" : "text-blitz-black"}`}>{outing.title}</h4>
            </div>

            {/* Places */}
            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1">
                <MapPin className={`w-3.5 h-3.5 ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"}`} />
                <span className={`text-xs ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"}`}>Places Visited</span>
              </div>
              <div className="space-y-1.5 pl-5">
                {outing.places.map((place) => (
                  <div key={place.id} className="flex items-center gap-2">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-sm font-medium ${getTypeColor(place.type)}`}
                    >
                      {place.type.charAt(0).toUpperCase() + place.type.slice(1)}
                    </span>
                    <span className={`text-sm ${darkMode ? "text-blitz-offwhite" : "text-blitz-black"}`}>{place.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Users className={`w-3.5 h-3.5 ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"}`} />
                <span className={`${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"}`}>
                  {outing.participants.join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className={`w-3.5 h-3.5 ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"}`} />
                <span className={`${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"}`}>{outing.timeSpent}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OutingHistoryTimeline;
