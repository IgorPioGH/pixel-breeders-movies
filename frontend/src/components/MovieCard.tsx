import type { Movie } from "../types/movie";

// Descreve o que este componente recebe via props
interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

// Base das imagens do TMDB. O poster_path é só um fragmento
const POSTER_BASE = "https://image.tmdb.org/t/p/w342";

function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      {movie.poster_path ? (
        <img
          src={`${POSTER_BASE}${movie.poster_path}`}
          alt={movie.title}
          className="movie-card-poster"
        />
      ) : (
        <div className="movie-card-poster movie-card-noposter">
          Sem pôster
        </div>
      )}
      <h3 className="movie-card-title">{movie.title}</h3>
    </div>
  );
}

export default MovieCard;