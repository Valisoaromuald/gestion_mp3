from config import REPERTOIRE, INTERVALLE, RABBITMQ
from watcher import Watcher
from producer import  Producer
class Main:
    if __name__== "__main__":
        print(REPERTOIRE)
        watcher = Watcher()
        watcher.detect_new_mp3(REPERTOIRE)
        mp3_files = watcher.get_all_mp3()
        producer = Producer()
        connexion,channel = producer.connect()
        log_file_path:str = "/home/tsialone/Documents/S6/Mr Naina/programmation_message/gestion_mp3/logs/output.txt"
        for f in mp3_files: 
            producer.publish(channel,f)
            watcher.write_in_log_file(log_file_path,f"{str(f)} envoye")
        producer.deconnect(connexion)
            