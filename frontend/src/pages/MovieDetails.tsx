import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, Calendar, User, Award, ArrowLeft, Star 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ShowtimeSelector from '@/components/UI/ShowtimeSelector';
import Navbar from '@/components/Layout/Navbar';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`/movie/${id}`).then(res => res.json()),
      fetch(`/showtimes/movie/${id}`).then(res => res.json())
    ])
      .then(([movieData, showtimeData]) => {
        setMovie(movieData);
        setShowtimes(showtimeData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load movie details.');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!movie && !loading) navigate('/');
    window.scrollTo(0, 0);
  }, [movie, loading, navigate]);

  if (loading) return <div className="text-center py-16 text-lg">Loading...</div>;
  if (error) return <div className="text-center py-16 text-destructive">{error}</div>;
  if (!movie) return null;

  return (
    <>
      <Navbar />
      <div>
        <div 
          className="h-[40vh] bg-cover bg-center relative"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(15,17,23,0.95)), url(${movie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
          }}
        >
          <div className="container mx-auto px-4 h-full flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 left-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft />
            </Button>
          </div>
        </div>
        
        <div className="container mx-auto px-4 -mt-32 relative z-10 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-40 h-60 md:w-64 md:h-96 flex-shrink-0 rounded-md overflow-hidden shadow-xl">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
              
              <div className="flex flex-wrap gap-3 mt-3">
                <Badge variant="outline" className="text-sm py-1 px-2">
                  {movie.rating}
                </Badge>
                {movie.genre.map((g: string) => (
                  <Badge key={g} variant="secondary" className="text-sm py-1 px-2">
                    {g}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{movie.director}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="w-4 h-4" />
                  <span>{movie.rating}</span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Synopsis</h3>
                <p className="text-muted-foreground">{movie.description}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast && movie.cast.length > 0 ? movie.cast.map((actor: string) => (
                    <Badge key={actor} variant="outline" className="text-sm py-1 px-2">
                      {actor}
                    </Badge>
                  )) : <span className="text-muted-foreground">No cast info</span>}
                </div>
              </div>
            </div>
          </div>
          
          <ShowtimeSelector showtimes={showtimes} />
          
          <div className="h-20"></div>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
