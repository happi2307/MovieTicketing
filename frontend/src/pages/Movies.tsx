import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Layout/Navbar';
import MovieList from '@/components/Movies/MovieList';

const Movies = () => {
  const [now, setNow] = useState([]);
  const [past, setPast] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/movies/now').then(res => res.json()),
      fetch('/movies/past').then(res => res.json()),
      fetch('/movies/upcoming').then(res => res.json()),
    ])
      .then(([nowData, pastData, upcomingData]) => {
        setNow(nowData);
        setUpcoming(upcomingData);
        setPast(pastData);
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
            <MovieList movies={now} title="Now Showing" />
            <MovieList movies={upcoming} title="To Be Premiered" />
            <MovieList movies={past} title="Past" />
          </>
        )}
      </main>
    </div>
  );
};

export default Movies;
