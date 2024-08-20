// app/api/_repository/shapefile.util.ts
import * as shapefile from 'shapefile';
import { Feature, Geometry, GeoJsonProperties } from 'geojson';
import { ShapeIndex } from '@db/models/shapeindex.model';

export const readShpFile = async (
  file: File
): Promise<Feature<Geometry, GeoJsonProperties>[]> => {
  const features: Feature<Geometry, GeoJsonProperties>[] = [];
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      await shapefile
        .open(reader.result as ArrayBuffer)
        .then((source) =>
          source.read().then(function log(result: {
            done: boolean;
            value: Feature<Geometry, GeoJsonProperties>;
          }): Promise<void> | undefined {
            if (result.done) {
              resolve(features);
              return;
            }
            features.push(result.value);
            return source.read().then(log);
          })
        )
        .catch((error) => reject(error));
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

export const readShxFile = async (file: File): Promise<ShapeIndex[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const dataView = new DataView(arrayBuffer);
      try {
        const fileCode = dataView.getInt32(0, false);
        const fileLength = dataView.getInt32(24, false);
        const indexEntries: ShapeIndex[] = [];
        for (let i = 100; i < fileLength * 2; i += 8)
          indexEntries.push({
            feature_id: i,
            geom_offset: dataView.getInt32(i, false),
            content_length: dataView.getInt32(i + 4, false),
            user_id: '1',
            is_global: true,
          });
        resolve(indexEntries);
      } catch (error) {
        console.error('Error reading .shx file:', error);
        reject(new Error('Failed to read .shx file'));
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
