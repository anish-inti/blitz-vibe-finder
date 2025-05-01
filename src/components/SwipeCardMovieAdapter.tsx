
import React from 'react';
import { Place } from './SwipeCard';
import MovieCard from './MovieCard';

interface SwipeCardMovieAdapterProps {
  place: Place & { isMovie?: boolean };
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
}

const SwipeCardMovieAdapter: React.FC<SwipeCardMovieAdapterProps> = ({ place, onSwipe }) => {
  if (!place.isMovie) {
    // If it's not a movie, return null - the parent will render the regular SwipeCard
    return null;
  }
  
  // Convert the place object to movie format
  const movie = {
    id: place.id,
    name: place.name,
    image: place.image,
    description: place.description,
    rating: place.rating,
    genre: place.genre || [],
    duration: place.duration,
    releaseDate: place.releaseDate,
    language: place.language,
    bookingLinks: place.bookingLinks
  };
  
  return (
    <div className="swipe-card w-full overflow-hidden relative max-w-md mx-auto">
      <MovieCard movie={movie} />
    </div>
  );
};

export default SwipeCardMovieAdapter;
