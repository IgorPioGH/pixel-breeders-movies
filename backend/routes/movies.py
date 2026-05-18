from flask import Blueprint, request, jsonify
import requests

from services.tmdb import search_movies, get_movie_details, get_genres

movies_bp = Blueprint("movies", __name__, url_prefix="/api/movies")


@movies_bp.route("/search", methods=["GET"])
def search():
    query = request.args.get("query", "").strip()
    page = request.args.get("page", 1, type=int)
    year = request.args.get("year", type=int)

    if not query:
        return jsonify({"error": "O parâmetro 'query' é obrigatório."}), 400

    try:
        data = search_movies(query, page, year)
        return jsonify({
            "results": data.get("results", []),
            "page": data.get("page", 1),
            "total_pages": data.get("total_pages", 1),
            "total_results": data.get("total_results", 0),
        })
    except requests.exceptions.RequestException:
        return jsonify({"error": "Erro ao consultar o TMDB."}), 502


@movies_bp.route("/genres", methods=["GET"])
def genres():
    try:
        data = get_genres()
        return jsonify(data.get("genres", []))
    except requests.exceptions.RequestException:
        return jsonify({"error": "Erro ao consultar o TMDB."}), 502


@movies_bp.route("/<int:movie_id>", methods=["GET"])
def details(movie_id):
    try:
        data = get_movie_details(movie_id)
    except requests.exceptions.HTTPError as e:
        if e.response is not None and e.response.status_code == 404:
            return jsonify({"error": "Filme não encontrado."}), 404
        return jsonify({"error": "Erro ao consultar o TMDB."}), 502
    except requests.exceptions.RequestException:
        return jsonify({"error": "Erro ao consultar o TMDB."}), 502

    cast = data.get("credits", {}).get("cast", [])
    simplified_cast = [
        {
            "id": person.get("id"),
            "name": person.get("name"),
            "character": person.get("character"),
            "profile_path": person.get("profile_path"),
        }
        for person in cast[:15]
    ]

    return jsonify({
        "id": data.get("id"),
        "title": data.get("title"),
        "overview": data.get("overview"),
        "release_date": data.get("release_date"),
        "poster_path": data.get("poster_path"),
        "backdrop_path": data.get("backdrop_path"),
        "vote_average": data.get("vote_average"),
        "genres": data.get("genres", []),
        "runtime": data.get("runtime"),
        "cast": simplified_cast,
    })