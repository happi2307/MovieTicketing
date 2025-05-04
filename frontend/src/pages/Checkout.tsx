import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Layout/Navbar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

const Checkout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showtime, setShowtime] = useState<any>(null);
  const [movie, setMovie] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/showtime/${id}`)
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
  }, [id]);

  useEffect(() => {
    const selectedSeatIds = searchParams.get('seats')?.split(',') || [];
    console.log('selectedSeatIds', selectedSeatIds, 'seats', seats); // Debug log
    setSelectedSeats(seats.filter(seat => selectedSeatIds.includes(seat.id)));
  }, [searchParams, seats]);

  useEffect(() => {
    if ((!showtime || !movie) && !loading) navigate('/');
    window.scrollTo(0, 0);
  }, [showtime, movie, loading, navigate]);

  // Progress bar logic
  useEffect(() => {
    if (loading || error) return;
    let interval: any;
    let count = 0;
    interval = setInterval(() => {
      count += 1;
      setProgress((count / 5) * 100);
      if (count >= 5) {
        clearInterval(interval);
        navigate('/');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, error, navigate]);

  if (loading) return <div className="text-center py-16 text-lg">Loading...</div>;
  if (error) return <div className="text-center py-16 text-destructive">{error}</div>;
  if (!showtime || !movie) return <div className="text-center py-16 text-destructive">Showtime or movie not found.</div>;
  if (selectedSeats.length === 0) return <div className="text-center py-16 text-destructive">No seats selected.</div>;

  console.log('showtime', showtime);

  const ticketPrice = showtime.TicketPrice || showtime.ticketPrice || 0;
  const totalAmount = selectedSeats.reduce((sum, seat) => sum + (seat.type === 'premium' ? (Number(ticketPrice) + 10) : Number(ticketPrice)), 0);
  const premiumCount = selectedSeats.filter(seat => seat.type === 'premium').length;
  const standardCount = selectedSeats.length - premiumCount;

  return (
    <>
      <Navbar />
      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted">
        <div
          className="h-2 bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <Card className="p-8 max-w-xl w-full shadow-lg animate-fade-in">
          <div className="flex flex-col items-center mb-6">
            <div className="rounded-full bg-green-100 p-4 mb-2">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-bold mb-1 text-center">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-center">You will be redirected to the homepage shortly.</p>
          </div>
          <Separator className="my-4" />
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Movie</h2>
            <div className="flex items-center gap-4">
              <img src={movie.posterUrl} alt={movie.title} className="w-16 h-24 object-cover rounded shadow" />
              <div>
                <div className="font-bold text-lg">{movie.title}</div>
                <div className="text-sm text-muted-foreground">{showtime.Date} • Screen {showtime.ScreenID}</div>
                <div className="text-sm text-muted-foreground">
                  {showtime.Date && showtime.ShowTime
                    ? (() => {
                        // Pad ShowTime to HH:mm:ss if needed
                        let time = showtime.ShowTime;
                        if (/^\d:\d{2}:\d{2}$/.test(time)) time = '0' + time;
                        if (/^\d{1,2}:\d{2}$/.test(time)) time += ':00';
                        if (/^\d:\d{2}$/.test(time)) time = '0' + time + ':00';
                        return format(new Date(`${showtime.Date}T${time}`), 'EEE, MMM d • h:mm a');
                      })()
                    : 'Showtime unavailable'}
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Tickets Booked</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedSeats.map(seat => (
                <span key={seat.id} className={`py-1 px-2 text-xs rounded ${seat.type === 'premium' ? 'bg-amber-900/30 text-cinema-gold border border-cinema-gold/50' : 'bg-accent text-accent-foreground'}`}>
                  {seat.row}{seat.number}
                </span>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">{selectedSeats.length} seat(s) booked</div>
          </div>
          <Separator className="my-4" />
          <div className="mb-2">
            <h2 className="text-xl font-semibold mb-2">Price Breakdown</h2>
            <div className="flex justify-between text-sm mb-1">
              <span>Standard Seats ({standardCount})</span>
              <span>₹{(standardCount * ticketPrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Premium Seats ({premiumCount})</span>
              <span>₹{(premiumCount * (Number(ticketPrice) + 10)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Booking Fee</span>
              <span>₹0.00</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Checkout;
