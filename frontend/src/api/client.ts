import axios from "axios";
import type {
  SearchResponse,
  MovieDetails,
  Rating,
  Genre,
} from "../types/movie";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

export async function searchMovies(
  query: string,
  page = 1,
  year?: number
): Promise<SearchResponse> {
  const response = await api.get<SearchResponse>("/movies/search", {
    params: { query, page, year },
  });
  return response.data;
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const response = await api.get<MovieDetails>(`/movies/${movieId}`);
  return response.data;
}

export async function getGenres(): Promise<Genre[]> {
  const response = await api.get<Genre[]>("/movies/genres");
  return response.data;
}

// --- Avaliações ---

export async function getRatings(): Promise<Rating[]> {
  const response = await api.get<Rating[]>("/ratings");
  return response.data;
}

interface CreateRatingPayload {
  movie_id: number;
  movie_title: string;
  poster_path: string | null;
  score: number;
}

export async function createRating(
  payload: CreateRatingPayload
): Promise<Rating> {
  const response = await api.post<Rating>("/ratings", payload);
  return response.data;
}

export async function updateRating(
  movieId: number,
  score: number
): Promise<Rating> {
  const response = await api.put<Rating>(`/ratings/${movieId}`, { score });
  return response.data;
}

export async function deleteRating(movieId: number): Promise<void> {
  await api.delete(`/ratings/${movieId}`);
}