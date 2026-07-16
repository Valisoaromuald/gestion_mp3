from config import REPERTOIRE, INTERVALLE , LOG_FILE_PATH
from watcher import Watcher
from producer import  Producer
import time
class Main:
    if __name__ == "__main__":
        watcher = Watcher()
        producer = Producer()
        connexion, channel = producer.connect()
        log_file_path = LOG_FILE_PATH

        try:
            while True:
                new_files = watcher.detect_new_mp3(REPERTOIRE)
                try:
                    for f in new_files:
                        producer.publish(channel, f)
                        if log_file_path is not None: 
                            watcher.write_in_log_file(log_file_path, f"{str(f)} envoye")

                except Exception as e:
                    if log_file_path is not None: 
                        watcher.write_in_log_file(log_file_path,f"Erreur : {e}")
                time.sleep(INTERVALLE)

        except KeyboardInterrupt:
            print("\nArrêt du programme...")
            producer.deconnect(connexion)  
            print("Déconnexion RabbitMQ effectuée")
                
            