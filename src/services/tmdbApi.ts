import axios from 'axios';

// TMDb API Configuration
const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YWRiMjUxYWRjYWRkMjM1ODY2MDAyYjU0YzAzODEyOCIsIm5iZiI6MTc1MjIwNDYyNy4zMzc5OTk4LCJzdWIiOiI2ODcwODU1MzM0NDMzNDY5OTdhOTZmZmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.t668Jl4n4ABaNL4ws4oeQusZgCxkzkGVGQ77XleujbU';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Create axios instance with default config
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Types for Movie data
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  order: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  size: number;
  official: boolean;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface CreditsResponse {
  id: number;
  cast: CastMember[];
  crew: any[];
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

// API Functions
export const tmdbApiService = {
  // Get trending movies
  getTrendingMovies: async (): Promise<MoviesResponse> => {
    const response = await tmdbApi.get('/trending/movie/week');
    return response.data;
  },

  // Get top-rated movies
  getTopRatedMovies: async (): Promise<MoviesResponse> => {
    const response = await tmdbApi.get('/movie/top_rated');
    return response.data;
  },

  // Get upcoming movies
  getUpcomingMovies: async (): Promise<MoviesResponse> => {
    const response = await tmdbApi.get('/movie/upcoming');
    return response.data;
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<MoviesResponse> => {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page }
    });
    return response.data;
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  },

  // Get movie credits (cast and crew)
  getMovieCredits: async (movieId: number): Promise<CreditsResponse> => {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`);
    return response.data;
  },

  // Get movie videos (trailers, teasers, etc.)
  getMovieVideos: async (movieId: number): Promise<VideosResponse> => {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    return response.data;
  },

  // Get genres list
  getGenres: async () => {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data;
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId: number, page: number = 1): Promise<MoviesResponse> => {
    const response = await tmdbApi.get('/discover/movie', {
      params: { with_genres: genreId, page }
    });
    return response.data;
  },

  // Get movies by region/category
  getMoviesByRegion: async (region: string, page: number = 1): Promise<MoviesResponse> => {
    const regionMapping: { [key: string]: string } = {
      'Bollywood': 'IN',
      'Hollywood': 'US',
      'Korean': 'KR',
      'Japanese': 'JP',
      'Chinese': 'CN',
      'Tollywood': 'IN',
      'Kollywood': 'IN', 
      'Mollywood': 'IN',
      'Sandalwood': 'IN'
    };
    
    const regionCode = regionMapping[region] || 'US';
    
    // Special handling for South Indian subcategories
    if (['Tollywood', 'Kollywood', 'Mollywood', 'Sandalwood'].includes(region)) {
      const languageMapping: { [key: string]: string } = {
        'Tollywood': 'te', // Telugu
        'Kollywood': 'ta', // Tamil
        'Mollywood': 'ml', // Malayalam
        'Sandalwood': 'kn'  // Kannada
      };
      
      const languageCode = languageMapping[region];
      const response = await tmdbApi.get('/discover/movie', {
        params: { 
          with_original_language: languageCode,
          with_origin_country: 'IN',
          page
        }
      });
      return response.data;
    }
    
    // Special handling for Anime
    if (region === 'Anime') {
      const response = await tmdbApi.get('/discover/movie', {
        params: { 
          with_genres: '16', // Animation genre
          with_origin_country: 'JP',
          page
        }
      });
      return response.data;
    }
    
    const response = await tmdbApi.get('/discover/movie', {
      params: { region: regionCode, with_origin_country: regionCode, page }
    });
    return response.data;
  },

  // Get top-rated movies for Asian regions (Korean, Japanese, Chinese)
  getAsianTopRatedMovies: async (): Promise<MoviesResponse> => {
    const responses = await Promise.all([
      tmdbApi.get('/discover/movie', {
        params: { 
          with_origin_country: 'KR',
          sort_by: 'vote_average.desc',
          'vote_count.gte': 50
        }
      }),
      tmdbApi.get('/discover/movie', {
        params: { 
          with_origin_country: 'JP',
          sort_by: 'vote_average.desc',
          'vote_count.gte': 50
        }
      }),
      tmdbApi.get('/discover/movie', {
        params: { 
          with_origin_country: 'CN',
          sort_by: 'vote_average.desc',
          'vote_count.gte': 50
        }
      })
    ]);

    const allMovies = [
      ...responses[0].data.results,
      ...responses[1].data.results,
      ...responses[2].data.results
    ];

    // Sort by vote_average and remove duplicates
    const uniqueMovies = allMovies
      .filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
      )
      .sort((a, b) => b.vote_average - a.vote_average);

    return {
      page: 1,
      results: uniqueMovies,
      total_pages: 1,
      total_results: uniqueMovies.length
    };
  },

  // Get upcoming movies for Asian regions (Korean, Japanese, Chinese)
  getAsianUpcomingMovies: async (): Promise<MoviesResponse> => {
    const responses = await Promise.all([
      tmdbApi.get('/discover/movie', {
        params: { 
          with_origin_country: 'KR',
          'primary_release_date.gte': new Date().toISOString().split('T')[0],
          sort_by: 'primary_release_date.asc'
        }
      }),
      tmdbApi.get('/discover/movie', {
        params: { 
          with_origin_country: 'JP',
          'primary_release_date.gte': new Date().toISOString().split('T')[0],
          sort_by: 'primary_release_date.asc'
        }
      }),
      tmdbApi.get('/discover/movie', {
        params: { 
          with_origin_country: 'CN',
          'primary_release_date.gte': new Date().toISOString().split('T')[0],
          sort_by: 'primary_release_date.asc'
        }
      })
    ]);

    const allMovies = [
      ...responses[0].data.results,
      ...responses[1].data.results,
      ...responses[2].data.results
    ];

    // Remove duplicates and sort by release date
    const uniqueMovies = allMovies
      .filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
      )
      .sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());

    return {
      page: 1,
      results: uniqueMovies,
      total_pages: 1,
      total_results: uniqueMovies.length
    };
  },
};

// Utility functions for image URLs
export const getImageUrl = (path: string, size: string = 'w500'): string => {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string, size: string = 'w1280'): string => {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string, size: string = 'w500'): string => {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// YouTube embed URL helper
export const getYouTubeEmbedUrl = (key: string): string => {
  return `https://www.youtube.com/embed/${key}`;
};

// Format rating to one decimal place
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

// Format date to readable format
export const formatReleaseDate = (dateString: string): string => {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format runtime to hours and minutes
export const formatRuntime = (minutes: number): string => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};