import { useEffect, useRef } from 'react';
import L, { control, Icon, map, TileLayer } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

export function useMapInitialization() {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || mapRef.current !== null) return;

    Icon.Default.mergeOptions({
      iconUrl: markerIcon.src,
      iconRetinaUrl: markerIcon2x.src,
      shadowUrl: markerShadow.src,
    });

    const mapa = map('map', {
      center: [-0.628273, -90.348146],
      zoom: 12,
      zoomControl: false,
    });

    mapRef.current = mapa;
    googleMapsMapLayer.addTo(mapa);

    const baseLayers = {
      Map: googleMapsMapLayer,
      Satellite: googleMapsSatelliteLayer,
    };

    control.layers(baseLayers).addTo(mapRef.current);
    control.zoom({ position: 'bottomright' }).addTo(mapa);

    mapa.on('baselayerchange', function (e) {
      if (e.name === 'Satellite') {
        googleMapsSatelliteLayer.addTo(mapa);
        googleMapsSatelliteLayer.bringToBack();
        googleMapsMapLayer.remove();
      } else {
        googleMapsMapLayer.bringToBack();
        googleMapsSatelliteLayer.remove();
      }
    });

    return () => {
      // Limpiar mapa al desmontar (opcional)
      mapa.remove();
      mapRef.current = null;
    };
  }, []);

  return [mapRef];
}

function addGoogleMapsLayer(mapa) {
  const googleMapsLayer: L.TileLayer = new TileLayer(
    `https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
    {
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
    }
  );
  googleMapsLayer.addTo(mapa);
}
const googleMapsMapLayer = new TileLayer(
  `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
  }
);

const googleMapsSatelliteLayer = new TileLayer(
  `https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
  }
);
