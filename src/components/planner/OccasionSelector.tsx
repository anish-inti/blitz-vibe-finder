import React from 'react';
import { Heart, Users, UsersRound, User, Sparkles } from 'lucide-react';

type Occasion = 'romantic' | 'family' | 'friendly' | 'solo' | '';

interface OccasionSelectorProps {
  onSelect: (occasion: Occasion) => void;
}

interface OccasionOption {
  id: Occasion;
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const OccasionSelector: React.FC<OccasionSelectorProps> = ({ onSelect }) => {
  const options: OccasionOption[] = [
    {
      id: 'romantic',
      label: 'Romantic',
      description: 'Intimate moments for two',
      icon: <Heart className="w-6 h-6" />,
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      id: 'family',
      label: 'Family',
      description: 'Quality time with loved ones',
      icon: <Users className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'friendly',
      label: 'Friends',
      description: 'Fun times with your crew',
      icon: <UsersRound className="w-6 h-6" />,
      gradient: 'from-blitz-primary to-blitz-accent'
    },
    {
      id: 'solo',
      label: 'Solo',
      description: 'Me time and self-discovery',
      icon: <User className="w-6 h-6" />,
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 animate-fade-in">
      {options.map((option, index) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`
            group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300
            bg-gradient-to-br ${option.gradient} hover:shadow-xl hover:shadow-${option.gradient.split('-')[1]}-500/20
            hover:scale-105 active:scale-95 interactive
          `}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white/90 group-hover:text-white transition-colors">
                {option.icon}
              </div>
              <Sparkles className="w-4 h-4 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow" />
            </div>
            
            <h3 className="text-white font-bold text-lg mb-1">
              {option.label}
            </h3>
            
            <p className="text-white/80 text-sm leading-relaxed">
              {option.description}
            </p>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      ))}
    </div>
  );
};

export default OccasionSelector;