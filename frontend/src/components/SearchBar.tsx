import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, year: number | undefined) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [text, setText] = useState("");
  const [year, setYear] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = text.trim();
    if (trimmed) {
      // Converte o ano para número; se estiver vazio, vira undefined
      const yearNumber = year.trim() ? parseInt(year, 10) : undefined;
      onSearch(trimmed, yearNumber);
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Buscar filmes..."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <input
        type="number"
        className="year-input"
        placeholder="Ano"
        value={year}
        onChange={(event) => setYear(event.target.value)}
        min={1900}
        max={2100}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}

export default SearchBar;