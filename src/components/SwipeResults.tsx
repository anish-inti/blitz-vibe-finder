
import React from 'react';
import { Place } from './SwipeCard';

interface SwipeResultsProps {
  likedPlaces: Place[];
  onContinue: () => void;
  onFinish: () => void;
}

const SwipeResults: React.FC<SwipeResultsProps> = ({ likedPlaces, onContinue, onFinish }) => (
  <div className="animate-fade-in text-center">
    <div className="glassmorphism rounded-2xl p-7">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Your Blitz Plan
      </h2>
      <p className="text-blitz-lightgray mb-6 text-sm">
        You've liked {likedPlaces.length} {likedPlaces.length === 1 ? 'place' : 'places'}!
        <br />
        <span className="text-xs text-blitz-pink mt-1 inline-block">Saved to your profile</span>
      </p>
      {likedPlaces.length > 0 ? (
        <div className="mb-6 max-h-64 overflow-y-auto">
          {likedPlaces.map(place => (
            <div 
              key={place.id} 
              className="flex items-center p-3 mb-2 bg-blitz-gray/50 rounded-xl"
            >
              <img 
                src={place.image} 
                alt={place.name} 
                className="w-12 h-12 rounded-xl object-cover mr-3" 
              />
              <div className="text-left">
                <h3 className="text-white text-sm font-medium">{place.name}</h3>
                <p className="text-xs text-blitz-lightgray">{place.location}, {place.country}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-blitz-pink mb-6 text-sm">
          You didn't like any places. Let's try again!
        </p>
      )}
      <div className="flex justify-center gap-4">
        <button
          onClick={onContinue}
          className="px-6 py-2.5 text-sm border border-white/10 text-white rounded-full bg-blitz-gray/50 hover:bg-blitz-gray/70 transition-all active:scale-[0.98]"
        >
          Continue
        </button>
        <button
          onClick={onFinish}
          className="px-6 py-2.5 text-sm bg-blitz-pink text-white rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          Finish
        </button>
      </div>
    </div>
  </div>
);

export default SwipeResults;
