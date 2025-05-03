export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  description: string;
  releaseDate: string;
  duration: number; // in minutes
  genre: string[];
  rating: string;
  director: string;
  cast: string[];
  featured?: boolean;
}

export interface Showtime {
  id: number;
  movieId: number;
  date: string;
  time: string;
  theater: string;
  screen: string;
  price: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'accessible';
  status: 'available' | 'reserved' | 'selected';
}

export const generateSeats = (): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const seats: Seat[] = [];
  
  rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {
      // Generate random status with 80% available, 20% reserved
      const randomStatus = Math.random() > 0.2 ? 'available' : 'reserved';
      
      // Determine seat type
      let seatType: 'standard' | 'premium' | 'accessible' = 'standard';
      if ((row === 'D' || row === 'E') && i >= 4 && i <= 9) {
        seatType = 'premium'; // Premium seats in the middle
      }
      if (row === 'H' && (i === 1 || i === 12)) {
        seatType = 'accessible'; // Accessible seats on the ends of last row
      }
      
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        type: seatType,
        status: randomStatus
      });
    }
  });
  
  return seats;
};

