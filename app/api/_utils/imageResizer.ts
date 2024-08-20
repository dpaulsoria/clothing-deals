// app/api/_utils/imageResizer.ts
import sharp from 'sharp';

interface ResizeOptions {
  inputPath: string;
  outputPath: string;
  width: number;
  height: number;
  quality: number;
}

/**
 * Redimensiona y reduce la calidad de una imagen.
 *
 * @param {ResizeOptions} options - Opciones para redimensionar y comprimir la imagen.
 */
export async function resizeCompressAndSave(
  options: ResizeOptions
): Promise<void> {
  const { inputPath, outputPath, width, height, quality } = options;

  try {
    // Redimensionar y comprimir la imagen
    await sharp(inputPath)
      .resize(width, height)
      .jpeg({ quality })
      .toFile(outputPath);
    console.log(`Imagen guardada en ${outputPath} con calidad ${quality}`);
  } catch (error) {
    console.error('Error al redimensionar y comprimir la imagen:', error);
    throw error;
  }
}
