import React, { useState } from 'react';
import { Search, Sparkles, Zap } from 'lucide-react';

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
          className={`relative glassmorphism-strong rounded-2xl transition-all duration-300 ${
            isFocused ? 'ring-2 ring-blitz-primary shadow-xl shadow-blitz-primary/20' : 'shadow-lg'
          }`}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blitz-primary/5 to-blitz-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="w-full py-4 pl-5 pr-14 text-base bg-transparent rounded-2xl focus:outline-none text-foreground placeholder-muted-foreground font-medium"
          />
          
          <button
            type="submit"
            disabled={!prompt.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all duration-300 interactive group ${
              prompt.trim() 
                ? 'btn-primary shadow-lg' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {isFocused && prompt.trim() ? (
              <Zap className="w-5 h-5 group-hover:animate-bounce-in" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
      
      {/* Example prompts */}
      <div className="mt-6 text-center animate-slide-up">
        <p className="text-xs text-muted-foreground mb-3 font-medium">Try examples like:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setPrompt("6 of us want rooftop vibes under ₹500")}
            className="px-3 py-2 bg-gradient-to-r from-blitz-primary/10 to-blitz-secondary/10 text-blitz-primary rounded-xl text-xs font-semibold hover:from-blitz-primary/20 hover:to-blitz-secondary/20 transition-all duration-300 interactive border border-blitz-primary/20"
          >
            "6 of us want rooftop vibes under ₹500"
          </button>
          <button
            onClick={() => setPrompt("romantic dinner for 2 people")}
            className="px-3 py-2 bg-gradient-to-r from-blitz-secondary/10 to-blitz-accent/10 text-blitz-secondary rounded-xl text-xs font-semibold hover:from-blitz-secondary/20 hover:to-blitz-accent/20 transition-all duration-300 interactive border border-blitz-secondary/20"
          >
            "romantic dinner for 2 people"
          </button>
          <button
            onClick={() => setPrompt("outdoor cafe with good wifi")}
            className="px-3 py-2 bg-gradient-to-r from-blitz-accent/10 to-blitz-primary/10 text-blitz-accent rounded-xl text-xs font-semibold hover:from-blitz-accent/20 hover:to-blitz-primary/20 transition-all duration-300 interactive border border-blitz-accent/20"
          >
            "outdoor cafe with good wifi"
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;