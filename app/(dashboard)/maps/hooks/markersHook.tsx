// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Iguana } from '@db/models/iguana.model';
import L from 'leaflet';
import { useEffect, useRef, useState, useCallback } from 'react';

import {
  colorMappingEdad,
  colorMappingSexo,
  colorMappingEstado,
} from '@/app/_lib/utils';

// Función para obtener el color basado en las propiedades y la clave
const getColor = (properties: any, propertyKey: string) => {
  const value = properties[propertyKey];
  switch (propertyKey) {
    case 'estado':
      return colorMappingEstado[value] || '#999999';
    case 'edad':
      return colorMappingEdad[value] || '#999999';
    case 'sexo':
      return colorMappingSexo[value] || '#999999';
    default:
      return '#999999';
  }
};

// Función para transformar los datos en GeoJSON
const transformToGeoJSON = (data: Iguana[]): GeoJSON.FeatureCollection => ({
  type: 'FeatureCollection',
  features: data.map((iguana) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: JSON.parse(String(iguana.point)).coordinates,
    },
    properties: {
      id: iguana.id,
      estado: iguana.estado,
      edad: iguana.edad,
      sexo: iguana.sexo,
    },
  })),
});

export function useVectorGrid(mapRef: React.RefObject<L.Map | null>) {
  const vectorGridRef = useRef<L.VectorGrid | null>(null);
  const [iguanaDataVectorGrid, setIguanaDataVectorGrid] = useState<Iguana[]>(
    []
  );
  const [propertyKey, setPropertyKey] = useState<string>('estado');
  const updateVectorGrid = useCallback(() => {
    if (!mapRef.current) return;

    const newVectorGrid = L.vectorGrid.slicer(
      transformToGeoJSON(iguanaDataVectorGrid),
      {
        rendererFactory: L.canvas.tile,
        vectorTileLayerStyles: {
          sliced: (pro) => {
            return {
              radius: 6,
              fillColor: getColor(pro, propertyKey),
              color: '#000000',
              weight: 0.25,
              opacity: 0.4,
              fillOpacity: 1,
              fill: true,
            };
          },
        },
        maxZoom: 20,
        tolerance: 5,
        extent: 4096,
        buffer: 64,
        debug: 0,
        interactive: false,
        getFeatureId: (f) => f.properties.id,
      }
    );
    if (vectorGridRef.current) {
      mapRef.current.removeLayer(vectorGridRef.current);
    }
    vectorGridRef.current = newVectorGrid;
    mapRef.current.addLayer(vectorGridRef.current);
    vectorGridRef.current.bringToFront();
  }, [iguanaDataVectorGrid, propertyKey, mapRef]);

  useEffect(() => {
    updateVectorGrid();
  }, [iguanaDataVectorGrid, propertyKey, updateVectorGrid]);

  return {
    setPropertyKey,
    setIguanaDataVectorGrid,
  };
}
