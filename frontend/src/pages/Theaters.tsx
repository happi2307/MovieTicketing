import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Layout/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Theaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const movieId = searchParams.get('movieId');

  useEffect(() => {
    setLoading(true);
    fetch(`/theaters${movieId ? `?movieId=${movieId}` : ''}`)
      .then(res => res.json())
      .then(data => {
        setTheaters(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load theaters.');
        setLoading(false);
      });
  }, [movieId]);

  const handleViewShowtimes = (theaterId: number) => {
    if (movieId) {
      // Find the first showtime for this movie and theater
      fetch(`/showtimes?movieId=${movieId}&theaterId=${theaterId}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            // Navigate to booking page for the first available showtime
            navigate(`/booking/${data[0].ShowID}`);
          } else {
            alert('No showtimes available for this theater.');
          }
        });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Select a Theater</h1>
        {loading ? (
          <div className="text-center py-16 text-lg">Loading theaters...</div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">{error}</div>
        ) : theaters.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No theaters found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theaters.map((theater: any) => (
              <Card key={theater.TheaterID} className="p-6 flex flex-col gap-2">
                <h2 className="text-xl font-semibold">{theater.Name}</h2>
                <div className="text-muted-foreground text-sm">{theater.Location}</div>
                <div className="text-sm">Total Screens: {theater.TotalScreens}</div>
                <Button className="mt-4 w-fit" onClick={() => handleViewShowtimes(theater.TheaterID)}>
                  Book
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Theaters;
