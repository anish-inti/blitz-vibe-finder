import React, { useState } from "react";
import { Settings, Sun, Moon, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const moods = ["Chill", "Adventurous", "Romantic", "Family"];
const budgets = ["Budget", "Mid-range", "Premium"];
const diets = ["Any", "Vegetarian-friendly", "Vegan"];

const PreferencesPanel: React.FC<{
  darkMode: boolean;
  setDarkMode: (on: boolean) => void;
}> = ({ darkMode, setDarkMode }) => {
  const [budget, setBudget] = useState("Mid-range");
  const [diet, setDiet] = useState("Vegetarian-friendly");
  const [mood, setMood] = useState("Chill");

  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-2 text-headline text-foreground">
        <Settings className="w-5 h-5 text-blitz-primary" /> 
        Preferences
      </h3>
      
      <div className="card-hero rounded-2xl p-6 space-y-6">
        {/* Budget */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">Budget Preference</label>
          <div className="grid grid-cols-3 gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-3 py-2 rounded-xl font-semibold text-sm transition-all interactive ${
                  budget === b 
                    ? "bg-gradient-to-r from-blitz-primary to-blitz-accent text-white shadow-lg" 
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Diet */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">Dietary Preference</label>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blitz-primary focus:border-transparent"
          >
            {diets.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Mood */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">Current Mood</label>
          <div className="grid grid-cols-2 gap-2">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-3 py-2 rounded-xl font-semibold text-sm transition-all interactive ${
                  mood === m 
                    ? "bg-gradient-to-r from-blitz-secondary to-blitz-primary text-white shadow-lg" 
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blitz-primary/10">
              <Palette className="w-4 h-4 text-blitz-primary" />
            </div>
            <span className="font-semibold text-foreground">Dark Mode</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-muted-foreground" />
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="data-[state=checked]:bg-blitz-primary"
            />
            <Moon className="w-4 h-4 text-blitz-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreferencesPanel;