import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { tmdbApiService, Movie } from '@/services/tmdbApi';
import MovieGrid from '@/components/MovieGrid';
import Header from '@/components/Header';

const UpcomingPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApiService.getUpcomingMovies();
        setMovies(response.results);
      } catch (err) {
        console.error('Error fetching upcoming movies:', err);
        setError('Failed to load upcoming movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-cinema-blue mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Upcoming Movies
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Get ready for the most anticipated releases
          </p>
        </div>

        <MovieGrid 
          movies={movies} 
          loading={loading} 
          error={error} 
        />
      </main>
    </div>
  );
};

export default UpcomingPage;