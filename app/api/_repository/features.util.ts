// app/api/_repository/feature.utils.ts
import { readShpFile, readShxFile } from '@repository/shapefile.util';
import { AllFeatures } from '@/app/api/_interface/feature';

export const emptyFeatures: AllFeatures = {
  workspaceId: '1',
  shp: [],
  shx: [],
  tif: [],
};

/**
 * Esto deberia subir los archivos rasters a su endpoint uno por uno
 * */
export const uploadFiles = async (files: FileList): Promise<boolean> => {
  try {
    console.log(`Reading`, files);
    return true;
  } catch (error) {
    console.error('Error uploading files:', error);
    return false;
  }
};

export const isValidShapefile = (selectedFiles: FileList): boolean => {
  return Array.from(selectedFiles).every((file) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return (
      fileExtension === 'shp' ||
      fileExtension === 'shx' ||
      fileExtension === 'tif'
    );
  });
};

export const processFiles = async (
  selectedFiles: FileList,
  workspaceId: number
): Promise<AllFeatures> => {
  const allFeatures: AllFeatures = emptyFeatures;

  console.log(`Processing files`, selectedFiles);

  const shpFiles: File[] = Array.from(selectedFiles).filter(
    (it) => it.name.split('.').pop()?.toLocaleLowerCase() === 'shp'
  );
  const shxFiles: File[] = Array.from(selectedFiles).filter(
    (it) => it.name.split('.').pop()?.toLocaleLowerCase() === 'shx'
  );

  // Procesar archivos .shp
  for (const file of shpFiles) {
    const fileFeatures = await readShpFile(file);
    allFeatures.shp.push(...fileFeatures);
  }

  // Procesar archivos .shx
  for (const file of shxFiles) {
    const fileIndex = await readShxFile(file);
    allFeatures.shx.push(...fileIndex);
  }

  allFeatures.workspaceId = String(workspaceId);
  return allFeatures;
};
