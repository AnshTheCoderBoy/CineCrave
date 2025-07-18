import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Movie, getPosterUrl, formatRating } from '@/services/tmdbApi';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface MovieCardProps {
  movie: Movie;
  className?: string;
  delay?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className = '', delay = 0 }) => {
  const { ref, isVisible } = useScrollAnimation({ delay });
  const posterUrl = getPosterUrl(movie.poster_path);
  const rating = formatRating(movie.vote_average);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';

  return (
    <div
      ref={ref}
      className={`transition-all duration-800 ${
        isVisible ? 'animate-scale-in' : 'scroll-hidden-scale'
      }`}
    >
      <Link to={`/movie/${movie.id}`} className={`group ${className}`}>
        <Card className="overflow-hidden bg-card hover:bg-card/80 transition-all duration-300 transform hover:scale-105 hover:shadow-cinema-lg border-border/50 hover:border-primary/50">
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Rating Badge */}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1 fill-current text-primary" />
                {rating}
              </Badge>
            </div>

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {movie.title}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {releaseYear}
              </div>
              
              <div className="flex items-center">
                <span className="text-muted-foreground">
                  {movie.vote_count.toLocaleString()} votes
                </span>
              </div>
            </div>

            {/* Overview snippet */}
            {movie.overview && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {movie.overview}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default MovieCard;