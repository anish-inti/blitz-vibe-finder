
import React, { useState } from "react";
import { Settings, Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const moods = ["Chill", "Adventurous", "Romantic", "Family"];
const budgets = ["$", "$$", "$$$"];
const diets = ["Any", "Vegetarian-friendly", "Vegan"];

const PreferencesPanel: React.FC<{
  darkMode: boolean;
  setDarkMode: (on: boolean) => void;
}> = ({ darkMode, setDarkMode }) => {
  const [budget, setBudget] = useState("$$");
  const [diet, setDiet] = useState("Vegetarian-friendly");
  const [mood, setMood] = useState("Chill");

  return (
    <section className="mb-8">
      <h3 className={`flex items-center gap-2 text-lg font-semibold ${darkMode ? "text-white" : "text-blitz-black"} mb-3`}>
        <Settings className={`w-5 h-5 ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"}`} /> Preferences
      </h3>
      <div className={`space-y-5 rounded-xl p-5 border shadow-inner ${
        darkMode 
          ? "bg-blitz-gray/80 border-white/10" 
          : "bg-white/90 border-gray-200"
      }`}>
        {/* Budget */}
        <div>
          <label className={`block text-xs uppercase tracking-wide ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"} mb-1`}>Budget</label>
          <div className="flex gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  budget === b 
                    ? darkMode 
                      ? "bg-blitz-pink/40 ring-2 ring-blitz-pink text-blitz-offwhite" 
                      : "bg-blitz-purple/30 ring-2 ring-blitz-purple text-blitz-black"
                    : darkMode 
                      ? "bg-blitz-black/30 hover:bg-blitz-pink/10 text-blitz-offwhite" 
                      : "bg-gray-100 hover:bg-blitz-purple/10 text-blitz-black"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
        {/* Diet */}
        <div>
          <label className={`block text-xs uppercase tracking-wide ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"} mb-1`}>Dietary Preference</label>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className={`px-3 py-1 rounded-lg border-none ${
              darkMode 
                ? "bg-blitz-gray text-blitz-offwhite focus:ring-2 focus:ring-blitz-pink" 
                : "bg-gray-100 text-blitz-black focus:ring-2 focus:ring-blitz-purple"
            }`}
          >
            {diets.map((option) => (
              <option 
                value={option} 
                key={option} 
                className={`${darkMode ? "bg-blitz-black text-blitz-offwhite" : "bg-white text-blitz-black"}`}
              >
                {option}
              </option>
            ))}
          </select>
        </div>
        {/* Mood */}
        <div>
          <label className={`block text-xs uppercase tracking-wide ${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"} mb-1`}>Mood</label>
          <div className="flex gap-2 flex-wrap">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  mood === m 
                    ? darkMode 
                      ? "bg-blitz-pink/40 ring-2 ring-blitz-pink text-blitz-offwhite" 
                      : "bg-blitz-purple/30 ring-2 ring-blitz-purple text-blitz-black"
                    : darkMode 
                      ? "bg-blitz-black/30 hover:bg-blitz-pink/10 text-blitz-offwhite" 
                      : "bg-gray-100 hover:bg-blitz-purple/10 text-blitz-black"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        {/* Dark Mode */}
        <div className="flex items-center gap-2">
          <span className={`${darkMode ? "text-blitz-lightgray" : "text-blitz-gray"} mr-1`}>Dark Mode</span>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            className={`${
              darkMode 
                ? "bg-blitz-gray border border-blitz-pink/30 focus-visible:ring-blitz-pink" 
                : "bg-gray-200 border border-blitz-purple/30 focus-visible:ring-blitz-purple"
            }`}
          />
          {darkMode ? (
            <Moon className="w-4 h-4 text-blitz-pink ml-1" />
          ) : (
            <Sun className="w-4 h-4 text-blitz-purple ml-1" />
          )}
        </div>
      </div>
    </section>
  );
};

export default PreferencesPanel;
