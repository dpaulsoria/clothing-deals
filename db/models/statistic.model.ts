// db/models/statistic.model.ts
import { query } from '@db/db';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Feature, GeoJsonProperties, Geometry, GeoJSON } from 'geojson';
import { Identifier } from '@db/models/indetifier.interface';
import { updateHandler } from '@utils/update.handler';
import { QueryResult } from 'pg';

const TABLE: string = '"GPG_STATISTICS"';

/**
 * @swagger
 * components:
 *   schemas:
 *     Statistics:
 *       type: object
 *       required:
 *         - user_id
 *         - timeline_init
 *         - timeline_finish
 *         - shapefile_geometry
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the statistics
 *         user_id:
 *           type: integer
 *           description: The id of the user
 *         timeline_init:
 *           type: string
 *           format: date-time
 *           description: The start time of the timeline
 *         timeline_finish:
 *           type: string
 *           format: date-time
 *           description: The end time of the timeline
 *         shapefile_geometry:
 *           type: object
 *           description: The geometry of the shapefile in GeoJSON format
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation time of the statistics
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update time of the statistics
 *       example:
 *         id: 1
 *         user_id: 123
 *         timeline_init: "2023-07-30T14:00:00Z"
 *         timeline_finish: "2023-07-30T15:00:00Z"
 *         shapefile_geometry: { "type": "Point", "coordinates": [125.6, 10.1] }
 *         created_at: "2023-07-30T14:00:00Z"
 *         updated_at: "2023-07-30T14:00:00Z"
 */
export interface Statistics extends Identifier {
  id?: string;
  name: string; // default 'Estadistica'
  user_id: string;
  timeline_init: Date;
  timeline_finish: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Regresa el GEOJSON
// Crear una nueva estadística
export async function createStatistics(
  statistics: Partial<Statistics>
): Promise<Statistics> {
  const result: QueryResult<Statistics> = await query(
    `INSERT INTO ${TABLE} (user_id, name, timeline_init, timeline_finish) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [
      statistics.user_id,
      statistics.name,
      statistics.timeline_init,
      statistics.timeline_finish,
    ]
  );
  return result.rows[0];
}

export async function associateShapefileToStatistics(
  statistics_id: string,
  shapefile_id: string
) {
  const result: QueryResult<Statistics> = await query(
    `INSERT INTO "GPG_STATS_SHAPEFILE" (statistics_id, shapefile_id) 
     VALUES ($1, $2) RETURNING *`,
    [statistics_id, shapefile_id]
  );
  return result.rows[0];
}

export async function getAllStatisticsPaginated(
  page: number,
  limit: number
): Promise<{ statistics: Statistics[]; total: number }> {
  const offset = (page - 1) * limit;

  const queryText = `
    SELECT 
      stats.*, 
      ARRAY_AGG(ss.shapefile_id) AS shapefile_ids
    FROM "GPG_STATISTICS" stats
    LEFT JOIN "GPG_STATS_SHAPEFILE" ss ON stats.id = ss.statistics_id
    GROUP BY stats.id
    ORDER BY stats.created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const result: QueryResult<Statistics> = await query(queryText, [
    limit,
    offset,
  ]);

  // Obtener el total de estadísticas para la paginación
  const countResult = await query(`SELECT COUNT(*) FROM "GPG_STATISTICS"`);
  const total = parseInt(countResult.rows[0].count, 10);

  return { statistics: result.rows, total };
}

export async function getStatisticsByUserId(
  user_id: string,
  page: number = 1,
  limit: number = 10
): Promise<{ statistics: Statistics[]; total: number }> {
  const offset = (page - 1) * limit;

  const queryText = `
    SELECT 
      stats.*, 
      ARRAY_AGG(ss.shapefile_id) AS shapefile_ids
    FROM "GPG_STATISTICS" stats
    LEFT JOIN "GPG_STATS_SHAPEFILE" ss ON stats.id = ss.statistics_id
    WHERE stats.user_id = $1
    GROUP BY stats.id
    ORDER BY stats.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const result: QueryResult<Statistics> = await query(queryText, [
    user_id,
    limit,
    offset,
  ]);

  // Obtener el total de estadísticas para la paginación
  const countResult = await query(
    `SELECT COUNT(*) FROM "GPG_STATISTICS" WHERE user_id = $1`,
    [user_id]
  );
  const total = parseInt(countResult.rows[0].count, 10);

  return { statistics: result.rows, total };
}
export async function getStatisticsById(id: string): Promise<Statistics> {
  const queryText = `
    SELECT 
      stats.*, 
      ARRAY_AGG(ss.shapefile_id) AS shapefile_ids
    FROM "GPG_STATISTICS" stats
    LEFT JOIN "GPG_STATS_SHAPEFILE" ss ON stats.id = ss.statistics_id
    WHERE stats.id = $1
    GROUP BY stats.id
  `;

  const result: QueryResult<Statistics> = await query(queryText, [id]);
  return result.rows[0];
}

export async function updateStatistics(
  updateFields: Partial<Statistics>
): Promise<Statistics> {
  const validWorkspaceFields = [
    'name',
    'timeline_init',
    'timeline_finish',
    'shapefile_id',
  ];
  return await updateHandler<Statistics>(
    TABLE,
    validWorkspaceFields,
    updateFields
  );
}

export async function deleteStatisticsById(id: string): Promise<Statistics> {
  const result: QueryResult<Statistics> = await query(
    `DELETE FROM ${TABLE} WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
