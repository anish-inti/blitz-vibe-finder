
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 ${darkMode ? 'bg-blitz-black' : 'bg-blitz-offwhite'}`}>
      <div className={`text-center ${darkMode ? 'text-white' : 'text-blitz-black'}`}>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className={`mb-8 ${darkMode ? 'text-blitz-lightgray' : 'text-blitz-gray'}`}>
          The page you're looking for doesn't exist.
        </p>
        <Button 
          onClick={() => navigate('/home')}
          className="bg-blitz-pink hover:bg-blitz-pink/90 text-white"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
