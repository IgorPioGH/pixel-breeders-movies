import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
}

export default MovieGrid;