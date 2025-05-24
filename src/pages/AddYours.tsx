
import React from 'react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { useTheme } from '@/contexts/ThemeContext';

const AddYours: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-blitz-black' : 'bg-blitz-offwhite'}`}>
      <Header title="Add Your Place" showBackButton />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20">
        <div className={`text-center ${darkMode ? 'text-white' : 'text-blitz-black'}`}>
          <h2 className="text-2xl font-semibold mb-4">Add Your Place</h2>
          <p className={darkMode ? 'text-blitz-lightgray' : 'text-blitz-gray'}>
            Share your favorite places with the community
          </p>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default AddYours;
