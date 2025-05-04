import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Layout/Navbar';
import { Card } from '@/components/ui/card';

const groupBy = (arr, key) => arr.reduce((acc, item) => {
  (acc[item[key]] = acc[item[key]] || []).push(item);
  return acc;
}, {});

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(user.UserType === 'Admin');
    if (user.UserType !== 'Admin') {
      setError('Access denied. Admins only.');
      setLoading(false);
      return;
    }
    fetch('/admin/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load bookings.');
        setLoading(false);
      });
  }, []);

  if (!isAdmin) {
    return (
      <div className="text-center py-16 text-destructive">Access denied. Admins only.</div>
    );
  }

  // Group bookings by movie, then theater, then screen
  const bookingsByMovie = groupBy(bookings, 'movieTitle');

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard: All Bookings</h1>
        {loading ? (
          <div className="text-center py-16 text-lg">Loading...</div>
        ) : error ? (
          <div className="text-center py-16 text-destructive">{error}</div>
        ) : (
          Object.entries(bookingsByMovie).map(([movie, bookingsForMovie]) => {
            const bookingsByTheater = groupBy(bookingsForMovie, 'theaterName');
            return (
              <div key={movie} className="mb-8">
                <h2 className="text-xl font-semibold mb-2">🎬 {movie}</h2>
                {Object.entries(bookingsByTheater).map(([theater, bookingsForTheater]) => {
                  const bookingsByScreen = groupBy(bookingsForTheater, 'screenId');
                  return (
                    <div key={theater} className="ml-4 mb-4">
                      <h3 className="text-lg font-medium mb-1">🏢 {theater}</h3>
                      {Object.entries(bookingsByScreen).map(([screen, bookingsForScreen]) => (
                        <div key={screen} className="ml-4 mb-2">
                          <h4 className="font-medium mb-1">🖥️ Screen {screen}</h4>
                          {bookingsForScreen.map(booking => (
                            <Card key={booking.bookingId} className="p-4 mb-2">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                  <div className="text-sm">User ID: {booking.userId}</div>
                                  <div className="text-muted-foreground text-xs mb-1">{booking.showDate} • {booking.showTime}</div>
                                  <div className="text-muted-foreground text-xs mb-1">Seats: {booking.seats.length > 0 ? booking.seats.join(', ') : 'No seats'}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-base">₹{booking.totalAmount.toFixed(2)}</div>
                                  <div className="text-xs text-muted-foreground">Booked on {booking.bookingDate}</div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
