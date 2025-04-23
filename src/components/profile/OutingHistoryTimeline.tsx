
import React from "react";
import { History } from "lucide-react";

const outings = [
  {
    id: 1,
    date: "2024-04-19",
    plan: "Friday Hangout",
    places: ["Neon Nights Bar", "Arcade Arena"],
    friends: ["Priya", "Samir"],
    reactions: "🔥 Awesome time!",
  },
  {
    id: 2,
    date: "2024-04-06",
    plan: "Chill Evening",
    places: ["Chai Palace"],
    friends: ["Veer"],
    reactions: "Loved the chai & vibes!",
  },
];

const OutingHistoryTimeline: React.FC = () => (
  <section>
    <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
      <History className="w-5 h-5 text-blitz-blue" /> Outing History
    </h3>
    <ol className="relative border-l-2 border-blitz-pink/20 pl-5">
      {outings.map((outing) => (
        <li key={outing.id} className="mb-6 ml-2">
          <div className="absolute -left-3 mt-1 w-3 h-3 bg-blitz-pink rounded-full border-2 border-white"></div>
          <span className="block text-xs text-blitz-lightgray mb-1">{outing.date}</span>
          <div className="bg-blitz-gray/60 rounded-lg px-4 py-3 text-blitz-offwhite shadow-md">
            <div className="font-bold mb-1">{outing.plan}</div>
            <div className="mb-1">
              <span className="font-semibold text-blitz-pink">Visited:</span>{" "}
              {outing.places.join(", ")}
            </div>
            <div className="mb-1">
              <span className="font-semibold text-blitz-stardust">Friends:</span>{" "}
              {outing.friends.join(", ")}
            </div>
            <div>
              <span className="text-sm italic text-blitz-lightgray">“{outing.reactions}”</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

export default OutingHistoryTimeline;
