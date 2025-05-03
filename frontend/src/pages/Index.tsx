import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Layout/Navbar';
import FeaturedSlider from '@/components/UI/FeaturedSlider';
import MovieList from '@/components/Movies/MovieList';

const Index = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/movies/now')
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load movies.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {loading ? (
          <div className="text-center py-16 text-lg">Loading movies...</div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">{error}</div>
        ) : (
          <>
            <FeaturedSlider movies={movies} />
            <MovieList movies={movies} title="Now Showing" />
          </>
        )}
      </main>
      <footer className="container mx-auto px-4 py-8 border-t border-border mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-primary font-bold text-xl mr-1">Flick</span>
            <span className="text-foreground font-bold text-xl">Find</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FlickFind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
