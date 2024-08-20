// // app/api/_repository/gc.function.util.ts
//
// /**
//  * Esta es la funcion que se encuentra en Google Cloud
//  * Encarga del resize de las imagenes
//  */
// const { Storage } = require('@google-cloud/storage');
// const sharp = require('sharp');
// const path = require('path');
// const os = require('os');
// const fs = require('fs');
// const functions = require('@google-cloud/functions-framework');
//
// // Inicializa el cliente de Google Cloud Storage
// const storage = new Storage();
//
// // Función principal para procesar la imagen
// const resizeImage = async (cloudEvent) => {
//   const file = cloudEvent.data;
//   const bucketName = file.bucket;
//   const filePath = file.name;
//
//   // Verificar si el archivo está en la carpeta 'original'
//   if (!filePath.startsWith('original/')) {
//     console.log(`Skipping non-original image: ${filePath}`);
//     return;
//   }
//
//   // Obtener metadatos del archivo
//   const [metadata] = await storage
//     .bucket(bucketName)
//     .file(filePath)
//     .getMetadata();
//
//   // Verificar si el archivo tiene el metadato 'resized'
//   if (metadata.metadata && metadata.metadata.resized === 'true') {
//     console.log(`Skipping resized image: ${filePath}`);
//     return;
//   }
//
//   const bucket = storage.bucket(bucketName);
//   const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
//
//   try {
//     // Descargar el archivo
//     await bucket.file(filePath).download({ destination: tempFilePath });
//     console.log(`Downloaded ${filePath} to ${tempFilePath}`);
//
//     // Definir los tamaños de las imágenes
//     const sizes = [
//       { width: 800, height: 600, suffix: 'large' },
//       { width: 400, height: 300, suffix: 'medium' },
//       { width: 200, height: 150, suffix: 'thumbnail' },
//     ];
//
//     // Procesar y subir las versiones redimensionadas en formato TIFF
//     for (const size of sizes) {
//       const newFileName = `${path.basename(filePath, path.extname(filePath))}-${size.suffix}.tif`;
//       const newFilePath = `images/${size.suffix}/${newFileName}`; // Corrección de ruta
//       const tempNewFilePath = path.join(os.tmpdir(), newFileName);
//
//       await sharp(tempFilePath)
//         .resize(size.width, size.height)
//         .toFormat('tiff')
//         .tiff({ quality: 80, compression: 'lzw' }) // Cambiar a formato TIFF con compresión LZW
//         .toFile(tempNewFilePath);
//
//       await bucket.upload(tempNewFilePath, {
//         destination: newFilePath,
//         metadata: {
//           contentType: 'image/tiff',
//           metadata: {
//             resized: 'true', // Añade un metadato para identificar las imágenes redimensionadas
//           },
//         },
//       });
//
//       fs.unlinkSync(tempNewFilePath); // Elimina el archivo temporal
//       console.log(`Processed and uploaded ${newFilePath}`);
//     }
//
//     fs.unlinkSync(tempFilePath); // Elimina el archivo original temporal
//   } catch (error) {
//     console.error('Error processing file:', error);
//   }
// };
//
// // Registra la función como un manejador de eventos de Cloud Storage
// functions.cloudEvent('resizeImage', resizeImage);
