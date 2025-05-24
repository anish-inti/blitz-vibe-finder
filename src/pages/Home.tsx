
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Search, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const quickActions = [
    {
      title: 'Plan Outing',
      description: 'Find the perfect place for your next adventure',
      icon: Calendar,
      action: () => navigate('/planner'),
      color: 'bg-blitz-pink'
    },
    {
      title: 'Discover Places',
      description: 'Swipe through amazing places near you',
      icon: Search,
      action: () => navigate('/places'),
      color: 'bg-purple-500'
    },
    {
      title: 'Your Favorites',
      description: 'Revisit places you loved',
      icon: Heart,
      action: () => navigate('/favorites'),
      color: 'bg-red-500'
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-blitz-black' : 'bg-blitz-offwhite'}`}>
      <div className="cosmic-bg absolute inset-0 z-0"></div>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20 z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-blitz-black'}`}>
              Blitz
            </h1>
            <Sparkles className="ml-2 h-8 w-8 text-blitz-pink animate-pulse-glow" />
          </div>
          <p className={`text-lg ${darkMode ? 'text-blitz-lightgray' : 'text-blitz-gray'}`}>
            Your perfect outing, planned in a flash
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                className={`w-full h-20 ${action.color} hover:opacity-90 text-white rounded-xl flex items-center justify-start p-6 transition-all duration-200 active:scale-95`}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
