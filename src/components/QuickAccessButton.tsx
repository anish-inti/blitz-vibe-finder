import React from 'react';

interface QuickAccessButtonProps {
  name: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  gradient?: string;
}

const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({ 
  name, 
  icon, 
  isActive = false, 
  onClick,
  gradient = 'from-blitz-primary to-blitz-accent'
}) => {
  return (
    <button
      className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 interactive group relative overflow-hidden ${
        isActive 
          ? `bg-gradient-to-br ${gradient} text-white shadow-lg` 
          : 'card-spotify hover:shadow-lg'
      }`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      {/* Background glow effect - more subtle */}
      {isActive && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 animate-pulse-glow`} />
      )}
      
      <div className={`relative transition-transform duration-300 group-hover:scale-105 ${
        isActive ? 'animate-bounce-in' : ''
      }`}>
        <div className="text-xl mb-2">{icon}</div>
        <span className="text-xs font-bold">{name}</span>
      </div>
      
      {/* Hover effect - more subtle */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    </button>
  );
};

export default QuickAccessButton;