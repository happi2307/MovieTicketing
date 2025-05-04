import React, { useState } from 'react';
import MovieCard from './MovieCard';
import { Movie } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

interface MovieListProps {
  movies: Movie[];
  title?: string;
}

const MovieList = ({ movies, title = "Now Playing" }: MovieListProps) => {
  const [filter, setFilter] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  
  // Get unique genres from all movies
  const allGenres = Array.from(new Set(movies.flatMap(movie => movie.genre)));
  
  // Filter movies by genre
  const filteredMovies = filter === "all" 
    ? movies 
    : movies.filter(movie => movie.genre.includes(filter));

  const moviesToShow = showAll ? filteredMovies : filteredMovies.slice(0, 6);

  const handleBook = (movieId: number) => {
    navigate(`/theaters?movieId=${movieId}`);
  };

  return (
    <div className="py-8">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {filteredMovies.length > 6 && (
            <Button variant="link" className="text-primary" onClick={() => setShowAll(v => !v)}>
              {showAll ? 'Show Less' : 'View All'}
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="bg-card">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>All</TabsTrigger>
            {allGenres.slice(0, 5).map(genre => (
              <TabsTrigger 
                key={genre} 
                value={genre}
                onClick={() => setFilter(genre)}
              >
                {genre}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {moviesToShow.map(movie => (
            <div key={movie.id} className="relative group">
              <MovieCard movie={movie} />
              <Button className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleBook(movie.id)}>
                Book
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
