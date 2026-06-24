# Répertoire surveillé
REPERTOIRE = "/home/tsialone/Musique/mozika"

# Intervalle de vérification en secondes (5 minutes par défaut)
INTERVALLE = 5 * 60

# Configuration RabbitMQ
RABBITMQ = {
    "host": "localhost",
    "port": 5672,
    "login": "guest",
    "password": "guest",
    "queue": "mp3_queue"
}