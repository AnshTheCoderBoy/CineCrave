import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { tmdbApiService, Movie } from '@/services/tmdbApi';
import MovieGrid from '@/components/MovieGrid';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      handleSearch(query, 1);
    }
  }, [query]);

  const handleSearch = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const response = await tmdbApiService.searchMovies(searchQuery, page);
      
      if (page === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setCurrentPage(page);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Failed to search movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      handleSearch(query, currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={(searchQuery) => handleSearch(searchQuery, 1)} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Search Results
            </h1>
          </div>
          
          {query && (
            <p className="text-lg text-muted-foreground">
              {hasSearched ? (
                loading && currentPage === 1 ? (
                  `Searching for "${query}"...`
                ) : (
                  `Results for "${query}" (${movies.length} movies found)`
                )
              ) : (
                `Enter a search term to find movies`
              )}
            </p>
          )}
        </div>

        {/* Search Results */}
        {!query.trim() ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Search for Movies
            </h2>
            <p className="text-muted-foreground">
              Use the search bar above to find your favorite movies
            </p>
          </div>
        ) : hasSearched ? (
          <>
            <MovieGrid 
              movies={movies} 
              loading={loading && currentPage === 1} 
              error={error} 
            />

            {/* Load More Button */}
            {!loading && movies.length > 0 && currentPage < totalPages && (
              <div className="text-center mt-8">
                <Button 
                  onClick={loadMore}
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {loading ? 'Loading...' : 'Load More Movies'}
                </Button>
              </div>
            )}

            {/* Loading indicator for pagination */}
            {loading && currentPage > 1 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading more movies...</p>
              </div>
            )}

            {/* End of results */}
            {!loading && movies.length > 0 && currentPage >= totalPages && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  You've reached the end of the search results
                </p>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
};

export default SearchPage;