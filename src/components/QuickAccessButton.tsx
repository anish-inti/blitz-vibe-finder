import React from 'react';

interface QuickAccessButtonProps {
  name: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({ 
  name, 
  icon, 
  isActive = false, 
  onClick 
}) => {
  return (
    <button
      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-blitz-primary text-white' 
          : 'bg-card hover:bg-accent'
      }`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <div className="text-xl mb-1">{icon}</div>
      <span className="text-xs font-medium">{name}</span>
    </button>
  );
};

export default QuickAccessButton;