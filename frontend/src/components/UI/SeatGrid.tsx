import React, { useState } from 'react';
import { Seat } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SeatGridProps {
  seats: Seat[];
  onSeatSelect: (selectedSeats: Seat[]) => void;
  maxSelectable?: number;
}

const SeatGrid = ({ seats, onSeatSelect, maxSelectable }: SeatGridProps) => {
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  
  const rows = Array.from(new Set(seats.map(seat => seat.row))).sort();
  const maxSeatsInRow = Math.max(...rows.map(
    row => seats.filter(seat => seat.row === row).length
  ));
  
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'reserved') return;
    
    const newSelectedIds = [...selectedSeatIds];
    const seatIndex = newSelectedIds.indexOf(seat.id);
    
    if (seatIndex === -1) {
      if (!maxSelectable || newSelectedIds.length < maxSelectable) {
        newSelectedIds.push(seat.id);
      }
    } else {
      newSelectedIds.splice(seatIndex, 1);
    }
    
    setSelectedSeatIds(newSelectedIds);
    
    const selectedSeats = seats.filter(s => newSelectedIds.includes(s.id));
    onSeatSelect(selectedSeats);
  };

  return (
    <div className="mt-6 mb-12">
      <div className="screen mb-12"></div>
      
      <div className="flex justify-center">
        <div className="inline-block">
          {rows.map(row => (
            <div key={row} className="flex items-center mb-2">
              <div className="w-6 text-center font-semibold mr-2">{row}</div>
              <div className="flex">
                {seats
                  .filter(seat => seat.row === row)
                  .sort((a, b) => a.number - b.number)
                  .map(seat => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const status = isSelected ? 'selected' : seat.status;
                    
                    return (
                      <button
                        key={seat.id}
                        className={cn(
                          'seat',
                          status === 'available' && 'seat-available',
                          status === 'selected' && 'seat-selected',
                          (status === 'reserved' || seat.status === 'reserved') && 'seat-reserved',
                          seat.type === 'premium' && 'border border-cinema-gold',
                          seat.type === 'accessible' && 'rounded-md'
                        )}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === 'reserved' || status === 'reserved'}
                        title={`${seat.row}${seat.number} - ${seat.type} seat${seat.status === 'reserved' ? ' (Reserved)' : ''}`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        <div className="flex items-center">
          <div className="seat seat-available w-6 h-6"></div>
          <span className="ml-2 text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="seat seat-selected w-6 h-6"></div>
          <span className="ml-2 text-sm">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="seat seat-reserved w-6 h-6"></div>
          <span className="ml-2 text-sm">Reserved</span>
        </div>
        <div className="flex items-center">
          <div className="seat seat-available w-6 h-6 border border-cinema-gold"></div>
          <span className="ml-2 text-sm">Premium</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
