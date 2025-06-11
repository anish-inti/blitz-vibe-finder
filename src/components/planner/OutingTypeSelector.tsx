import React from 'react';
import { UtensilsCrossed, TreePine, Coffee, Music, Sparkles, ShoppingBag } from 'lucide-react';

type OutingType = 'restaurant' | 'outdoors' | 'cafe' | 'nightlife' | 'shopping' | '';

interface OutingTypeSelectorProps {
  onSelect: (type: OutingType) => void;
}

interface TypeOption {
  id: OutingType;
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const OutingTypeSelector: React.FC<OutingTypeSelectorProps> = ({ onSelect }) => {
  const options: TypeOption[] = [
    {
      id: 'restaurant',
      label: 'Dining',
      description: 'Culinary experiences',
      icon: <UtensilsCrossed className="w-6 h-6" />,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'cafe',
      label: 'Café',
      description: 'Coffee & conversations',
      icon: <Coffee className="w-6 h-6" />,
      gradient: 'from-amber-500 to-yellow-500'
    },
    {
      id: 'outdoors',
      label: 'Outdoors',
      description: 'Nature & fresh air',
      icon: <TreePine className="w-6 h-6" />,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'nightlife',
      label: 'Nightlife',
      description: 'Evening entertainment',
      icon: <Music className="w-6 h-6" />,
      gradient: 'from-blitz-primary to-blitz-accent'
    },
    {
      id: 'shopping',
      label: 'Shopping',
      description: 'Retail therapy',
      icon: <ShoppingBag className="w-6 h-6" />,
      gradient: 'from-blue-500 to-cyan-500'
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
            bg-gradient-to-br ${option.gradient} hover:shadow-xl
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

export default OutingTypeSelector;