
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
      <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
        <Settings className="w-5 h-5 text-blitz-lightgray" /> Preferences
      </h3>
      <div className="space-y-5 bg-blitz-gray/80 rounded-xl p-5 border border-white/10 shadow-inner">
        {/* Budget */}
        <div>
          <label className="block text-xs uppercase tracking-wide text-blitz-lightgray mb-1">Budget</label>
          <div className="flex gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-3 py-1 rounded-lg font-semibold text-blitz-offwhite transition-all ${
                  budget === b ? "bg-blitz-pink/40 ring-2 ring-blitz-pink" : "bg-blitz-black/30 hover:bg-blitz-pink/10"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
        {/* Diet */}
        <div>
          <label className="block text-xs uppercase tracking-wide text-blitz-lightgray mb-1">Dietary Preference</label>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="bg-blitz-gray px-3 py-1 rounded-lg text-blitz-offwhite border-none focus:ring-2 focus:ring-blitz-pink"
          >
            {diets.map((option) => (
              <option value={option} key={option} className="bg-blitz-black text-blitz-offwhite">
                {option}
              </option>
            ))}
          </select>
        </div>
        {/* Mood */}
        <div>
          <label className="block text-xs uppercase tracking-wide text-blitz-lightgray mb-1">Mood</label>
          <div className="flex gap-2 flex-wrap">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-3 py-1 rounded-lg font-semibold text-blitz-offwhite transition-all ${
                  mood === m ? "bg-blitz-pink/40 ring-2 ring-blitz-pink" : "bg-blitz-black/30 hover:bg-blitz-pink/10"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        {/* Dark Mode */}
        <div className="flex items-center gap-2">
          <span className="text-blitz-lightgray mr-1">Dark Mode</span>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            className="bg-blitz-gray border border-blitz-pink/30 focus-visible:ring-blitz-pink"
          />
          {darkMode ? <Moon className="w-4 h-4 text-blitz-pink ml-1" /> : <Sun className="w-4 h-4 text-blitz-stardust ml-1" />}
        </div>
      </div>
    </section>
  );
};

export default PreferencesPanel;
