
import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto mt-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`relative glassmorphism rounded-full transition-all duration-300 ${
            isFocused ? 'neon-glow ring-2 ring-blitz-pink shadow-lg' : 'shadow border border-blitz-pink/30'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blitz-purple/10 to-blitz-pink/10 rounded-full"></div>
          
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe your ideal outing..."
            className="w-full py-4 pl-5 pr-12 text-base bg-transparent rounded-full focus:outline-none text-white placeholder-gray-400"
          />
          
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-blitz-pink text-white p-3 rounded-full hover:bg-blitz-pink/80 transition-all hover:shadow-lg hover:shadow-blitz-pink/30"
          >
            {isFocused ? (
              <Sparkles className="w-5 h-5 animate-pulse-glow" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptInput;
