from datetime import datetime, timezone
# Importa db de `extensions.py`
from extensions import db

# tabela de avaliações
class Rating(db.Model):
    # Nome da tabela no MySql
    __tablename__ = "ratings"
    
    # PRIMARY_KEY: id_avaliacao (int)
    id = db.Column(db.Integer, primary_key=True)
    
    # ID do filme no TMDB, unique=True não deixa o filme ser avaliado duas vezes
    # index=True deixa a busca mais veloz
    movie_id = db.Column(db.Integer, unique=True, nullable=False, index=True)
    
    # Titulo do filme e o caminho para imagem do poster nos filmes avaliados
    # redundancia de informação, mas faz carregar mais rápido
    movie_title = db.Column(db.String(225), nullable=False)
    poster_path = db.Column(db.String(255), nullable=True)
    
    # Nota do usuário de 1 a 5 estrelas
    score = db.Column(db.Integer, nullable=False)
    
    # Datas de criação e última edição, preenchidas automaticamente
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    
    def to_dict(self):
        """Converte o objeto para um dicionário, para após ser passado em JSON"""
        return {
            "id": self.id,
            "movie_id": self.movie_id,
            "movie_title": self.movie_title,
            "poster_path": self.poster_path,
            "score": self.score,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
    
    