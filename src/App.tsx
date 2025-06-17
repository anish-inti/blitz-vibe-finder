import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocationProvider } from "@/contexts/LocationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import SafeAreaWrapper from "@/components/MobileOptimized/SafeAreaWrapper";

// Pages
import Home from "./pages/Home";
import Places from "./pages/Places";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Planner from "./pages/Planner";
import SwipePage from "./pages/SwipePage";
import AddYours from "./pages/AddYours";
import SharedPlan from "./pages/SharedPlan";
import PlaceDetail from "./pages/PlaceDetail";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      if (Capacitor.isNativePlatform()) {
        // Hide splash screen after app loads
        await SplashScreen.hide();
        
        // Set status bar style
        if (Capacitor.getPlatform() === 'ios') {
          await StatusBar.setStyle({ style: Style.Dark });
        }
        
        // Add capacitor-app class for native-specific styles
        document.body.classList.add('capacitor-app');
      }
    };

    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <LocationProvider>
              <SafeAreaWrapper>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/places" element={<Places />} />
                    <Route path="/places/:id" element={<PlaceDetail />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/planner" element={<Planner />} />
                    <Route path="/swipe" element={<SwipePage />} />
                    <Route path="/add" element={<AddYours />} />
                    <Route path="/plan/:shareToken" element={<SharedPlan />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </SafeAreaWrapper>
            </LocationProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;