FROM python:3.11-slim

WORKDIR /app

# Copia só os requerimentos primeiro para aproveitar o cache Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY . .

EXPOSE 5000

# Sobe a aplicação com o gunicorn (servidor de produção)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "app:app"]