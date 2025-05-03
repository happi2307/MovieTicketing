import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import SeatGrid from '@/components/UI/SeatGrid';
import Navbar from '@/components/Layout/Navbar';
import { format } from 'date-fns';
import { toast } from 'sonner';

const SeatSelection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState<any>(null);
  const [movie, setMovie] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if ((!showtime || !movie) && !loading) navigate('/');
    window.scrollTo(0, 0);
  }, [showtime, movie, loading, navigate]);

  const handleSeatSelect = (seats: any[]) => {
    setSelectedSeats(seats);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to continue');
      return;
    }
    navigate(`/checkout/${showtime.id}?seats=${selectedSeats.map(s => s.id).join(',')}`);
  };

  if (loading) return <div className="text-center py-16 text-lg">Loading...</div>;
  if (error) return <div className="text-center py-16 text-destructive">{error}</div>;
  if (!showtime || !movie) return null;

  const standardPrice = showtime.price;
  const premiumPrice = standardPrice * 1.5;
  const totalAmount = selectedSeats.reduce((sum, seat) => sum + (seat.type === 'premium' ? premiumPrice : standardPrice), 0);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{movie.title}</h1>
            <p className="text-muted-foreground text-sm">
              {format(new Date(`${showtime.date}T${showtime.time}`), 'EEEE, MMMM d • h:mm a')} • {showtime.theater} • {showtime.screen}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Select Your Seats</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Click on the seats you would like to book
              </p>
              
              <SeatGrid seats={seats} onSeatSelect={handleSeatSelect} />
            </Card>
          </div>
          
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">{showtime.theater} • {showtime.screen}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(`${showtime.date}T${showtime.time}`), 'EEE, MMM d • h:mm a')}
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {selectedSeats.length > 0 ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedSeats.map(seat => (
                      <span key={seat.id} className={`
                        py-1 px-2 text-xs rounded 
                        ${seat.type === 'premium' ? 'bg-amber-900/30 text-cinema-gold border border-cinema-gold/50' : 'bg-accent text-accent-foreground'}`
                      }>
                        {seat.row}{seat.number}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <span>Tickets ({selectedSeats.length})</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ) : <div className="text-muted-foreground text-sm">No seats selected</div>}
              
              <Separator className="my-4" />
              
              <Button 
                className="w-full" 
                onClick={handleContinue} 
                disabled={selectedSeats.length === 0}
              >
                Continue
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatSelection;
