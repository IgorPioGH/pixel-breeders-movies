import requests
from flask import current_app


def _headers():
    token = current_app.config["TMDB_TOKEN"]
    return {
        "Authorization": f"Bearer {token}",
        "accept": "application/json",
    }


def _base_url():
    return current_app.config["TMDB_BASE_URL"]

# Query para buscar filmes no TMDB
def search_movies(query, page=1, year=None):
    base = _base_url()
    url = f"{base}/search/movie"
    params = {
        "query": query,
        "page": page,
        "language": "pt-BR",
        "include_adult": False,
    }
    if year:
        params["primary_release_year"] = year
    response = requests.get(url, headers=_headers(), params=params, timeout=10)
    response.raise_for_status()
    return response.json()

# Query para pegar os detalhes dos filmes 'credits' faz retornar tudo na mesma busca
def get_movie_details(movie_id):
    base = _base_url()
    url = f"{base}/movie/{movie_id}"
    params = {
        "language": "pt-BR",
        "append_to_response": "credits",
    }
    response = requests.get(url, headers=_headers(), params=params, timeout=10)
    response.raise_for_status()
    return response.json()

# Query para buscar os generos dos filmes
def get_genres():
    base = _base_url()
    url = f"{base}/genre/movie/list"
    params = {"language": "pt-BR"}
    response = requests.get(url, headers=_headers(), params=params, timeout=10)
    response.raise_for_status()
    return response.json()