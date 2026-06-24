import pika
from config import RABBITMQ
class Producer:
    def __init__(self)->None:
        pass
    
    def connect(self):
        credentials = pika.PlainCredentials(
            username=RABBITMQ["login"],
            password=RABBITMQ["password"]
        )
        parametres=pika.ConnectionParameters(
             host=RABBITMQ["host"],
            port=RABBITMQ["port"],
            credentials=credentials
        )
        connexion = pika.BlockingConnection(parametres)
        channel = connexion.channel()
        
        return connexion,channel
    
    def publish(self,channel,message):
        channel.basic_publish(
            exchange='',
            routing_key=RABBITMQ["queue"],
            body=str(message)
        )
    def deconnect(self,connexion):
        connexion.close()