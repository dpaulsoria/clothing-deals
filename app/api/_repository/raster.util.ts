// app/api/_repository/raster.util.ts

import { Feature, Geometry, GeoJsonProperties } from 'geojson';

import { readShpFile } from '@repository/shapefile.util';

export const SRID: number = 4326;

export const streamToBlob = async (stream: ReadableStream): Promise<Blob> => {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    if (doneReading) done = true;
    else chunks.push(value);
  }

  return new Blob(chunks);
};

export const blobToFile = (blob: Blob, filename: string): File => {
  return new File([blob], filename, { type: blob.type });
};

export const loadLocalShpFile = async (): Promise<{
  shp: Feature<Geometry, GeoJsonProperties>[];
}> => {
  const response1 = await fetch(
    '/assets/tmp/shapefile/Milagro-testigo-vuelo.shp'
  );
  // const response2 = await fetch('/assets/tmp/shapefile/Milagro-testigo-vuelo.shx');

  if (!response1.ok) {
    throw new Error('Failed to load shapefiles');
  }

  const blob1 = await streamToBlob(response1.body!);
  const file1 = blobToFile(blob1, 'Milagro-testigo-vuelo.shp');

  const shpFeatures = await readShpFile(file1);

  return {
    shp: shpFeatures,
    // shx: shxFeatures, // Similar procesamiento para el archivo .shx si es necesario
  };
};
