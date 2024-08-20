// db/models/shapefile.model.ts
import { query } from '@db/db';
import { Geometry, GeoJsonProperties } from 'geojson';
import { QueryResult } from 'pg';
import { AssociateWorkspace } from '@db/models/workspace_files.model';
import { Identifier } from '@db/models/indetifier.interface';
import { updateHandler } from '@utils/update.handler';
import { fileTypes } from '@repository/fileTypes';
import { WorkspaceRelation } from '@db/models/workspace.model';

const type = fileTypes['shp'];

const TABLE_STATISTICS: string = '"GPG_STATISTICS"';
const TABLE_ASSOCIATE_STATS: string = '"GPG_STATS_SHAPEFILE"';

export interface Shapefile extends Identifier, WorkspaceRelation {
  id?: string;
  name: string;
  geometry: Geometry;
  properties: GeoJsonProperties;
  user_id: string;
  is_global: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export async function deleteShapefileWithAssociations(
  id: string
): Promise<Shapefile> {
  await query(`DELETE FROM ${TABLE_ASSOCIATE_STATS} WHERE shapefile_id = $1`, [
    id,
  ]);
  const result: QueryResult<Shapefile> = await query(
    `DELETE FROM ${type.table} WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

export async function associateShapefileWithStatistics(
  shapefileId: string,
  statisticsId: string
): Promise<void> {
  await query(
    `INSERT INTO ${TABLE_ASSOCIATE_STATS} (shapefile_id, statistics_id)
     VALUES ($1, $2)`,
    [shapefileId, statisticsId]
  );
}

export async function saveFeature(
  shapefile: Partial<Shapefile>,
  workspaceId: string
): Promise<Shapefile> {
  const result: QueryResult<Shapefile> = await query(
    `INSERT INTO ${type.table} (name, geometry, properties, user_id, is_global)
     VALUES ($1, ST_SetSRID(ST_GeomFromGeoJSON($2), 4326), $3, $4, $5)
     RETURNING *`,
    [
      shapefile.name,
      JSON.stringify(shapefile.geometry),
      JSON.stringify(shapefile.properties),
      shapefile.user_id,
      shapefile.is_global,
    ]
  );
  const id: string = result.rows[0].id ?? '0';
  if (!shapefile.is_global) await AssociateWorkspace(id, workspaceId, 'shp');
  return result.rows[0];
}

export const getFeatureById = async (id: string): Promise<Shapefile> => {
  const queryText = `
    SELECT 
      shapefile.id, 
      shapefile.name, 
      ST_AsGeoJSON(shapefile.geometry) as geometry, 
      shapefile.properties, 
      shapefile.user_id, 
      shapefile.is_global, 
      shapefile.created_at, 
      shapefile.updated_at,
      ARRAY_AGG(wf.workspace_id) as workspace_ids
    FROM ${type.table} shapefile
    LEFT JOIN "GPG_WORKSPACE_FILES" wf ON wf.file_id = shapefile.id AND wf.filetype_id = 1
    WHERE shapefile.id = $1
    GROUP BY shapefile.id
  `;

  const result: QueryResult<Shapefile> = await query(queryText, [id]);
  return result.rows[0];
};

export const getGeoJSONById = async (id: string): Promise<Geometry> => {
  const result: QueryResult<{ geometry: string; properties: string }> =
    await query(
      `SELECT 
      ST_AsGeoJSON(
        CASE 
          WHEN ST_GeometryType(geometry) = 'ST_Point' 
          THEN 
            ST_Buffer(geometry::geography, (properties->>'radius')::float8)::geometry 
          ELSE geometry 
        END
      ) AS geometry,
      properties
    FROM ${type.table} 
    WHERE id = $1`,
      [id]
    );

  return JSON.parse(result.rows[0].geometry) as Geometry;
};

export const getAllFeatures = async (): Promise<Shapefile[]> => {
  const queryText = `
    SELECT 
      shapefile.id, 
      shapefile.name, 
      ST_AsGeoJSON(shapefile.geometry) as geometry, 
      shapefile.properties, 
      shapefile.user_id, 
      shapefile.is_global, 
      shapefile.created_at, 
      shapefile.updated_at,
      ARRAY_AGG(wf.workspace_id) as workspace_ids
    FROM ${type.table} shapefile
    LEFT JOIN "GPG_WORKSPACE_FILES" wf ON wf.file_id = shapefile.id AND wf.filetype_id = 1
    GROUP BY shapefile.id
  `;

  const result: QueryResult<Shapefile> = await query(queryText);
  return result.rows;
};

export const getAllGeoJSONs = async (): Promise<Geometry[]> => {
  const result: QueryResult<{ geometry: string }> = await query(
    `SELECT ST_AsGeoJSON(geometry) AS geometry FROM ${type.table}`
  );
  return result.rows.map(
    (it: { geometry: string }) => JSON.parse(it.geometry) as Geometry
  );
};

export const updateFeature = async (
  updateFields: Partial<Shapefile>
): Promise<Shapefile> => {
  const validFields: string[] = [
    'name',
    'geometry',
    'properties',
    'user_id',
    'is_global',
  ];
  return await updateHandler<Shapefile>(type.table, validFields, updateFields);
};

export const deleteFeatureById = async (id: string): Promise<Shapefile> => {
  const result: QueryResult<Shapefile> = await query(
    `DELETE FROM ${type.table} WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};
