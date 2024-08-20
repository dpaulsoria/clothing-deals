// app/api/marker/filter/route.ts
import { NextRequest } from 'next/server';
import {
  filterIguanas,
  filterIguanasByGeometry,
} from '@repository/filter.util';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import { CustomResponse } from '@utils/customResponse';
import {
  getIguanaMarkerByDate,
  getIguanaMarkerFilterByGeometry,
  getIguanaMarkerFilterById,
  Iguana,
} from '@/db/models/iguana.model';

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
const key: keyof CustomResponse = 'marker';

export async function GET(request: NextRequest) {
  const searchParams: URLSearchParams = request.nextUrl.searchParams;
  const init: string | null = searchParams.get('init');
  const finish: string | null = searchParams.get('finish');
  const shapefileId: string | null = searchParams.get('shapefile_id');

  // Validar que las fechas 'init' y 'finish' estén presentes
  if (!init || !finish) {
    return ParamsRequired(['init', 'finish']);
  }

  try {
    let filterResult: Iguana[];

    if (shapefileId) {
      console.log(`Filter by shapefileId`, init, finish, shapefileId);
      filterResult = await getIguanaMarkerFilterById(shapefileId, init, finish);
    } else {
      console.log(`Filter by date`, init, finish);
      filterResult = await getIguanaMarkerByDate(init, finish);
    }
    if (filterResult.length > 0) return Success(filterResult);
    return NotFoundError(key, 'get');
  } catch (error) {
    return ServerError(error, key, 'get');
  }
}
