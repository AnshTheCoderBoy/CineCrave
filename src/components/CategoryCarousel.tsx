import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { tmdbApiService, Movie, getBackdropUrl, formatRating } from '@/services/tmdbApi';
import Autoplay from "embla-carousel-autoplay";

interface CategoryCarouselProps {
  category: string;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ category }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryMovies = async () => {
      try {
        setLoading(true);
        const response = await tmdbApiService.getMoviesByRegion(category, 1);
        setMovies(response.results.slice(0, 10)); // Top 10 movies
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

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-muted animate-pulse rounded-lg"></div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="relative mb-12">
      <Carousel 
        className="w-full"
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
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

                      <Link to={`/movie/${movie.id}`}>
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                          <Play className="mr-2 h-5 w-5" />
                          Watch Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;