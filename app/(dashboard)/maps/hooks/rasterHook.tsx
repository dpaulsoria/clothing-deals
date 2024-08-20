import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import L, { LayerGroup } from 'leaflet';
import { ImageService } from '@/app/services/image.service';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import parseGeoraster from 'georaster';
import { RastersDinamic } from '@lib/interfaces';
import { MapService } from '@/app/services/map.service';

export function useRasters(mapRef: React.RefObject<L.Map | null>) {
  const featureGroupRaster: MutableRefObject<LayerGroup | null> =
    useRef<LayerGroup | null>(null);
  const [isRastersDynamicActive, setIsRasterDynamicActive] =
    useState<boolean>(false);
  const [rasterDynamic, setRasterDynamic] = useState<RastersDinamic | null>(
    null
  );
  const processedRasterIdsRef = useRef(new Set<string>());
  const updateCounterRef = useRef(0); // Contador para las actualizaciones

  const loadRasterDynamic = useCallback(async (rasters: RastersDinamic[]) => {
    // Realiza la petición al backend para obtener la información de los rasters
    const rastersPath = await MapService.getAllRastersDinamic(rasters);

    // Filtra los rasters que ya han sido procesados
    const newRastersPath = rastersPath.filter(
      (raster) => !processedRasterIdsRef.current.has(raster.id)
    );

    if (newRastersPath.length === 0) return;

    // Procesa los rasters nuevos
    for (const raster of newRastersPath) {
      await getRastersDinamic(raster.file_path, raster.id);
      processedRasterIdsRef.current.add(raster.id);
    }

    // Incrementa el contador de actualizaciones
    updateCounterRef.current += 1;

    // Cada 20 actualizaciones, eliminar los IDs obsoletos
    if (updateCounterRef.current >= 3) {
      const rasterIdsToRemove = new Set(processedRasterIdsRef.current);
      rastersPath.forEach((raster) => rasterIdsToRemove.delete(raster.id));

      // Eliminar las capas de raster obsoletas
      rasterIdsToRemove.forEach((rasterId) => {
        processedRasterIdsRef.current.delete(rasterId);
        const layersToRemove = featureGroupRaster.current
          ?.getLayers()
          .filter((layer: any) => layer.options.georaster?.id === rasterId);

        layersToRemove?.forEach((layer) => {
          featureGroupRaster.current?.removeLayer(layer);
        });
      });

      // Reinicia el contador
      updateCounterRef.current = 0;
    }
  }, []);

  const getRastersDinamic = async (url: string, id: string) => {
    try {
      const arrayBuffer = await ImageService.getRasterImageByProxy(url);

      if (!arrayBuffer) {
        console.error('Failed to get raster image from the proxy.');
        return;
      }

      const georaster = await parseGeoraster(arrayBuffer);
      const rasterLayer = new GeoRasterLayer({
        georaster,
        opacity: 0.7,
        resolution: 256,
      });
      rasterLayer.options.georaster.id = id;

      featureGroupRaster.current?.addLayer(rasterLayer);
    } catch (error) {
      console.error('Error loading raster from the URL:', error);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Inicializar el LayerGroup si aún no está inicializado
    if (!featureGroupRaster.current) {
      featureGroupRaster.current = new LayerGroup();
      mapRef.current.addLayer(featureGroupRaster.current);
    }
  }, [mapRef]);

  useEffect(() => {
    if (!mapRef.current || !rasterDynamic) return;

    if (isRastersDynamicActive) {
      featureGroupRaster.current?.addTo(mapRef.current);
    } else {
      featureGroupRaster.current?.remove();
    }
  }, [isRastersDynamicActive, rasterDynamic]);

  useEffect(() => {
    if (!mapRef.current || !rasterDynamic || !isRastersDynamicActive) return;
    loadRasterDynamic([rasterDynamic]);
  }, [rasterDynamic, isRastersDynamicActive, loadRasterDynamic]);

  return {
    setRasterDynamic,
    isRastersDynamicActive,
    setIsRasterDynamicActive,
  };
}
