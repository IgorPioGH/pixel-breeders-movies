import os
from dotenv import load_dotenv

# Lê o arquivo .env e joga as variaveis dentro de os.environ
load_dotenv()


class Config:
    # Token da API
    TMDB_TOKEN = os.getenv("TMDB_TOKEN")
    TMDB_BASE_URL = "https://api.themoviedb.org/3"

    # String de conexão com MySQL, atraves do SQLAlchemy
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
        f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
