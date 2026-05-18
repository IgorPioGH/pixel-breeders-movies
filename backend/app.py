from flask import Flask
from flask_cors import CORS  # Funcionar o REACT

# Importando classe e variáveis de `config.py` e `extensions.py`
from config import Config
from extensions import db, cache


def create_app():
    # Aplicaçção Flask
    app = Flask(__name__)
    app.config.from_object(Config)

    # Conecta as extensões na app
    db.init_app(app)
    cache.init_app(app, config={"CACHE_TYPE": "SimpleCache"})

    # Liberar frontend
    CORS(app)
    
    # Importa modelos
    from models.rating import Rating
    
    # Cria no banco todas as tabelas dos modelos
    with app.app_context():
        db.create_all() # liga temporariamente o banco para que o SQLAlchemy saiba onde criar as tabelas
        
    # Registro da Blueprint de filmes
    from routes.movies import movies_bp
    app.register_blueprint(movies_bp)
    # Registro da Blueprint de ratings
    from routes.ratings import ratings_bp
    app.register_blueprint(ratings_bp)


    # Rota de teste, confirma que o servidor inicializou corretamente
    @app.route("/")
    def health_check():
        return {
            "status": "ok",
            "message": "Backend Pixel Breeders is up and running!",
        }

    return app


# Cria app ao executar
app = create_app()

if __name__ == "__main__":
    # Reinicar o servidor toda vez sempre que salvar um arquivo
    app.run(debug=True, port=5000)
