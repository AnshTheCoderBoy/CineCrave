import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tmdbApiService, Movie } from '@/services/tmdbApi';
import MovieGrid from '@/components/MovieGrid';
import Header from '@/components/Header';
import CategoryCarousel from '@/components/CategoryCarousel';
import { Button } from '@/components/ui/button';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';

  useEffect(() => {
    if (category) {
      fetchMovies(1);
    }
  }, [category]);

  const fetchMovies = async (pageNumber: number) => {
    if (!category) return;

    try {
      setLoading(true);
      setError(null);
      const response = await tmdbApiService.getMoviesByRegion(categoryTitle, pageNumber);
      
      if (pageNumber === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setHasMore(pageNumber < response.total_pages);
      setPage(pageNumber);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchMovies(page + 1);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-foreground mb-4">Category Not Found</h1>
            <p className="text-muted-foreground text-lg">The requested category could not be found.</p>
          </div>
        </main>
      </div>
    );
  }

  if (loading && movies.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">{categoryTitle} Movies</h1>
            </div>
            <MovieGrid loading={true} movies={[]} />
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
            <Button onClick={() => fetchMovies(1)}>
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
        {/* Category Carousel Section */}
        <section className="mb-12">
          <CategoryCarousel category={categoryTitle} />
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">{categoryTitle} Movies</h1>
              <p className="text-muted-foreground">Explore the best movies from {categoryTitle}</p>
            </div>

            <MovieGrid movies={movies} />

            {hasMore && (
              <div className="text-center">
                <Button 
                  onClick={loadMore} 
                  disabled={loading}
                  size="lg"
                  className="mt-8"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
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

export default CategoryPage;