import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Play,
  Users,
  Globe
} from 'lucide-react';
import { 
  tmdbApiService, 
  MovieDetails, 
  CastMember, 
  Video,
  getBackdropUrl, 
  getPosterUrl,
  formatRating,
  formatReleaseDate,
  formatRuntime,
  getYouTubeEmbedUrl
} from '@/services/tmdbApi';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const movieId = parseInt(id);
        const [movieDetails, creditsResponse, videosResponse] = await Promise.all([
          tmdbApiService.getMovieDetails(movieId),
          tmdbApiService.getMovieCredits(movieId),
          tmdbApiService.getMovieVideos(movieId),
        ]);

        setMovie(movieDetails);
        setCast(creditsResponse.cast.slice(0, 5)); // First 5 actors
        
        // Find the first trailer or teaser
        const trailerVideo = videosResponse.results.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        ) || videosResponse.results.find(
          video => video.type === 'Teaser' && video.site === 'YouTube'
        );
        
        setTrailer(trailerVideo || null);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner size="lg" text="Loading movie details..." />
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-foreground mb-4">Movie Not Found</h1>
            <p className="text-muted-foreground text-lg mb-8">
              {error || 'The movie you are looking for does not exist.'}
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'w1280');
  const posterUrl = getPosterUrl(movie.poster_path);
  const rating = formatRating(movie.vote_average);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          {/* Back Button */}
          <Link 
            to="/" 
            className="absolute top-4 left-4 z-10"
          >
            <Button variant="secondary" size="sm" className="backdrop-blur-sm bg-background/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full max-w-sm mx-auto rounded-lg shadow-cinema-lg"
              />
            </div>
          </div>

          {/* Movie Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-lg text-muted-foreground italic mb-4">
                  "{movie.tagline}"
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-1 fill-current text-primary" />
                  <span className="font-semibold text-primary">{rating}</span>
                  <span className="text-muted-foreground ml-1">
                    ({movie.vote_count.toLocaleString()} votes)
                  </span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatReleaseDate(movie.release_date)}
                </div>
                
                {movie.runtime && (
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatRuntime(movie.runtime)}
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.overview || 'No overview available.'}
                </p>
              </CardContent>
            </Card>

            {/* Cast */}
            {cast.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Main Cast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cast.map((actor) => (
                      <div key={actor.id} className="flex items-center space-x-3">
                        <img
                          src={getPosterUrl(actor.profile_path, 'w185')}
                          alt={actor.name}
                          className="w-12 h-12 rounded-full object-cover"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-medium text-foreground">{actor.name}</p>
                          <p className="text-sm text-muted-foreground">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trailer */}
            {trailer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Trailer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <iframe
                      src={getYouTubeEmbedUrl(trailer.key)}
                      title={trailer.name}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Movie Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{movie.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span>{movie.original_language.toUpperCase()}</span>
                  </div>
                  {movie.budget > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span>${movie.budget.toLocaleString()}</span>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span>${movie.revenue.toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {movie.homepage && (
                <Card>
                  <CardHeader>
                    <CardTitle>Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={movie.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:text-primary/80 transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Official Website
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetailPage;