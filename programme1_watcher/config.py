# config.py
from dotenv import load_dotenv
import os

load_dotenv("../.env")  # Chemin vers le .env à la racine

REPERTOIRE = os.getenv("REPERTOIRE")
INTERVALLE = int(os.getenv("INTERVALLE","300"))

RABBITMQ = {
    "host"    : os.getenv("RABBITMQ_HOST"),
    "port"    : int(os.getenv("RABBITMQ_PORT","5672")),
    "login"   : os.getenv("RABBITMQ_LOGIN"),
    "password": os.getenv("RABBITMQ_MOT_DE_PASSE"),
    "queue"   : os.getenv("RABBITMQ_QUEUE_MP3")
}

LOG_FILE_PATH = os.getenv("LOG_FILE_PATH")