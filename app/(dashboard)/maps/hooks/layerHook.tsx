import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import L, { Control, FeatureGroup, Layer } from 'leaflet';
import 'leaflet.vectorgrid';
import { LayerWithCustomProperties } from '@/app/_lib/interfaces';
import { MapService } from '@/app/services/map.service';
import { Shapefile } from '@db/models/shapefile.model';
import { Geometry } from 'geojson';
import {
  createEditableNamePopup,
  optionsToLeafLetDraw,
} from '@/app/(dashboard)/maps/[mapsId]/mapActions';

export function useLayers(
  mapRef: React.RefObject<L.Map | null>,
  workespaceId: number
) {
  const featureGroupLayers: MutableRefObject<L.FeatureGroup> =
    useRef<FeatureGroup<Layer> | null>(null);
  const [justLayerGroup, setJustLayersGroup] = useState<
    LayerWithCustomProperties[]
  >([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mapRef.current) {
      const drawOptions = optionsToLeafLetDraw(mapRef, featureGroupLayers);
      const drawControl: Control.Draw = new Control.Draw(drawOptions);
      mapRef.current.addControl(drawControl);
      whenDeleteLayer();
      whenEditLayer();
      cargarLayersFromBackend();
    }
  }, [mapRef]);
  const whenDeleteLayer = useCallback(() => {
    mapRef.current.on('draw:deleted', function (event: L.DrawEvents.Deleted) {
      const layers: L.LayerGroup = event.layers;
      layers.eachLayer((layer: LayerWithCustomProperties) => {
        if (layer.feature.properties.id) {
          MapService.deleteShapefile(
            (layer.feature.properties as unknown as { id: string }).id
          );
          setJustLayersGroup((prevLayers) => {
            return prevLayers.filter(
              (l) => l.feature.properties.id !== layer.feature.properties.id
            );
          });
        }
      });
    });
  }, [mapRef]);

  const handleLayerEdited = useCallback((layer: LayerWithCustomProperties) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const geometry = layer.toGeoJSON().geometry;
    setJustLayersGroup((prevLayers) => {
      return prevLayers.map((layerWithProp) => {
        if (
          layerWithProp.feature.properties.id === layer.feature.properties.id
        ) {
          layerWithProp.feature.geometry = geometry;
          layerWithProp.feature.properties.edited = true;
        }
        return layerWithProp;
      });
    });
  }, []);
  const whenEditLayer = useCallback(() => {
    mapRef.current.on('draw:edited', function (event: L.DrawEvents.Edited) {
      const layers: L.LayerGroup = event.layers;
      layers.eachLayer((layer) => {
        handleLayerEdited(layer as LayerWithCustomProperties);
      });
    });
  }, [handleLayerEdited, mapRef]);
  const saveEditedLayers = (layers: LayerWithCustomProperties[]) => {
    layers.forEach((layer) => {
      if (layer.feature.properties.edited) {
        const layerForEndpoint: Shapefile = {
          id: String(layer.feature.properties.id),
          name: layer.feature.properties.name,
          user_id: String(layer.feature.properties.user_id),
          workspace_ids: [String(workespaceId)],
          is_global: false,
          properties: layer.feature.properties,
          geometry: layer.feature.geometry,
        };
        MapService.updateShapefile(layerForEndpoint);
      }
    });
  };

  const cargarLayersFromBackend = async () => {
    try {
      const layersBackend: Shapefile[] =
        await MapService.getShapefileByWorkspaceId(workespaceId);

      const layersMaped: LayerWithCustomProperties[] = layersBackend.map(
        (item: Shapefile): LayerWithCustomProperties => {
          if (item === null) return;
          const geometry = JSON.parse(String(item.geometry)) as Geometry;

          let layer: L.Layer;

          if (item.properties.radius && geometry.type === 'Point') {
            // Create a circle if the item has a radius and is a point
            const latLng = L.latLng(
              geometry.coordinates[1],
              geometry.coordinates[0]
            );
            layer = L.circle(latLng, {
              radius: item.properties.radius,
            });
          } else {
            const geoJSONLayer = L.geoJSON(geometry, {
              onEachFeature: (feature, l) => {
                (l as any).customProperties = {
                  selected: item.properties.selected,
                  visible: item.properties.visible,
                  name: item.name,
                  id: item.id,
                  user_id: item.user_id,
                };
              },
            });
            geoJSONLayer.eachLayer((l) => {
              layer = l as L.Layer;
            });
          }
          const layerFront: LayerWithCustomProperties =
            layer as LayerWithCustomProperties;
          layerFront.feature = {
            type: 'Feature',
            geometry: geometry,
            properties: {
              selected: item.properties.selected,
              visible: item.properties.visible,
              name: item.name,
              id: item.id,
              edited: false,
            },
          };

          if (layer instanceof L.Circle) {
            layerFront.feature.properties.radius = item.properties.radius;
          }
          return layerFront;
        }
      );

      const layersFiltered = layersMaped.filter((layer) => layer !== null);
      layersFiltered.forEach((layer: LayerWithCustomProperties) => {
        if (layer && featureGroupLayers.current) {
          addLayerExistentRef(layer);
          setJustLayersGroup((prevLayers) => [...prevLayers, layer]);
          createEditableNamePopup(
            layer,
            layer.feature.properties.name,
            mapRef.current,
            setJustLayersGroup
          );
        }
      });
      setReady(true);
    } catch (error) {
      console.error('Error cargando layers desde el backend:', error);
    }
  };

  const addLayerExistentRef = useCallback((layer: L.Layer) => {
    featureGroupLayers.current?.addLayer(layer);
    return featureGroupLayers.current.hasLayer(layer);
  }, []);

  const removeLayerExistentRef = useCallback((layer: L.Layer) => {
    featureGroupLayers.current?.removeLayer(layer);
    return !featureGroupLayers.current.hasLayer(layer);
  }, []);

  return {
    saveEditedLayers,
    ready,
    featureGroupLayers,
    justLayerGroup,
    setJustLayersGroup,
    addLayerExistentRef,
    removeLayerExistentRef,
  };
}
