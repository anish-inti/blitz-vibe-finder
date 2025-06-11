import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  placeholder?: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  onSubmit, 
  placeholder = "Describe your ideal outing..." 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt(''); // Clear input after submission
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto mt-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`relative glassmorphism rounded-full transition-all duration-300 ${
            isFocused ? 'neon-red-glow ring-2 ring-blitz-neonred shadow-lg shadow-blitz-neonred/30' : 'shadow border border-blitz-neonred/40'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blitz-neonred/10 to-blitz-pink/10 rounded-full"></div>
          
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full py-4 pl-5 pr-12 text-base bg-transparent rounded-full focus:outline-none text-white placeholder-gray-400"
          />
          
          <button
            type="submit"
            disabled={!prompt.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-blitz-neonred text-white p-3 rounded-full hover:bg-blitz-neonred/80 transition-all hover:shadow-lg hover:shadow-blitz-neonred/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFocused ? (
              <Sparkles className="w-5 h-5 animate-pulse-glow" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
      
      {/* Example prompts */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400 mb-2">Try examples like:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setPrompt("6 of us want rooftop vibes under ₹500")}
            className="px-3 py-1 bg-blitz-purple/20 text-blitz-purple rounded-full text-xs hover:bg-blitz-purple/30 transition-colors border border-blitz-purple/30"
          >
            "6 of us want rooftop vibes under ₹500"
          </button>
          <button
            onClick={() => setPrompt("romantic dinner for 2 people")}
            className="px-3 py-1 bg-blitz-pink/20 text-blitz-pink rounded-full text-xs hover:bg-blitz-pink/30 transition-colors border border-blitz-pink/30"
          >
            "romantic dinner for 2 people"
          </button>
          <button
            onClick={() => setPrompt("outdoor cafe with good wifi")}
            className="px-3 py-1 bg-blitz-blue/20 text-blitz-blue rounded-full text-xs hover:bg-blitz-blue/30 transition-colors border border-blitz-blue/30"
          >
            "outdoor cafe with good wifi"
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;