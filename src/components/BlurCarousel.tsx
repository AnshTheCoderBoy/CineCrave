import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Play, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { tmdbApiService, Movie, getBackdropUrl, formatRating } from '@/services/tmdbApi';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface BlurCarouselProps {
  category: string;
  displayName: string;
  icon: string;
  flagCode: string;
}

const BlurCarousel: React.FC<BlurCarouselProps> = ({ category, displayName, icon, flagCode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const fetchCategoryMovies = async () => {
      try {
        setLoading(true);
        console.log('Fetching movies for category:', category);
        const response = await tmdbApiService.getMoviesByRegion(category, 1);
        console.log('API Response for', category, ':', response);
        setMovies(response.results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching category movies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryMovies();
    }
  }, [category]);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-muted animate-pulse rounded-lg mb-12"></div>
    );
  }

  if (movies.length === 0) {
    console.log('No movies found for category:', category);
    return (
      <div className="w-full h-[200px] bg-muted/50 rounded-lg mb-12 flex items-center justify-center">
        <p className="text-muted-foreground">No movies found for {displayName}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative mb-12">
      <div className={`transition-all duration-800 ${
        isVisible ? 'animate-fade-in-up' : 'scroll-hidden'
      }`}>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          {displayName}
          <span className="text-sm bg-muted px-2 py-1 rounded">{flagCode}</span>
        </h2>
        
        <div className="relative">
          <Carousel 
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {movies.map((movie) => (
                <CarouselItem key={movie.id}>
                  <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${getBackdropUrl(movie.backdrop_path, 'w1280')})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/50"></div>
                    </div>

                    {/* Blur Overlay */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 backdrop-blur-md bg-black/30 z-20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="h-16 w-16 mx-auto mb-4 text-white/80" />
                          <h3 className="text-2xl font-bold mb-2">Mature Content</h3>
                          <p className="text-white/80 mb-6">Click to view {displayName} content</p>
                          <Button 
                            onClick={handleUnlock}
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <span className="text-2xl mr-2">{icon}</span>
                            Unlock {flagCode}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Content Overlay */}
                    <div className="relative z-10 h-full flex items-center">
                      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl text-white">
                          <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            {movie.title}
                          </h1>
                          
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-1">
                              <Star className="h-5 w-5 text-yellow-400 fill-current" />
                              <span className="font-semibold">{formatRating(movie.vote_average)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-5 w-5" />
                              <span>{new Date(movie.release_date).getFullYear()}</span>
                            </div>
                          </div>

                          <p className="text-lg mb-8 opacity-90 line-clamp-3">
                            {movie.overview}
                          </p>

                          {isUnlocked && (
                            <Link to={`/movie/${movie.id}`}>
                              <Button size="lg" className="bg-primary hover:bg-primary/90">
                                <Play className="mr-2 h-5 w-5" />
                                Watch Details
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {isUnlocked && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default BlurCarousel;