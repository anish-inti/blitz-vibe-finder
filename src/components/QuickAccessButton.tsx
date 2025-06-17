import React from 'react';

interface QuickAccessButtonProps {
  name: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  color?: string;
}

const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({ 
  name, 
  icon, 
  isActive = false, 
  onClick,
  color = 'bg-[hsl(var(--blitz-primary))]'
}) => {
  return (
    <button
      className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 interactive group relative overflow-hidden border-2 ${
        isActive 
          ? `${color} text-white shadow-lg border-white/20` 
          : 'card-spotify hover:shadow-lg border-transparent hover:border-[hsl(var(--blitz-primary))]/20'
      }`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <div className={`relative transition-transform duration-300 group-hover:scale-105 ${
        isActive ? 'animate-bounce-in' : ''
      }`}>
        <div className="text-xl mb-2">{icon}</div>
        <span className="text-xs font-bold">{name}</span>
      </div>
      
      {/* Hover effect with better visibility */}
      {!isActive && (
        <div className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
      )}
    </button>
  );
};

export default QuickAccessButton;