/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Iguana } from '@db/models/iguana.model';
import { MapService } from '@/app/services/map.service';
import { Shapefile } from '@db/models/shapefile.model';

type DatosGrafico = {
  progressDate: string;
  endDate: string;
  layersid: string[];
};

export function useIguanaToChartjs({
  progressDate,
  endDate,
  layersid,
}: DatosGrafico) {
  const initDate = new Date(progressDate).toISOString();
  const finalDate = new Date(endDate).toISOString();
  console.log(
    'progressDate',
    finalDate,
    'endDate',
    initDate,
    'layersid',
    layersid
  );
  const [iguanasFetch, setIguanasFetch] = useState<Iguana[][] | null>(null);
  const [shapefilesFetch, setShapefilesFetch] = useState<Shapefile[] | null>(
    null
  );

  const getIguanasFromFetch = async () => {
    try {
      const promises = layersid.map(async (layerId) => {
        const parsedLayerId = parseInt(layerId);
        const [iguanas, shapefile] = await Promise.all([
          MapService.getAllIguanasByDateAndLayer(
            initDate,
            finalDate,
            parsedLayerId
          ),
          MapService.getShapefileById(parsedLayerId),
        ]);
        return { layerId: parsedLayerId, iguanas, shapefile };
      });

      const results = await Promise.all(promises);

      const allIguanas: Iguana[][] = results.map((result) => result.iguanas);
      setIguanasFetch(allIguanas);

      const allShapefiles: Shapefile[] = results.map(
        (result) => result.shapefile
      );
      setShapefilesFetch(allShapefiles);

      console.log('Datos obtenidos:', results);
    } catch (error) {
      console.error('Error al obtener iguanas y shapefiles:', error);
      setIguanasFetch(null);
      setShapefilesFetch(null);
    }
  };
  useEffect(() => {
    getIguanasFromFetch();
  }, []);

  return {
    iguanasFetch,
    shapefilesFetch,
  };
}
