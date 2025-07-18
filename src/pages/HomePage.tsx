import React, { useState, useEffect } from 'react';
import { Flame, Calendar, Star } from 'lucide-react';
import { tmdbApiService, Movie } from '@/services/tmdbApi';
import MovieGrid from '@/components/MovieGrid';
import Header from '@/components/Header';
import TrendingCarousel from '@/components/TrendingCarousel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const HomePage: React.FC = () => {
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { ref: topRatedRef, isVisible: topRatedVisible } = useScrollAnimation();
  const { ref: upcomingRef, isVisible: upcomingVisible } = useScrollAnimation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const [topRatedResponse, upcomingResponse] = await Promise.all([
          tmdbApiService.getTopRatedMovies(),
          tmdbApiService.getUpcomingMovies(),
        ]);

        // Limit to first 12 movies for homepage
        setTopRatedMovies(topRatedResponse.results.slice(0, 12));
        setUpcomingMovies(upcomingResponse.results.slice(0, 12));
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-12">
            <div className="w-full h-[500px] bg-muted animate-pulse rounded-lg"></div>
            <MovieGrid loading={true} movies={[]} title="Top Rated" />
            <MovieGrid loading={true} movies={[]} title="Coming Soon" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-foreground mb-4">Oops! Something went wrong</h1>
            <p className="text-muted-foreground text-lg mb-8">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Trending Carousel Section */}
        <section className="mb-12">
          <TrendingCarousel />
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Movie Sections */}
          <div className="space-y-12">

          {/* Top Rated Movies */}
          <section ref={topRatedRef}>
            <div className={`flex items-center justify-between mb-6 transition-all duration-800 ${
              topRatedVisible ? 'animate-fade-in-up' : 'scroll-hidden'
            }`}>
              <div className="flex items-center space-x-3">
                <Star className="h-6 w-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Top Rated</h2>
              </div>
              <Link to="/top-rated">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </Link>
            </div>
            <MovieGrid movies={topRatedMovies} />
          </section>

          {/* Upcoming Movies */}
          <section ref={upcomingRef}>
            <div className={`flex items-center justify-between mb-6 transition-all duration-800 ${
              upcomingVisible ? 'animate-fade-in-up' : 'scroll-hidden'
            }`}>
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-cinema-blue" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Coming Soon</h2>
              </div>
              <Link to="/upcoming">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </Link>
            </div>
            <MovieGrid movies={upcomingMovies} />
          </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 CineCrave | Data by TMDb | Crafted by Anshul Wadbudhe</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;