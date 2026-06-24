from config import REPERTOIRE, INTERVALLE
from watcher import Watcher
from producer import  Producer
import time
class Main:
    if __name__ == "__main__":
        print(REPERTOIRE)
        watcher = Watcher()
        producer = Producer()
        connexion, channel = producer.connect()
        log_file_path = "/home/tsialone/Documents/S6/Mr Naina/programmation_message/gestion_mp3/logs/output.txt"

        try:
            while True:
                new_files = watcher.detect_new_mp3(REPERTOIRE)
                try:
                    for f in new_files:
                        producer.publish(channel, f)
                        watcher.write_in_log_file(log_file_path, f"{str(f)} envoye")

                except Exception as e:
                    watcher.write_in_log_file(log_file_path,f"Erreur : {e}")
                time.sleep(INTERVALLE)

        except KeyboardInterrupt:
            print("\nArrêt du programme...")
            producer.deconnect(connexion)  
            print("Déconnexion RabbitMQ effectuée")
                
            