import os
import requests
import signal
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock

# Configuración
upload_url = "http://localhost:3000/api/raster"
user_id = 11
workspace_id = 7
base_dir = "demtiles"

# Contador global de archivos subidos
uploaded_count = 0
lock = Lock()

# Para manejar la interrupción
executor = None


def upload_image(file_path, date, file_name):
    global uploaded_count
    try:
        with open(file_path, 'rb') as f:
            files = {
                'file': (f"{file_name}.tif", f, 'image/tiff')
            }
            data = {
                'user_id': user_id,
                'workspace_id': workspace_id,
                'file_name': file_name
            }
            response = requests.post(upload_url, files=files, data=data)
            if response.status_code == 200:
                with lock:
                    uploaded_count += 1
    except Exception as e:
        print(f"Error uploading {file_name} on {date}: {str(e)}")


def process_directory(date_dir):
    full_date_dir = os.path.join(base_dir, date_dir)
    if os.path.isdir(full_date_dir):
        for file in os.listdir(full_date_dir):
            if file.endswith(".tif"):
                file_path = os.path.join(full_date_dir, file)
                file_name = os.path.splitext(file)[0]  # Nombre sin la extensión
                date = file_name.split('_')[-1]  # Extraer la fecha del nombre del archivo
                upload_image(file_path, date, file_name)


def upload_all_images():
    global executor
    date_dirs = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]

    # Dividir el trabajo en 4 partes
    chunks = [date_dirs[i::4] for i in range(4)]

    executor = ThreadPoolExecutor(max_workers=4)
    futures = [executor.submit(process_directory, date_dir) for chunk in chunks for date_dir in chunk]

    try:
        for future in as_completed(futures):
            future.result()
    except KeyboardInterrupt:
        print("Interrupción detectada. Cancelando todas las subidas...")
        executor.shutdown(wait=False)
        sys.exit(1)
    finally:
        # Imprimir el número total de archivos subidos
        print(f"Total de archivos .tif subidos: {uploaded_count}")


def signal_handler(sig, frame):
    if executor:
        print("Interrupción detectada. Cancelando todas las subidas...")
        executor.shutdown(wait=False)
    sys.exit(0)


# Manejar señal de interrupción
signal.signal(signal.SIGINT, signal_handler)

# Ejecución
upload_all_images()
