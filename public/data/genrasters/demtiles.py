import os
import numpy as np
from noise import pnoise2
from osgeo import gdal, osr
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor, as_completed

# Coordenadas de los extremos de la Isla Santa Cruz
lon_min = -90.386
lat_max = -0.508
lon_max = -90.199
lat_min = -0.744

# Divisiones (10x10 cuadrantes)
divisions = 10

# Tamaño de cada imagen (en píxeles)
img_size = 256

# Directorio base para guardar los tiles
base_dir = "demtiles"

# Contador de archivos generados (global)
tile_count = 0

# Lock para asegurar que la variable compartida se actualiza de manera segura
from threading import Lock
lock = Lock()

def generate_dem_image(x_offset, y_offset, scale, date_offset):
    array = np.zeros((img_size, img_size))
    for i in range(img_size):
        for j in range(img_size):
            x_coord = (x_offset + i) / scale
            y_coord = (y_offset + j) / scale
            array[i][j] = pnoise2(x_coord, y_coord + date_offset, octaves=4, persistence=0.5, lacunarity=2.0, repeatx=1024, repeaty=1024, base=42)
    array = (array - np.min(array)) / (np.max(array) - np.min(array))  # Normalizar valores entre 0 y 1
    return array

def save_georeferenced_image(array, x, y, date):
    global tile_count
    date_dir = os.path.join(base_dir, date)
    os.makedirs(date_dir, exist_ok=True)

    img_name = f"dem_tile_{x}_{y}_{date}.tif"
    img_path = os.path.join(date_dir, img_name)

    lon_min_tile = lon_min + x * (lon_max - lon_min) / divisions
    lon_max_tile = lon_min + (x + 1) * (lon_max - lon_min) / divisions
    lat_max_tile = lat_max - y * (lat_max - lat_min) / divisions
    lat_min_tile = lat_max - (y + 1) * (lat_max - lat_min) / divisions

    driver = gdal.GetDriverByName('GTiff')
    dataset = driver.Create(img_path, img_size, img_size, 1, gdal.GDT_Byte)
    dataset.GetRasterBand(1).WriteArray(array * 255)

    geotransform = [lon_min_tile, (lon_max_tile - lon_min_tile) / img_size, 0, lat_max_tile, 0, -(lat_max_tile - lat_min_tile) / img_size]
    dataset.SetGeoTransform(geotransform)

    srs = osr.SpatialReference()
    srs.ImportFromEPSG(4326)
    dataset.SetProjection(srs.ExportToWkt())

    metadata = {
        "DATE": date
    }
    dataset.SetMetadata(metadata)
    dataset.FlushCache()
    dataset = None

    with lock:
        tile_count += 1

def generate_tiles_for_date(date_str, date_offset, divisions_range):
    scale = divisions * img_size
    for x in divisions_range:
        for y in range(divisions):
            x_offset = x * img_size
            y_offset = y * img_size
            dem_array = generate_dem_image(x_offset, y_offset, scale, date_offset)
            save_georeferenced_image(dem_array, x, y, date_str)

def generate_tiles_over_time(start_date, end_date):
    current_date = start_date
    futures = []
    with ThreadPoolExecutor(max_workers=4) as executor:
        while current_date <= end_date:
            date_str = current_date.strftime("%Y-%m-%d")
            date_offset = (current_date - start_date).days

            # Dividir el trabajo en 4 partes (divisions/4 para cada hilo)
            for i in range(4):
                divisions_range = range(i * (divisions // 4), (i + 1) * (divisions // 4))
                futures.append(executor.submit(generate_tiles_for_date, date_str, date_offset, divisions_range))

            current_date += timedelta(days=1)

        for future in as_completed(futures):
            future.result()

# Ejecución
start_date = datetime(2024, 8, 1)
end_date = datetime(2024, 8, 30)
generate_tiles_over_time(start_date, end_date)

# Mostrar el número total de archivos generados
print(f"Total de archivos .tif generados: {tile_count}")
