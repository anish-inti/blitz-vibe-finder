import React from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Heart, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const FAVORITE_PLACES = [
  {
    id: '1',
    name: 'VM Food Street',
    location: 'Chennai, India',
    image: '/lovable-uploads/b752b4f7-2a81-4715-a676-9c7bd1f9c93c.png',
  },
];

const Favorites: React.FC = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col relative transition-all duration-300 ${darkMode ? "bg-blitz-black" : "bg-blitz-offwhite"}`}>
      <div className={`cosmic-bg absolute inset-0 z-0 ${darkMode ? "opacity-100" : "opacity-20"}`}></div>
      
      <Header />
      
      <main className="flex-1 flex flex-col px-6 pb-20 z-10">
        <div className="w-full max-w-md mx-auto mt-8">
          <h1 className={`text-2xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-blitz-black"} neon-text relative`}>
            Your Favorites
            <Sparkles className="absolute -right-6 top-1 w-4 h-4 text-blitz-stardust animate-pulse-glow" />
          </h1>
          
          {FAVORITE_PLACES.length > 0 ? (
            <div className="grid gap-4">
              {FAVORITE_PLACES.map((place) => (
                <div 
                  key={place.id}
                  className={`glassmorphism rounded-xl shadow-md overflow-hidden flex animate-fade-in transition-colors ${darkMode ? "border-blitz-pink/20" : "border-gray-200"}`}
                >
                  <div className="w-1/3">
                    <img 
                      src={place.image} 
                      alt={place.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-blitz-black"}`}>{place.name}</h3>
                      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{place.location}</p>
                    </div>
                    <div className="flex justify-end">
                      <button className="text-blitz-neonred">
                        <Heart className="w-5 h-5 fill-blitz-neonred" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 glassmorphism rounded-xl transition-colors ${darkMode ? "" : "bg-white/80 border border-gray-200"}`}>
              <Heart className="w-12 h-12 mx-auto text-blitz-pink/50 mb-4" />
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>You haven't saved any favorites yet</p>
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Favorites;
