import React from 'react';
import { Movie } from '@/services/tmdbApi';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  className?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  loading = false, 
  error = null, 
  title,
  className = '' 
}) => {
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {title && (
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        )}
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        {title && (
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        )}
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Error loading movies: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-primary hover:text-primary/80 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        {title && (
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        )}
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No movies found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} delay={index * 50} />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;