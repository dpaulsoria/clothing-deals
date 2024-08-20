import axios, { AxiosResponse } from 'axios';

export const ImageService = {
  getThumbnail(filePath: string | null): string {
    if (!filePath) return '/loading.png'; // Reemplaza con la ruta de la imagen por defecto

    return generateImageUrl(filePath, 'thumbnail');
  },

  getMedium(filePath: string): string {
    return generateImageUrl(filePath, 'medium');
  },

  getLarge(filePath: string): string {
    return generateImageUrl(filePath, 'large');
  },

  async getRasterImageByProxy(url: string) {
    try {
      const response: AxiosResponse<ArrayBuffer> = await axios.get(
        `/api/image?url=${url}`,
        { responseType: 'arraybuffer' }
      );
      if (response.data) return response.data;
      else return null;
    } catch (error) {
      console.error('Error getting raster image by proxy:', error);
      handleApiError(error, 'raster', 'get');
      return null;
    }
  },
};

// Función auxiliar para generar la URL de la imagen
function generateImageUrl(filePath: string, size: string): string {
  const basePath = 'https://storage.googleapis.com/gpg-images-bucket/original/';
  const newPath = filePath
    .replace(basePath, '')
    .replace(/(\.[\w\d_-]+)$/i, `-${size}$1`);
  return `https://storage.googleapis.com/gpg-images-bucket/images/${size}/${newPath}`;
}

function handleApiError(error: any, resource: string, method: string) {
  console.error(`API Error (${method} ${resource}):`, error);
}
