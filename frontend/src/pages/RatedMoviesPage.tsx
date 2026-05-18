import { useState, useEffect } from "react";
import type { Rating } from "../types/movie";
import { getRatings } from "../api/client";
import Loader from "../components/Loader";
import MovieModal from "../components/MovieModal";

const POSTER_BASE = "https://image.tmdb.org/t/p/w342";

function RatedMoviesPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  async function loadRatings() {
    setLoading(true);
    setError(null);
    try {
      const data = await getRatings();
      setRatings(data);
    } catch (err) {
      setError("Não foi possível carregar os filmes avaliados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRatings();
  }, []);

  function handleCloseModal() {
    setSelectedMovieId(null);
    // Recarrega a lista: a nota pode ter sido editada ou removida no modal
    loadRatings();
  }

  return (
    <div className="home-page">
      <h1>Filmes Avaliados</h1>

      {loading && <Loader />}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && ratings.length === 0 && (
        <p>Você ainda não avaliou nenhum filme.</p>
      )}

      {!loading && !error && ratings.length > 0 && (
        <div className="movie-grid">
          {ratings.map((rating) => (
            <div
              className="movie-card"
              key={rating.id}
              onClick={() => setSelectedMovieId(rating.movie_id)}
            >
              {rating.poster_path ? (
                <img
                  className="movie-card-poster"
                  src={`${POSTER_BASE}${rating.poster_path}`}
                  alt={rating.movie_title}
                />
              ) : (
                <div className="movie-card-poster movie-card-noposter">
                  Sem pôster
                </div>
              )}
              <h3 className="movie-card-title">{rating.movie_title}</h3>
              <div className="movie-card-score">Nota: {rating.score} ★</div>
            </div>
          ))}
        </div>
      )}

      {selectedMovieId !== null && (
        <MovieModal movieId={selectedMovieId} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default RatedMoviesPage;