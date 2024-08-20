import { NextRequest } from 'next/server';
import { NotFoundError, ServerError, Success } from '@utils/response.handler';
import {
  getIguanaMarkerByDate,
  getIguanaMarkerFilterByGeometry,
  getIguanaMarkerFilterByGeometry_NoDate,
  getIguanaMarkerFilterById,
  getIguanaMarkerFilterById_NoDate,
  Iguana,
} from '@db/models/iguana.model';
import { CustomResponse } from '@utils/customResponse';

const key: keyof CustomResponse = 'marker';

/**
 * @swagger
 * /api/marker/filter:
 *   get:
 *     tags: [Marker]
 *     summary: Filtrar iguanas por fecha y geometría
 *     parameters:
 *       - in: query
 *         name: init
 *         schema:
 *           type: string
 *         description: Fecha inicial del rango de filtrado
 *       - in: query
 *         name: finish
 *         schema:
 *           type: string
 *         description: Fecha final del rango de filtrado
 *       - in: query
 *         name: shapefileId
 *         schema:
 *           type: integer
 *         description: ID del shapefile
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de resultados por página
 *       - in: body
 *         name: geometry
 *         description: Geometría en formato GeoJSON
 *         schema:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *     responses:
 *       200:
 *         description: Resultados filtrados de iguanas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Iguana'
 *                 total:
 *                   type: integer
 *                   description: Total de resultados
 *       400:
 *         description: Parámetros faltantes o incorrectos
 *       500:
 *         description: Error del servidor
 */
export async function filterIguanas(request: NextRequest) {
  const searchParams: URLSearchParams = request.nextUrl.searchParams;
  const init: string | null = searchParams.get('init');
  const finish: string | null = searchParams.get('finish');
  const shapefileId: string | null = searchParams.get('shapefileId');

  let geometry = null;

  try {
    if (request.body) {
      const body = await request.json();
      geometry = body.geometry;
    }
  } catch (error) {
    return ServerError(error, key, 'get');
  }

  if (geometry && geometry.type !== 'Polygon') return NotFoundError(key, 'get');

  if (init && finish) {
    console.log(`Filter`, init, finish, shapefileId, geometry);
    try {
      let filterResult: Iguana[] = [];
      if (shapefileId)
        filterResult = await getIguanaMarkerFilterById(
          shapefileId,
          init,
          finish
        );
      else if (geometry)
        filterResult = await getIguanaMarkerFilterByGeometry(
          geometry,
          init,
          finish
        );
      else filterResult = await getIguanaMarkerByDate(init, finish);
      if (filterResult.length > 0) return Success(filterResult);
      else return NotFoundError(key, 'get');
    } catch (error) {
      return ServerError(error, key, 'get');
    }
  } else {
    return NotFoundError(key, 'get');
  }
}

/**
 * @swagger
 * /api/marker/filter:
 *   get:
 *     tags: [Marker]
 *     summary: Filtrar iguanas por geometría
 *     parameters:
 *       - in: query
 *         name: shapefile_id
 *         schema:
 *           type: integer
 *         description: ID del shapefile
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para la paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de resultados por página
 *       - in: body
 *         name: geometry
 *         description: Geometría en formato GeoJSON
 *         schema:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *     responses:
 *       200:
 *         description: Resultados filtrados de iguanas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Iguana'
 *                 total:
 *                   type: integer
 *                   description: Total de resultados
 *       400:
 *         description: Parámetros faltantes o incorrectos
 *       500:
 *         description: Error del servidor
 */
export async function filterIguanasByGeometry(request: NextRequest) {
  const searchParams: URLSearchParams = request.nextUrl.searchParams;
  const shapefileId: string | null = searchParams.get('shapefile_id');
  let geometry = null;

  try {
    if (request.body) {
      const body = await request.json();
      geometry = body.geometry;
    }
  } catch (error) {
    return ServerError(error, key, 'get');
  }

  // Verificar si se cae con círculos y cuadrados
  if (geometry && geometry.type !== 'Polygon') return NotFoundError(key, 'get');

  try {
    let filterResult: Iguana[] = [];
    if (shapefileId)
      filterResult = await getIguanaMarkerFilterById_NoDate(shapefileId);
    else if (geometry)
      filterResult = await getIguanaMarkerFilterByGeometry_NoDate(geometry);
    else return NotFoundError(key, 'get');

    if (filterResult.length > 0)
      return Success(filterResult);
    else return NotFoundError(key, 'get');
  } catch (error) {
    return ServerError(error, key, 'get');
  }
}
