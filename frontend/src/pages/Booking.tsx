import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Layout/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SeatGrid from '@/components/UI/SeatGrid';

const Booking = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState<any>(null);
  const [movie, setMovie] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [numPeople, setNumPeople] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showtimeId) return;
    setLoading(true);
    fetch(`/showtime/${showtimeId}`)
      .then(res => res.json())
      .then(data => {
        setShowtime(data.showtime);
        setMovie(data.movie);
        setSeats(data.seats);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load showtime.');
        setLoading(false);
      });
  }, [showtimeId]);

  const handleSeatSelect = (seats: any[]) => {
    setSelectedSeats(seats);
  };

  const handleContinue = () => {
    if (selectedSeats.length !== numPeople) return;
    navigate(`/checkout/${showtime.ShowID}?seats=${selectedSeats.map(s => s.id).join(',')}`);
  };

  if (loading) return <div className="text-center py-16 text-lg">Loading...</div>;
  if (error) return <div className="text-center py-16 text-destructive">{error}</div>;
  if (!showtime || !movie) return null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">{movie.title}</h1>
          <span className="ml-4 text-muted-foreground">{showtime.Date} • Screen {showtime.ScreenID}</span>
        </div>
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <label htmlFor="numPeople" className="font-medium">Number of People:</label>
            <div className="relative w-40">
              <select
                id="numPeople"
                className="block w-full appearance-none rounded-lg border border-border bg-card px-4 py-2 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-primary transition shadow-sm"
                value={numPeople}
                onChange={e => {
                  setNumPeople(Number(e.target.value));
                  setSelectedSeats([]);
                }}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </div>
            <span className="text-muted-foreground text-sm">Select {numPeople} seat(s)</span>
          </div>
          <Separator className="my-4" />
          <SeatGrid 
            seats={seats}
            onSeatSelect={seats => {
              if (seats.length <= numPeople) handleSeatSelect(seats);
            }}
            maxSelectable={numPeople}
          />
          <Separator className="my-4" />
          <Button 
            className="w-full" 
            onClick={handleContinue} 
            disabled={selectedSeats.length !== numPeople}
          >
            Continue
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Booking;
