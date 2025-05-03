import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Layout/Navbar';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Checkout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showtime, setShowtime] = useState<any>(null);
  const [movie, setMovie] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
    const selectedSeatIds = searchParams.get('seats')?.split(',') || [];
    setSelectedSeats(seats.filter(seat => selectedSeatIds.includes(seat.id)));
  }, [searchParams, seats]);

  useEffect(() => {
    if ((!showtime || !movie) && !loading) navigate('/');
    window.scrollTo(0, 0);
  }, [showtime, movie, loading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Tickets booked successfully!');
    }, 1500);
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
            <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
            <p className="text-muted-foreground">Tickets will be held for 5 minutes</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <CreditCard className="mr-2" /> Payment Details
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardholder">Cardholder Name</Label>
                      <Input id="cardholder" placeholder="Name on card" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email address" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardnumber">Card Number</Label>
                    <Input id="cardnumber" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipcode">Billing Zip Code</Label>
                    <Input id="zipcode" placeholder="Zip code" required />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">{showtime.theater} • {showtime.screen}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(`${showtime.date}T${showtime.time}`), 'EEEE, MMMM d • h:mm a')}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h3 className="font-medium mb-2">Selected Seats ({selectedSeats.length})</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSeats.map(seat => (
                    <span key={seat.id} className={`py-1 px-2 text-xs rounded ${seat.type === 'premium' ? 'bg-amber-900/30 text-cinema-gold border border-cinema-gold/50' : 'bg-accent text-accent-foreground'}`}>
                      {seat.row}{seat.number}
                    </span>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tickets ({selectedSeats.length})</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booking Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <Separator className="my-4" />
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
              >
                Return Home
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
