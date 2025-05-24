
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { darkMode } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors ${darkMode ? "bg-blitz-black" : "bg-blitz-offwhite"}`}>
      <div className="text-center">
        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>404</h1>
        <p className={`text-xl mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Oops! Page not found</p>
        <a href="/" className="text-blitz-pink hover:text-blitz-purple underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
