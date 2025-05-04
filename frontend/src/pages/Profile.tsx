import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Layout/Navbar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Current user:', user);
    if (!user.UserID) {
      setError('User not found in localStorage. Please log in again.');
      setLoading(false);
      return;
    }
    fetch(`/user/${user.UserID}/bookings`, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        console.log('Bookings API response:', data);
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Bookings fetch error:', err);
        setError('Failed to load bookings.');
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Booked Tickets</h1>
        {loading ? (
          <div className="text-center py-16 text-lg">Loading...</div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No bookings found.</div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <Card key={booking.bookingId} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-bold text-lg">{booking.movieTitle}</div>
                    <div className="text-muted-foreground text-sm mb-1">{booking.theaterName} • Screen {booking.screenId}</div>
                    <div className="text-muted-foreground text-sm mb-1">{booking.showDate} • {booking.showTime}</div>
                    <div className="text-muted-foreground text-sm mb-1">
                      Seats: {booking.seats.length > 0 ? booking.seats.join(', ') : 'No seats'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">₹{booking.totalAmount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">Booked on {booking.bookingDate}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
