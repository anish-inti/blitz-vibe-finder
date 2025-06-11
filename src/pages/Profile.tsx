import React from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import UserHeader from "@/components/profile/UserHeader";
import SavedPlacesSection from "@/components/profile/SavedPlacesSection";
import PreferencesPanel from "@/components/profile/PreferencesPanel";
import OutingHistoryTimeline from "@/components/profile/OutingHistoryTimeline";
import { useTheme } from "@/contexts/ThemeContext";
import { Sparkles, TrendingUp, MapPin, Heart } from "lucide-react";

const Profile: React.FC = () => {
  const { darkMode, setDarkMode } = useTheme();
  const name = "Anish";
  const avatarUrl = undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Luxury background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-8 w-24 h-24 bg-blitz-primary/3 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-32 right-8 w-32 h-32 bg-blitz-secondary/3 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <Header showBackButton title="Profile" />

      <main className="relative flex-1 px-6 pb-24 pt-8">
        <div className="max-w-md mx-auto space-y-8">
          {/* User Header - Enhanced */}
          <div className="text-center space-y-6 animate-fade-in">
            <UserHeader name={name} avatarUrl={avatarUrl} darkMode={darkMode} />
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="card-spotify rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gradient mb-1">12</div>
                <div className="text-xs text-muted-foreground">Places Visited</div>
              </div>
              <div className="card-spotify rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gradient">8</div>
                <div className="text-xs text-muted-foreground">Saved</div>
              </div>
              <div className="card-spotify rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gradient">4.8</div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 animate-slide-up">
            <button className="card-hero rounded-2xl p-6 text-left interactive-glow group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-blitz-primary/10">
                  <Heart className="w-5 h-5 text-blitz-primary" />
                </div>
                <Sparkles className="w-4 h-4 text-blitz-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Favorites</h3>
              <p className="text-sm text-muted-foreground">View saved places</p>
            </button>

            <button className="card-hero rounded-2xl p-6 text-left interactive-glow group">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-blitz-secondary/10">
                  <TrendingUp className="w-5 h-5 text-blitz-secondary" />
                </div>
                <Sparkles className="w-4 h-4 text-blitz-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-bold text-foreground mb-1">Activity</h3>
              <p className="text-sm text-muted-foreground">Your journey</p>
            </button>
          </div>

          {/* Enhanced Sections */}
          <div className="space-y-6 animate-bounce-in">
            <SavedPlacesSection darkMode={darkMode} />
            <PreferencesPanel darkMode={darkMode} setDarkMode={setDarkMode} />
            <OutingHistoryTimeline darkMode={darkMode} />
          </div>

          {/* Achievement Badge */}
          <div className="card-hero rounded-2xl p-6 text-center animate-scale-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Explorer Badge</h3>
            <p className="text-sm text-muted-foreground">
              You've discovered 12 amazing places in Chennai!
            </p>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;