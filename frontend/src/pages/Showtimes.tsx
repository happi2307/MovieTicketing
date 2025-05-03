import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Layout/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const Showtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const movieId = searchParams.get('movieId');
  const theaterId = searchParams.get('theaterId');

  useEffect(() => {
    if (!movieId || !theaterId) return;
    setLoading(true);
    fetch(`/showtimes?movieId=${movieId}&theaterId=${theaterId}`)
      .then(res => res.json())
      .then(data => {
        setShowtimes(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load showtimes.');
        setLoading(false);
      });
  }, [movieId, theaterId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Select a Showtime</h1>
        {loading ? (
          <div className="text-center py-16 text-lg">Loading showtimes...</div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">{error}</div>
        ) : showtimes.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No showtimes found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showtimes.map((showtime: any) => (
              <Card key={showtime.ShowID} className="p-6 flex flex-col gap-2">
                <div className="font-semibold text-lg mb-2">{format(new Date(`${showtime.Date}T${showtime.ShowTime}`), 'EEE, MMM d • h:mm a')}</div>
                <div className="text-muted-foreground text-sm mb-1">Screen: {showtime.Screen}</div>
                <div className="text-sm mb-1">Price: ₹{showtime.Price}</div>
                <Button className="mt-2 w-fit" onClick={() => navigate(`/seats/${showtime.ShowID}`)}>
                  Select Seats
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Showtimes;
