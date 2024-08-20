import requests
import base64

# Configuración del endpoint y parámetros
endpoint_url = "http://localhost:3000/api/raster/dinamic"
params = {
    "x": -90.35,       # Coordenada X (longitud)
    "y": -0.6,         # Coordenada Y (latitud)
    "z": 5,            # Nivel de zoom
    "date": "2024-08-01"  # Fecha para la consulta
}

try:
    # Realizar la solicitud GET al endpoint
    response = requests.get(endpoint_url, params=params)

    # Verificar si la solicitud fue exitosa
    if response.status_code == 200:
        print("Solicitud exitosa. Procesando imágenes...")

        # Decodificar la respuesta JSON
        images_data = response.json()

        # Verificar que images_data sea una lista
        if isinstance(images_data, list):
            # Guardar las imágenes recibidas
            for idx, image_data in enumerate(images_data):
                image_buffer = base64.b64decode(image_data["buffer"])
                content_type = image_data["contentType"]

                # Guardar la imagen en un archivo
                file_extension = content_type.split("/")[-1]  # Obtener la extensión de archivo del content-type
                file_name = f"image_{idx + 1}.{file_extension}"
                with open(file_name, "wb") as img_file:
                    img_file.write(image_buffer)

                print(f"Imagen guardada como {file_name}")
        else:
            print("La respuesta no contiene una lista de imágenes.")
    else:
        print(f"Error en la solicitud: {response.status_code} - {response.text}")

except Exception as e:
    print(f"Ocurrió un error durante la solicitud: {e}")
