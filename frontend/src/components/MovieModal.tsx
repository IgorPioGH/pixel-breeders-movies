import { useState, useEffect } from "react";
import type { MovieDetails, Rating } from "../types/movie";
import {
  getMovieDetails,
  getRatings,
  createRating,
  updateRating,
  deleteRating,
} from "../api/client";
import Loader from "./Loader";
import RatingStars from "./RatingStars";

interface MovieModalProps {
  movieId: number;
  onClose: () => void;
}

const POSTER_BASE = "https://image.tmdb.org/t/p/w342";
const PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

function MovieModal({ movieId, onClose }: MovieModalProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [rating, setRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingRating, setSavingRating] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // Busca detalhes e avaliações ao mesmo tempo
        const [detailsData, ratingsData] = await Promise.all([
          getMovieDetails(movieId),
          getRatings(),
        ]);
        setDetails(detailsData);
        // Verifica se este filme já foi avaliado
        const existing = ratingsData.find((r) => r.movie_id === movieId);
        setRating(existing ?? null);
      } catch (err) {
        setError("Não foi possível carregar os detalhes do filme.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [movieId]);

  async function handleRate(score: number) {
    if (!details) return;
    setSavingRating(true);
    setError(null);
    try {
      if (rating) {
        // Já existe avaliação: edita
        const updated = await updateRating(movieId, score);
        setRating(updated);
      } else {
        // Ainda não avaliado: cria
        const created = await createRating({
          movie_id: details.id,
          movie_title: details.title,
          poster_path: details.poster_path,
          score,
        });
        setRating(created);
      }
    } catch (err) {
      setError("Não foi possível salvar a avaliação.");
    } finally {
      setSavingRating(false);
    }
  }

  async function handleDeleteRating() {
    setSavingRating(true);
    setError(null);
    try {
      await deleteRating(movieId);
      setRating(null);
    } catch (err) {
      setError("Não foi possível remover a avaliação.");
    } finally {
      setSavingRating(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {loading && <Loader />}

        {error && <p className="error-message">{error}</p>}

        {!loading && details && (
          <div className="modal-body">
            <div className="modal-header">
              {details.poster_path ? (
                <img
                  className="modal-poster"
                  src={`${POSTER_BASE}${details.poster_path}`}
                  alt={details.title}
                />
              ) : (
                <div className="modal-poster movie-card-noposter">
                  Sem pôster
                </div>
              )}
              <div className="modal-info">
                <h2>{details.title}</h2>
                <p className="modal-meta">
                  {details.release_date || "Data desconhecida"}
                  {details.runtime ? ` · ${details.runtime} min` : ""}
                </p>
                <p className="modal-genres">
                  {details.genres.map((g) => g.name).join(", ")}
                </p>

                <div className="rating-box">
                  <h4>Sua avaliação</h4>
                  <RatingStars
                    score={rating ? rating.score : 0}
                    onRate={handleRate}
                    disabled={savingRating}
                  />
                  {rating ? (
                    <button
                      className="rating-delete"
                      onClick={handleDeleteRating}
                      disabled={savingRating}
                    >
                      Remover avaliação
                    </button>
                  ) : (
                    <p className="rating-hint">
                      Clique nas estrelas para avaliar.
                    </p>
                  )}
                </div>

                <h4>Sinopse</h4>
                <p>{details.overview || "Sinopse não disponível."}</p>
              </div>
            </div>

            <h4>Elenco</h4>
            <div className="modal-cast">
              {details.cast.map((person) => (
                <div className="cast-member" key={person.id}>
                  {person.profile_path ? (
                    <img
                      src={`${PROFILE_BASE}${person.profile_path}`}
                      alt={person.name}
                    />
                  ) : (
                    <div className="cast-nophoto">?</div>
                  )}
                  <span className="cast-name">{person.name}</span>
                  <span className="cast-character">{person.character}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieModal;