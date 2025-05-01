
import { toast } from '@/hooks/use-toast';

export interface Movie {
  id: string;
  name: string;
  image: string;
  releaseDate: string;
  genre: string[];
  rating?: number;
  description?: string;
  duration?: string;
  language?: string;
  bookingLinks: {
    bookMyShow?: string;
    district?: string;
    pvr?: string;
  };
}

// Current movies in theaters (May 2025)
const CURRENT_MOVIES: Movie[] = [
  {
    id: 'movie-1',
    name: 'The Avengers: Secret Wars',
    image: 'https://static.toiimg.com/thumb/msid-89563260,width-1280,height-720,resizemode-4/89563260.jpg',
    releaseDate: '2025-04-25',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 4.7,
    description: 'The Avengers must come together once more to face their greatest threat yet as the multiverse collapses.',
    duration: '2h 45m',
    language: 'English',
    bookingLinks: {
      bookMyShow: 'https://in.bookmyshow.com/explore/movies-avengers',
      district: 'https://district.in/movies/avengers-secret-wars',
      pvr: 'https://www.pvrcinemas.com/movies'
    }
  },
  {
    id: 'movie-2',
    name: 'Fast & Furious 12',
    image: 'https://static.toiimg.com/thumb/msid-89246213,width-1280,height-720,resizemode-4/89246213.jpg',
    releaseDate: '2025-05-01',
    genre: ['Action', 'Crime', 'Thriller'],
    rating: 4.2,
    description: 'Dom and his family face their ultimate challenge as they race against time across the globe.',
    duration: '2h 20m',
    language: 'English',
    bookingLinks: {
      bookMyShow: 'https://in.bookmyshow.com/explore/movies-fast',
      district: 'https://district.in/movies/fast12',
      pvr: 'https://www.pvrcinemas.com/movies'
    }
  },
  {
    id: 'movie-3',
    name: 'Bajrangi Returns',
    image: 'https://static.toiimg.com/thumb/msid-47529300,width-1280,height-720,resizemode-4/47529300.jpg',
    releaseDate: '2025-04-15',
    genre: ['Drama', 'Comedy'],
    rating: 4.8,
    description: 'The heartwarming sequel that takes our hero on another journey across borders to reunite a lost child.',
    duration: '2h 35m',
    language: 'Hindi',
    bookingLinks: {
      bookMyShow: 'https://in.bookmyshow.com/explore/movies-hindi',
      district: 'https://district.in/movies/bajrangi-returns',
      pvr: 'https://www.pvrcinemas.com/movies'
    }
  },
  {
    id: 'movie-4',
    name: 'Robot 3.0',
    image: 'https://static.toiimg.com/thumb/msid-78456276,width-1280,height-720,resizemode-4/78456276.jpg',
    releaseDate: '2025-04-20',
    genre: ['Action', 'Sci-Fi'],
    rating: 4.5,
    description: 'The epic conclusion to the Robot trilogy with groundbreaking visual effects and an emotional storyline.',
    duration: '2h 55m',
    language: 'Tamil, Telugu, Hindi',
    bookingLinks: {
      bookMyShow: 'https://in.bookmyshow.com/explore/movies-tamil',
      district: 'https://district.in/movies/robot3',
      pvr: 'https://www.pvrcinemas.com/movies'
    }
  },
  {
    id: 'movie-5',
    name: 'Mission Chennai',
    image: 'https://static.toiimg.com/thumb/msid-58515261,width-1280,height-720,resizemode-4/58515261.jpg',
    releaseDate: '2025-05-05',
    genre: ['Action', 'Thriller'],
    rating: 4.4,
    description: 'An elite spy must unravel a conspiracy that threatens national security in the heart of Chennai.',
    duration: '2h 15m',
    language: 'Tamil, Hindi',
    bookingLinks: {
      bookMyShow: 'https://in.bookmyshow.com/explore/movies-tamil',
      district: 'https://district.in/movies/mission-chennai',
      pvr: 'https://www.pvrcinemas.com/movies'
    }
  },
  {
    id: 'movie-6',
    name: 'Love in London',
    image: 'https://static.toiimg.com/thumb/msid-75842986,width-1280,height-720,resizemode-4/75842986.jpg',
    releaseDate: '2025-05-10',
    genre: ['Romance', 'Comedy'],
    rating: 4.0,
    description: 'A charming love story that unfolds as two strangers meet in the bustling streets of London.',
    duration: '2h 10m',
    language: 'Hindi',
    bookingLinks: {
      bookMyShow: 'https://in.bookmyshow.com/explore/movies-romance',
      district: 'https://district.in/movies/love-london',
      pvr: 'https://www.pvrcinemas.com/movies'
    }
  }
];

export function getMovieById(id: string): Movie | undefined {
  return CURRENT_MOVIES.find(movie => movie.id === id);
}

export function searchMovies(query: string = ''): Movie[] {
  if (!query) return CURRENT_MOVIES;
  
  const lowerQuery = query.toLowerCase();
  return CURRENT_MOVIES.filter(movie => 
    movie.name.toLowerCase().includes(lowerQuery) ||
    movie.genre.some(g => g.toLowerCase().includes(lowerQuery))
  );
}

export function getMoviePlaces(): any[] {
  // Transform movies into place-like objects for the SwipeCard component
  return CURRENT_MOVIES.map(movie => ({
    id: movie.id,
    name: movie.name,
    location: `In Theaters`,
    country: 'India',
    image: movie.image,
    description: movie.description,
    rating: movie.rating,
    reviewCount: Math.floor(Math.random() * 500) + 100,
    category: 'Movie',
    isOpen: true,
    isMovie: true, // Special flag to identify movie cards
    genre: movie.genre,
    releaseDate: movie.releaseDate,
    duration: movie.duration,
    language: movie.language,
    bookingLinks: movie.bookingLinks
  }));
}
