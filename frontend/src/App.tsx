import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import RatedMoviesPage from "./pages/RatedMoviesPage";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="nav-link">
          Buscar
        </Link>
        <Link to="/avaliados" className="nav-link">
          Filmes Avaliados
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/avaliados" element={<RatedMoviesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;