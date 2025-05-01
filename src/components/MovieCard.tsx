
import React, { useState } from 'react';
import { Ticket, Star, Clock, Calendar, Languages, X, ExternalLink } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MovieCardProps {
  movie: {
    id: string;
    name: string;
    image: string;
    description?: string;
    rating?: number;
    genre?: string[];
    duration?: string;
    releaseDate?: string;
    language?: string;
    bookingLinks?: {
      bookMyShow?: string;
      district?: string;
      pvr?: string;
    };
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <>
      <div 
        className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        {/* Movie Image */}
        <img 
          src={movie.image} 
          alt={movie.name} 
          className="w-full h-full object-cover rounded-2xl"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent via-blitz-black/40 to-blitz-black/90 rounded-2xl"></div>
        
        {/* Movie Badge */}
        <div className="absolute top-4 left-4">
          <div className="inline-block bg-blitz-pink/80 backdrop-blur-md px-2 py-0.5 rounded-full text-xs text-white">
            <Ticket className="w-3 h-3 inline-block mr-1" />
            Movie
          </div>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="text-xl font-semibold mb-1.5">{movie.name}</h2>
          
          {/* Rating */}
          {movie.rating && (
            <div className="flex items-center text-xs mb-1">
              <Star className="w-3.5 h-3.5 mr-1 text-yellow-400 fill-yellow-400" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          )}
          
          {/* Genre Tags */}
          {movie.genre && movie.genre.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {movie.genre.map((genre, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-blitz-black/30 backdrop-blur-sm rounded-full text-[10px] text-blitz-lightgray"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
          
          {/* Book button */}
          <button 
            className="mt-2 w-full py-1.5 bg-blitz-pink text-white text-sm rounded-full active:scale-[0.98] transition-all"
          >
            Book Tickets
          </button>
        </div>
      </div>
      
      {/* Movie Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-blitz-black/95 border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{movie.name}</DialogTitle>
            <DialogDescription className="text-blitz-lightgray">
              {movie.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <img 
                src={movie.image} 
                alt={movie.name}
                className="w-full h-auto rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            
            <div className="col-span-1 flex flex-col gap-3">
              {movie.rating && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">{movie.rating.toFixed(1)} / 5.0</span>
                </div>
              )}
              
              {movie.duration && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5 text-blitz-lightgray" />
                  <span className="text-sm">{movie.duration}</span>
                </div>
              )}
              
              {movie.releaseDate && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5 text-blitz-lightgray" />
                  <span className="text-sm">{new Date(movie.releaseDate).toLocaleDateString()}</span>
                </div>
              )}
              
              {movie.language && (
                <div className="flex items-center">
                  <Languages className="w-4 h-4 mr-1.5 text-blitz-lightgray" />
                  <span className="text-sm">{movie.language}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Book Tickets</h3>
            <div className="flex flex-col gap-2">
              {movie.bookingLinks?.bookMyShow && (
                <a 
                  href={movie.bookingLinks.bookMyShow} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex justify-between items-center bg-gradient-to-r from-[#EC5E87] to-[#D81F3D] text-white px-3 py-2 rounded-md hover:opacity-90 active:opacity-100 transition-opacity"
                >
                  <span>BookMyShow</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              
              {movie.bookingLinks?.district && (
                <a 
                  href={movie.bookingLinks.district} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex justify-between items-center bg-gradient-to-r from-[#3EADCF] to-[#ABE9CD] text-black px-3 py-2 rounded-md hover:opacity-90 active:opacity-100 transition-opacity"
                >
                  <span>District</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              
              {movie.bookingLinks?.pvr && (
                <a 
                  href={movie.bookingLinks.pvr} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex justify-between items-center bg-gradient-to-r from-[#6C7FD8] to-[#99B7FF] text-white px-3 py-2 rounded-md hover:opacity-90 active:opacity-100 transition-opacity"
                >
                  <span>PVR</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="w-full border border-white/20 text-white bg-transparent hover:bg-white/5"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MovieCard;
