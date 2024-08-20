from osgeo import gdal
from osgeo import osr

# Archivo de entrada y salida
input_png = 'in.png'
output_tif = 'out.tif'

# Coordenadas geográficas de la Isla Santa Cruz, Galápagos
# Estas coordenadas deben ser ajustadas para el área específica de tu interés
lon_min = -90.344  # Longitud mínima (esquina inferior izquierda)
lat_max = -0.615   # Latitud máxima (esquina superior izquierda)
lon_max = -90.298  # Longitud máxima (esquina inferior derecha)
lat_min = -0.664   # Latitud mínima (esquina superior derecha)

# Abrir la imagen PNG para obtener sus dimensiones
src_ds = gdal.Open(input_png)
width = src_ds.RasterXSize
height = src_ds.RasterYSize

# Calcular la resolución de los píxeles
pixel_width = (lon_max - lon_min) / width
pixel_height = (lat_max - lat_min) / height

# Configuración de la geotransformación
geotransform = [lon_min, pixel_width, 0, lat_max, 0, -pixel_height]

# Sistema de referencia espacial (EPSG:4326, WGS84)
srs = osr.SpatialReference()
srs.ImportFromEPSG(4326)

# Crear el dataset GeoTIFF con la georreferenciación
driver = gdal.GetDriverByName('GTiff')
dst_ds = driver.CreateCopy(output_tif, src_ds, 0)
dst_ds.SetGeoTransform(geotransform)
dst_ds.SetProjection(srs.ExportToWkt())

# Guardar y cerrar el dataset
dst_ds = None
src_ds = None

print("Georreferenciación completada y guardada en:", output_tif)
