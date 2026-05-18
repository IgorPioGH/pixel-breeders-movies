# Guarda as instancias compartilhadas (banco, cache)
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache

# Criadas aqui, são conectadas dentro do `app.py`
db = SQLAlchemy()
cache = Cache()
