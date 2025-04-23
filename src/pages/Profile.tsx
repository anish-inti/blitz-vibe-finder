
import React, { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import UserHeader from "@/components/profile/UserHeader";
import SavedPlacesSection from "@/components/profile/SavedPlacesSection";
import PreferencesPanel from "@/components/profile/PreferencesPanel";
import OutingHistoryTimeline from "@/components/profile/OutingHistoryTimeline";

const Profile: React.FC = () => {
  // Dark mode toggle; in real use, connect to app-wide theme context
  const [darkMode, setDarkMode] = useState(true);

  // For demo only, hardcoding "Anish"
  const name = "Anish";
  const avatarUrl = undefined;

  // Optionally switch className/bg by darkMode state
  return (
    <div className={`min-h-screen flex flex-col relative transition-all duration-300 ${darkMode ? "bg-blitz-black" : "bg-blitz-offwhite"}`}>
      <div className="cosmic-bg absolute inset-0 z-0 pointer-events-none" />
      <Header />

      <main className="flex-1 flex flex-col px-4 pb-20 z-10 fade-in">
        <section className="w-full max-w-md mx-auto mt-8 mb-6">
          <UserHeader name={name} avatarUrl={avatarUrl} />
        </section>
        <section className="w-full max-w-md mx-auto">
          <SavedPlacesSection />
          <PreferencesPanel darkMode={darkMode} setDarkMode={setDarkMode} />
          <OutingHistoryTimeline />
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
