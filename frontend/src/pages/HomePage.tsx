import { useState, useEffect } from "react";
import type { Movie, Genre } from "../types/movie";
import { searchMovies, getGenres } from "../api/client";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import MovieGrid from "../components/MovieGrid";
import Loader from "../components/Loader";
import MovieModal from "../components/MovieModal";

function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  // Paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Guardam a busca ativa, para o "Carregar mais" repetir os mesmos parâmetros
  const [activeQuery, setActiveQuery] = useState("");
  const [activeYear, setActiveYear] = useState<number | undefined>(undefined);

  // Filtro de gênero (aplicado no frontend)
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

  // Carrega a lista de gêneros uma vez, ao abrir a página
  useEffect(() => {
    async function loadGenres() {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (err) {
        // Falha nos gêneros não impede a busca; só não haverá filtro
        console.error("Não foi possível carregar os gêneros.");
      }
    }
    loadGenres();
  }, []);

  async function handleSearch(query: string, year: number | undefined) {
    setLoading(true);
    setError(null);
    setSearched(true);
    setPage(1);
    setActiveQuery(query);
    setActiveYear(year);
    try {
      const data = await searchMovies(query, 1, year);
      setMovies(data.results ?? []);
      setTotalPages(data.total_pages ?? 1);
    } catch (err) {
      setError("Não foi possível buscar os filmes. Tente novamente.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadMore() {
    const nextPage = page + 1;
    setLoadingMore(true);
    setError(null);
    try {
      const data = await searchMovies(activeQuery, nextPage, activeYear);
      // Acrescenta os novos resultados aos que já existem
      setMovies((prev) => [...prev, ...(data.results ?? [])]);
      setPage(nextPage);
    } catch (err) {
      setError("Não foi possível carregar mais filmes.");
    } finally {
      setLoadingMore(false);
    }
  }

  function handleMovieClick(movie: Movie) {
    setSelectedMovieId(movie.id);
  }

  function handleCloseModal() {
    setSelectedMovieId(null);
  }

  // Aplica o filtro de gênero sobre os resultados já carregados
  const visibleMovies = selectedGenreId
    ? movies.filter((movie) => movie.genre_ids.includes(selectedGenreId))
    : movies;

  const hasMorePages = page < totalPages;

  return (
    <div className="home-page">
      <h1>Pixel Breeders Movies</h1>
      <SearchBar onSearch={handleSearch} />

      {searched && genres.length > 0 && (
        <GenreFilter
          genres={genres}
          selectedGenreId={selectedGenreId}
          onChange={setSelectedGenreId}
        />
      )}

      {loading && <Loader />}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && searched && movies.length === 0 && (
        <p>Nenhum filme encontrado.</p>
      )}

      {!loading && !error && movies.length > 0 && visibleMovies.length === 0 && (
        <p>Nenhum filme deste gênero entre os resultados carregados.</p>
      )}

      {!loading && !error && visibleMovies.length > 0 && (
        <>
          <MovieGrid movies={visibleMovies} onMovieClick={handleMovieClick} />
          {hasMorePages && (
            <div className="load-more-container">
              <button
                className="load-more-button"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Carregando..." : "Carregar mais"}
              </button>
            </div>
          )}
        </>
      )}

      {selectedMovieId !== null && (
        <MovieModal movieId={selectedMovieId} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default HomePage;