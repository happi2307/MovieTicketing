
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Star } from 'lucide-react';
import { Movie } from '@/lib/data';

interface FeaturedSliderProps {
  movies: Movie[];
}

const FeaturedSlider = ({ movies }: FeaturedSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  
  const featuredMovies = movies.filter(movie => movie.featured);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [featuredMovies.length]);
  
  const handleNavigate = (id: number) => {
    navigate(`/movie/${id}`);
  };
  
  if (featuredMovies.length === 0) return null;
  
  return (
    <div className="w-full h-[60vh] relative overflow-hidden">
      {featuredMovies.map((movie, index) => (
        <div 
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(15,17,23,1)), url(${movie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
          }}
        >
          <div className="container mx-auto h-full flex flex-col justify-end pb-16 px-4">
            <div className="max-w-2xl animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{movie.title}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-1 bg-background/30 px-2 py-1 rounded text-sm backdrop-blur-sm">
                  <Star className="w-4 h-4 text-cinema-gold" fill="currentColor" />
                  <span>{movie.rating}</span>
                </div>
                <div className="flex items-center gap-1 bg-background/30 px-2 py-1 rounded text-sm backdrop-blur-sm">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                </div>
                <div className="flex items-center gap-1 bg-background/30 px-2 py-1 rounded text-sm backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
              </div>
              <p className="text-gray-200 mb-6 line-clamp-2">{movie.description}</p>
              <div className="flex gap-4">
                <Button onClick={() => handleNavigate(movie.id)}>Book Tickets</Button>
                <Button variant="outline">Watch Trailer</Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-primary w-6' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSlider;
