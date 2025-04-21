
import React from 'react';
import { Check, X, ArrowUp } from 'lucide-react';

const SwipeActions: React.FC = () => (
  <div className="flex justify-between items-center mt-6 px-6 py-3 glassmorphism rounded-full w-64 mx-auto">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 flex items-center justify-center bg-blitz-gray/60 rounded-full">
        <X className="w-4.5 h-4.5 text-white" />
      </div>
      <span className="text-xs text-blitz-lightgray mt-1.5">Skip</span>
    </div>
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 flex items-center justify-center bg-blitz-gray/60 rounded-full">
        <ArrowUp className="w-4.5 h-4.5 text-white" />
      </div>
      <span className="text-xs text-blitz-lightgray mt-1.5">Book</span>
    </div>
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 flex items-center justify-center bg-blitz-pink rounded-full">
        <Check className="w-4.5 h-4.5 text-white" />
      </div>
      <span className="text-xs text-blitz-lightgray mt-1.5">Like</span>
    </div>
  </div>
);

export default SwipeActions;
