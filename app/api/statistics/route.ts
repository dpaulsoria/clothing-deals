// app/api/statistics/route.ts
/**
 * @swagger
 * tags:
 *   name: Statistic
 *   description: API for managing statistics
 */

import { NextRequest } from 'next/server';
import {
  createStatistics,
  getStatisticsById,
  getStatisticsByUserId,
  updateStatistics,
  deleteStatisticsById,
  Statistics,
  associateShapefileToStatistics,
  getAllStatisticsPaginated,
} from '@db/models/statistic.model';
import { CustomResponse } from '@utils/customResponse';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';

const key: keyof CustomResponse = 'statistics';

/**
 * @swagger
 * /endpoint:
 *   get:
 *     tags: [Statistic]
 *     summary: Retrieve statistics
 *     description: Retrieve statistics by ID, user ID, or get all statistics.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID of the statistics
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: User ID of the statistics
 *     responses:
 *       200:
 *         description: A list of statistics or a single statistics object
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Statistics'
 *       404:
 *         description: Statistics not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const user_id = searchParams.get('user_id');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    let result: Statistics | { statistics: Statistics[]; total: number };
    if (id) {
      result = await getStatisticsById(id);
      if (result) return Success(result);
      else return NotFoundError(key, 'get');
    } else if (user_id) {
      result = await getStatisticsByUserId(user_id, page, limit);
      if (result) return Success(result.statistics, String(result.total));
      else return NotFoundError(key, 'get');
    } else {
      result = await getAllStatisticsPaginated(page, limit);
      if (result) return Success(result.statistics, String(result.total));
      else return NotFoundError(key, 'get');
    }
  } catch (error) {
    return ServerError(error, key, 'get');
  }
}

/**
 * @swagger
 * /endpoint:
 *   post:
 *     tags: [Statistic]
 *     summary: Create a new statistics entry
 *     description: Create a new statistics entry with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - timeline_init
 *               - timeline_finish
 *               - shapefile_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               timeline_init:
 *                 type: string
 *                 format: date-time
 *               timeline_finish:
 *                 type: string
 *                 format: date-time
 *               shapefile_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Statistics'
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user_id, name, timeline_init, timeline_finish, shapefile_ids } = body;

  if (
    !user_id ||
    !timeline_init ||
    !timeline_finish ||
    !shapefile_ids ||
    shapefile_ids.length === 0
  ) {
    return ParamsRequired([
      'user_id',
      'name',
      'timeline_init',
      'timeline_finish',
    ]);
  }

  try {
    // Crea la estadística
    const result = await createStatistics({
      user_id,
      name,
      timeline_init,
      timeline_finish,
    });

    if (!result || !result.id) {
      return ServerError('Failed to create statistics', key, 'post');
    }

    // Asocia cada shapefile con la estadística
    for (const shapefile_id of shapefile_ids) {
      try {
        await associateShapefileToStatistics(result.id, shapefile_id);
      } catch (error) {
        // Si falla, eliminar la estadística creada para evitar datos huérfanos
        await deleteStatisticsById(result.id);
        return ServerError(
          `Failed to associate shapefile ${shapefile_id} to statistics`,
          key,
          'post'
        );
      }
    }

    return Success(result);
  } catch (error) {
    console.error('Detailed error:', error);
    return ServerError(error, 'statistics', 'post');
  }
}

/**
 * @swagger
 * /endpoint:
 *   put:
 *     tags: [Statistic]
 *     summary: Update an existing statistics entry
 *     description: Update an existing statistics entry with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               timeline_init:
 *                 type: string
 *                 format: date-time
 *               timeline_finish:
 *                 type: string
 *                 format: date-time
 *               shapefile_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Statistics'
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: Statistics not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(request: NextRequest) {
  const statisticsData: Partial<Statistics> = await request.json();
  if (!statisticsData.id) return ParamsRequired(['id']);
  if (Object.keys(statisticsData).length === 1)
    return ParamsRequired([
      'name',
      'timeline_init',
      'timeline_finish',
      'shapefile_id',
    ]);

  try {
    const result = await updateStatistics(statisticsData);
    if (result) return Success(result);
    else return NotFoundError(key, 'put');
  } catch (error) {
    return ServerError(error, key, 'put');
  }
}

/**
 * @swagger
 * /endpoint:
 *   delete:
 *     tags: [Statistic]
 *     summary: Delete a statistics entry
 *     description: Delete a statistics entry by ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: ID of the statistics to delete
 *     responses:
 *       200:
 *         description: Deleted statistics
 *       404:
 *         description: Statistics not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) return ParamsRequired(['id']);
  try {
    let result: Statistics;
    if (id) result = await deleteStatisticsById(id);
    if (result) return Success(result);
    else return NotFoundError(key, 'delete');
  } catch (error) {
    return ServerError(error, key, 'delete');
  }
}
