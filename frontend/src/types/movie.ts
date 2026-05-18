export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface SearchResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genres: { id: number; name: string }[];
  runtime: number | null;
  cast: CastMember[];
}

export interface Rating {
  id: number;
  movie_id: number;
  movie_title: string;
  poster_path: string | null;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  id: number;
  name: string;
}