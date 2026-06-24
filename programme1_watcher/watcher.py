from pathlib import Path
from datetime import datetime
class Watcher:
    def __init__(self) -> None:
        self.mp3_files = set([])
        
    def get_all_mp3(self):
        return self.mp3_files
    
    def detect_new_mp3(self,directory):
        actual_files = set(f for f in  Path(directory).rglob("*.mp3"))
        new_files = actual_files - self.mp3_files
        if(new_files):
            self.mp3_files.update(new_files)
            return new_files
        return set()
            
    def write_in_log_file(self,log_file_path:str,content:str)->None:
        try:
            date_heure = datetime.now()
            dt = date_heure.strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
            with open(log_file_path,"a", encoding="utf-8") as file:
                file.write(f"[{dt}]> {content}\n")
        except Exception as e:
            raise e