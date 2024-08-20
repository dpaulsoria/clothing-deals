// app/api/raster/route.js
/**
 * @swagger
 * tags:
 *   name: Raster
 *   description: API for managing rasters
 */
import path from 'path';
import { Storage } from '@google-cloud/storage';
import { fromArrayBuffer } from 'geotiff';
import {
  deleteRasterFileById,
  getRasterFileById,
  updateRasterFile,
  saveRasterFile,
  getRasterFileByUserId,
  getTotalRasterFilesCount,
  getAllRasterFilesWithPagination,
  getTotalRastersByWorkspaceCount,
  getRasterByWorkspaceIdWithPagination,
} from '@db/models/raster.model';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import { getRasterByWorkspaceId } from '@db/models/workspace_files.model';
import { isValidWorkspace } from '@db/models/workspace.model';
import { NextRequest } from 'next/server';

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

const key = 'rasterfile';

const validRasterGEOExtensions = [
  '.tif',
  '.tiff',
  '.jpeg',
  '.bmp',
  '.png',
  '.jpg',
  '.jpeg',
];

// const downloadFileFromGCS = async (srcFilename, destFilename) => {
//   const options = {
//     destination: destFilename,
//   };
//   await bucket.file(srcFilename).download(options);
//   console.log(
//     `gs://${bucketName}/original/${srcFilename} downloaded to ${destFilename}`
//   );
// };

const extractCoordinates = async (buffer) => {
  try {
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
    const tiff = await fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const tiePoints = image.getTiePoints();
    const pixelScale = image.getFileDirectory().ModelPixelScale;

    if (!tiePoints || tiePoints.length === 0 || !pixelScale) {
      throw new Error('El archivo TIFF no contiene información geoespacial.');
    }

    // El punto de amarre de la esquina superior izquierda
    const tiePoint = tiePoints[0];

    // Coordenadas en el sistema de referencia de coordenadas (CRS)
    const xGeo = tiePoint.x;
    const yGeo = tiePoint.y;

    // Devolvemos las coordenadas como [longitude, latitude]
    return [xGeo, yGeo];
  } catch (error) {
    console.error('Error al extraer coordenadas del archivo TIFF:', error);
    return null;
  }
};

/**
 * @swagger
 * /api/raster:
 *   post:
 *     tags: [Raster]
 *     summary: Subir un nuevo archivo raster
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: El archivo raster a subir.
 *       - in: formData
 *         name: workspaceId
 *         type: integer
 *         required: false
 *         description: ID del espacio de trabajo.
 *       - in: formData
 *         name: user_id
 *         type: integer
 *         required: true
 *         description: ID del usuario.
 *       - in: formData
 *         name: description
 *         type: string
 *         required: false
 *         description: Descripción del archivo raster.
 *       - in: formData
 *         name: srid
 *         type: integer
 *         required: false
 *         description: SRID del archivo raster.
 *     responses:
 *       200:
 *         description: Archivo subido exitosamente.
 *       400:
 *         description: Parámetros faltantes.
 *       500:
 *         description: Error del servidor.
 */
export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const workspaceId = formData.get('workspace_id') || '0';
  const user_id = formData.get('user_id') || '0';
  const file_name = formData.get('file_name'); // Obtén el nombre del archivo si está disponible
  if (!file || user_id === '0')
    return ParamsRequired(['raster file', 'user_id']);

  // Obtén la extensión del nombre original del archivo
  const extname = path.extname(file.name).toLowerCase();

  // Combina el nombre proporcionado con la extensión original
  const finalFileName = file_name ? `${file_name}${extname}` : file.name;

  if (!validRasterGEOExtensions.includes(extname))
    return ParamsRequired(['archivo con una extensión válida']);

  try {
    const file_size = file.size;
    const raster_type = file.type;
    const description = formData.get('description') || 'Raster';
    const srid = formData.get('srid') || 4326;

    // Usa el nombre del archivo final, incluyendo la extensión
    const filename = `original/${Date.now()}-${finalFileName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    // Extraer coordenadas si el archivo es un .tif o .tiff
    let coordinates = null;
    if (extname === '.tif' || extname === '.tiff')
      coordinates = await extractCoordinates(buffer);
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
    });

    await new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('BlobStream Error:', err);
        reject(new Error('Error al subir el archivo al bucket de GCS'));
      });

      blobStream.on('finish', resolve);
      blobStream.end(buffer);
    });
    const filePath = `https://storage.googleapis.com/${bucketName}/${filename}`;
    const is_global = await isValidWorkspace(workspaceId);
    let geom = null;
    if (coordinates)
      geom = {
        type: 'Point',
        coordinates,
        crs: { type: 'name', properties: { name: 'EPSG:4326' } }, // Establece el SRID a 4326
      };

    const rasterFile = {
      file_name: finalFileName, // Usa el nombre del archivo aquí también
      file_path: filePath,
      file_size,
      upload_at: Date.now(),
      description,
      srid,
      raster_type,
      user_id,
      is_global,
      geom,
    };
    const savedRaster = await saveRasterFile(rasterFile, workspaceId);
    return Success(savedRaster);
  } catch (error) {
    console.error('Error al guardar el archivo raster:', error);
    return ServerError(error, key, 'post');
  }
}

/**
 * @swagger
 * /api/raster:
 *   get:
 *     tags: [Raster]
 *     summary: Obtener archivos raster
 *     parameters:
 *       - in: query
 *         name: id
 *         type: integer
 *         required: false
 *         description: ID del archivo raster.
 *       - in: query
 *         name: workspaceId
 *         type: integer
 *         required: false
 *         description: ID del espacio de trabajo.
 *     responses:
 *       200:
 *         description: Archivos raster obtenidos exitosamente.
 *       404:
 *         description: Archivos raster no encontrados.
 *       500:
 *         description: Error del servidor.
 */
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const user_id = searchParams.get('user_id');
  const workspaceId = searchParams.get('workspaceId');
  const page = parseInt(searchParams.get('page') || '1', 10); // Número de página
  const limit = parseInt(searchParams.get('limit') || '10', 10); // Registros por página
  const offset = (page - 1) * limit;

  try {
    let rasterFileData;

    // Consulta con id o user_id (sin paginación)
    if (id) {
      rasterFileData = await getRasterFileById(id);
    } else if (user_id) {
      rasterFileData = await getRasterFileByUserId(user_id);
    } else {
      // Consulta con paginación para todos los registros
      const totalItems = await getTotalRasterFilesCount(); // Obtiene el total de registros
      rasterFileData = await getAllRasterFilesWithPagination(limit, offset);

      // Información de paginación
      const pagination = {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit,
      };

      return Success(rasterFileData, JSON.stringify(pagination));
    }

    if (rasterFileData && !workspaceId) return Success(rasterFileData);

    // Consulta para workspaceId con paginación
    let rastersFileData;
    if (workspaceId) {
      const totalItems = await getTotalRastersByWorkspaceCount(workspaceId); // Obtiene el total de registros por workspace
      rastersFileData = await getRasterByWorkspaceIdWithPagination(
        workspaceId,
        limit,
        offset
      );

      const pagination = {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit,
      };

      return Success(rastersFileData, JSON.stringify(pagination));
    }

    return NotFoundError(key, 'get');
  } catch (error) {
    return ServerError(error, key, 'get');
  }
}

/**
 * @swagger
 * /api/raster:
 *   put:
 *     tags: [Raster]
 *     summary: Actualizar un archivo raster existente
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: id
 *         type: integer
 *         required: true
 *         description: ID del archivo raster.
 *       - in: formData
 *         name: file
 *         type: file
 *         required: false
 *         description: El nuevo archivo raster.
 *       - in: formData
 *         name: description
 *         type: string
 *         required: false
 *         description: Descripción del archivo raster.
 *       - in: formData
 *         name: srid
 *         type: integer
 *         required: false
 *         description: SRID del archivo raster.
 *     responses:
 *       200:
 *         description: Archivo raster actualizado exitosamente.
 *       400:
 *         description: Parámetros faltantes.
 *       404:
 *         description: Archivo raster no encontrado.
 *       500:
 *         description: Error del servidor.
 */
export async function PUT(request) {
  const { id, file_name, file_path, description, is_global, geom } =
    await request.json();
  if (!id) return ParamsRequired(['id']);
  try {
    console.log(`To update`, {
      id,
      file_name,
      file_path,
      description,
      is_global,
      geom,
    });
    const response = await updateRasterFile({
      id,
      file_name,
      file_path,
      description,
      is_global,
      geom,
    });
    if (response) return Success(response);
    else return NotFoundError(key, 'put');
  } catch (error) {
    return ServerError(error, key, 'put');
  }
}

/**
 * @swagger
 * /api/raster:
 *   delete:
 *     tags: [Raster]
 *     summary: Eliminar un archivo raster
 *     parameters:
 *       - in: query
 *         name: id
 *         type: integer
 *         required: true
 *         description: ID del archivo raster a eliminar.
 *     responses:
 *       200:
 *         description: Archivo raster eliminado exitosamente.
 *       400:
 *         description: Parámetros faltantes.
 *       404:
 *         description: Archivo raster no encontrado.
 *       500:
 *         description: Error del servidor.
 */
export async function DELETE(request) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  // const workspaceId = searchParams.get('workspaceId');

  if (!id) return ParamsRequired(['id']);
  try {
    let deletedRaster;
    if (id) deletedRaster = await deleteRasterFileById(id);
    // else if (workspaceId)
    //   deletedRaster = await deleteRasterFileByWorkspaceId(Number(workspaceId));

    if (deletedRaster) return Success(deletedRaster);
    else return NotFoundError(key, 'delete');
  } catch (error) {
    return ServerError(error, key, 'delete');
  }
}
