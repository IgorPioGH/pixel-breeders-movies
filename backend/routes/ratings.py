from flask import Blueprint, request, jsonify

from extensions import db
from models.rating import Rating

ratings_bp = Blueprint("ratings", __name__, url_prefix="/api/ratings")


@ratings_bp.route("", methods=["GET"])
def list_ratings():
    """READ — lista todos os filmes avaliados, do mais recente para o mais antigo."""
    ratings = Rating.query.order_by(Rating.created_at.desc()).all()
    return jsonify([r.to_dict() for r in ratings])


@ratings_bp.route("", methods=["POST"])
def create_rating():
    """CREATE — cria uma avaliação nova."""
    data = request.get_json(silent=True) or {}

    movie_id = data.get("movie_id")
    score = data.get("score")
    movie_title = data.get("movie_title")
    poster_path = data.get("poster_path")

    # Validação dos campos obrigatórios
    if movie_id is None or score is None or not movie_title:
        return jsonify({"error": "movie_id, score e movie_title sao obrigatorios."}), 400

    # A nota precisa ser um inteiro de 1 a 5
    if not isinstance(score, int) or score < 1 or score > 5:
        return jsonify({"error": "A nota deve ser um numero inteiro de 1 a 5."}), 400

    # Impede avaliar o mesmo filme duas vezes
    if Rating.query.filter_by(movie_id=movie_id).first():
        return jsonify({"error": "Este filme ja foi avaliado."}), 409

    rating = Rating(
        movie_id=movie_id,
        movie_title=movie_title,
        poster_path=poster_path,
        score=score,
    )
    db.session.add(rating)
    db.session.commit()

    return jsonify(rating.to_dict()), 201


@ratings_bp.route("/<int:movie_id>", methods=["PUT"])
def update_rating(movie_id):
    """UPDATE — edita a nota de um filme já avaliado."""
    rating = Rating.query.filter_by(movie_id=movie_id).first()
    if rating is None:
        return jsonify({"error": "Avaliacaoo nao encontrada."}), 404

    data = request.get_json(silent=True) or {}
    score = data.get("score")

    if not isinstance(score, int) or score < 1 or score > 5:
        return jsonify({"error": "A nota deve ser um número inteiro de 1 a 5."}), 400

    rating.score = score
    db.session.commit()

    return jsonify(rating.to_dict())


@ratings_bp.route("/<int:movie_id>", methods=["DELETE"])
def delete_rating(movie_id):
    """DELETE — remove a avaliação de um filme."""
    rating = Rating.query.filter_by(movie_id=movie_id).first()
    if rating is None:
        return jsonify({"error": "Avaliacao nao encontrada."}), 404

    db.session.delete(rating)
    db.session.commit()

    return jsonify({"message": "Avaliacao removida com sucesso."})