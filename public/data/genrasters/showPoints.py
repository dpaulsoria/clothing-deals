import folium
import json

# Leer el archivo data.json
with open('data/data.json', 'r') as file:
    data = json.load(file)

# Crear un mapa centrado en las coordenadas promedio
center_lat = sum([json.loads(item['point'])['coordinates'][1] for item in data['result']]) / len(data['result'])
center_lon = sum([json.loads(item['point'])['coordinates'][0] for item in data['result']]) / len(data['result'])
mapa = folium.Map(location=[center_lat, center_lon], zoom_start=15)

# Agregar marcadores al mapa
for item in data['result']:
    coordinates = json.loads(item['point'])['coordinates']
    popup_text = f"""
    <strong>ID:</strong> {item['id']}<br>
    <strong>Estado:</strong> {item['estado']}<br>
    <strong>Edad:</strong> {item['edad']}<br>
    <strong>Sexo:</strong> {'Macho' if item['sexo'] == 1 else 'Hembra'}<br>
    <strong>Fecha de Registro:</strong> {item['register_date']}
    """
    folium.Marker(
        location=[coordinates[1], coordinates[0]],
        popup=popup_text,
        icon=folium.Icon(color='blue' if item['sexo'] == 1 else 'pink')
    ).add_to(mapa)

# Guardar el mapa en un archivo HTML
mapa.save('mapa_iguana.html')

print("Mapa generado correctamente. Abre el archivo 'mapa_iguana.html' en tu navegador para verlo.")
