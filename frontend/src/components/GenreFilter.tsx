import type { Genre } from "../types/movie";

interface GenreFilterProps {
  genres: Genre[];
  selectedGenreId: number | null;
  onChange: (genreId: number | null) => void;
}

function GenreFilter({ genres, selectedGenreId, onChange }: GenreFilterProps) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    // Opção vazia significa "todos os gêneros"
    onChange(value === "" ? null : parseInt(value, 10));
  }

  return (
    <div className="genre-filter">
      <label>Filtrar por gênero: </label>
      <select value={selectedGenreId ?? ""} onChange={handleChange}>
        <option value="">Todos</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GenreFilter;