
import React from 'react';
import { Heart, Users, UsersRound, PersonStanding, Sparkles } from 'lucide-react';

type Occasion = 'romantic' | 'family' | 'friendly' | 'solo' | '';

interface OccasionSelectorProps {
  onSelect: (occasion: Occasion) => void;
}

interface OccasionOption {
  id: Occasion;
  label: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
}

const OccasionSelector: React.FC<OccasionSelectorProps> = ({ onSelect }) => {
  const options: OccasionOption[] = [
    {
      id: 'romantic',
      label: 'Romantic',
      icon: <Heart className="w-8 h-8" />,
      color: 'text-blitz-neonred',
      borderColor: 'border-blitz-neonred'
    },
    {
      id: 'family',
      label: 'Family',
      icon: <Users className="w-8 h-8" />,
      color: 'text-blitz-pink',
      borderColor: 'border-blitz-pink'
    },
    {
      id: 'friendly',
      label: 'Friends',
      icon: <UsersRound className="w-8 h-8" />,
      color: 'text-blitz-purple',
      borderColor: 'border-blitz-purple'
    },
    {
      id: 'solo',
      label: 'Solo',
      icon: <PersonStanding className="w-8 h-8" />,
      color: 'text-blitz-blue',
      borderColor: 'border-blitz-blue'
    }
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-center text-white neon-text">
        What's the occasion?
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`
              flex flex-col items-center justify-center p-6 rounded-xl
              bg-black/50 border-2 ${option.borderColor} 
              hover:shadow-lg hover:shadow-${option.borderColor.replace('border-', '')}/30
              transition-all duration-300 hover:scale-105 group
            `}
          >
            <div className="relative">
              <div className={`${option.color} group-hover:animate-pulse-glow`}>
                {option.icon}
              </div>
              <Sparkles className="w-3 h-3 text-blitz-stardust absolute -top-1 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className={`mt-3 font-medium ${option.color}`}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OccasionSelector;
