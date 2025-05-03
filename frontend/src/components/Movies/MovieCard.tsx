
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Movie } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card 
      className="overflow-hidden border-0 movie-card-hover bg-transparent"
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
          <div>
            <p className="text-sm text-gray-300 line-clamp-3">{movie.description}</p>
          </div>
        </div>
      </div>
      
      <CardContent className="pt-3 px-1">
        <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
        <div className="flex justify-between items-center mt-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-cinema-gold" fill="currentColor" />
            <span>{movie.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
