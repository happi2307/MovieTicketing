import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Showtime } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
}

interface GroupedShowtimes {
  [key: string]: {
    date: string;
    times: Showtime[];
  }
}

const ShowtimeSelector = ({ showtimes }: ShowtimeSelectorProps) => {
  const navigate = useNavigate();
  
  // Group showtimes by date, skip invalid dates
  const groupedByDate = showtimes.reduce<GroupedShowtimes>((acc, showtime) => {
    if (!showtime.date || isNaN(new Date(showtime.date).getTime())) return acc;
    if (!acc[showtime.date]) {
      acc[showtime.date] = {
        date: showtime.date,
        times: []
      };
    }
    acc[showtime.date].times.push(showtime);
    return acc;
  }, {});
  
  // Convert to array and sort by date
  const dates = Object.values(groupedByDate).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const handleSelectShowtime = (showtimeId: number) => {
    navigate(`/seats/${showtimeId}`);
  };
  
  if (dates.length === 0) {
    return <div className="text-center py-8">No showtimes available</div>;
  }
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Showtimes</h3>
      
      <Tabs defaultValue={dates[0]?.date} className="w-full">
        <TabsList className="bg-card mb-4 overflow-x-auto flex w-full">
          {dates.map(dateGroup => (
            <TabsTrigger 
              key={dateGroup.date} 
              value={dateGroup.date}
              className="text-sm"
            >
              {dateGroup.date && !isNaN(new Date(dateGroup.date).getTime())
                ? format(new Date(dateGroup.date), 'EEE, MMM d')
                : 'Invalid date'}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {dates.map(dateGroup => (
          <TabsContent key={dateGroup.date} value={dateGroup.date} className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from(new Set(dateGroup.times.map(t => t.theater))).map((theater) => (
                  <div key={theater} className="border border-border rounded-md p-4">
                    <h4 className="font-medium mb-3">{theater}</h4>
                    <div className="flex flex-wrap gap-2">
                      {dateGroup.times
                        .filter(t => t.theater === theater && t.time && t.time !== '' && !isNaN(new Date(`${dateGroup.date}T${t.time}`).getTime()))
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(showtime => (
                          <Button
                            key={showtime.id}
                            variant="outline"
                            size="sm"
                          >
                            {showtime.time}
                            <span className="text-xs ml-2 opacity-70">{showtime.screen}</span>
                          </Button>
                        ))
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ShowtimeSelector;
