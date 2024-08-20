// db/models/shapeindex.model.ts
import { query } from '@db/db';
import { QueryResult } from 'pg';
import { AssociateWorkspace } from '@db/models/workspace_files.model';
import { fileTypes } from '@repository/fileTypes';
import { updateHandler } from '@utils/update.handler';
import { Identifier } from './indetifier.interface';

const type = fileTypes['shx'];

export interface ShapeIndex extends Identifier {
  id?: string;
  feature_id: number;
  geom_offset: number;
  content_length: number;
  user_id: string;
  is_global: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export const saveShapeIndex = async (
  shapeIndex: ShapeIndex,
  workspaceId?: string
): Promise<ShapeIndex> => {
  let id: string | undefined = '0';
  const result: QueryResult<ShapeIndex> = await query(
    `INSERT INTO ${type.table} (feature_id, geom_offset, content_length, user_id, is_global, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING *`,
    [
      shapeIndex.feature_id,
      shapeIndex.geom_offset,
      shapeIndex.content_length,
      shapeIndex.user_id,
      shapeIndex.is_global,
    ]
  );
  id = result.rows[0].id;
  if (workspaceId) await AssociateWorkspace(id, workspaceId, 'shx');
  return result.rows[0];
};

export const getShapeIndexById = async (
  feature_id: string
): Promise<ShapeIndex> => {
  const result: QueryResult<ShapeIndex> = await query(
    `SELECT ${type.parameters.join(', ')} FROM ${type.table} WHERE id = $1`,
    [feature_id]
  );
  return result.rows[0];
};

export const getAllShapeIndex = async (): Promise<ShapeIndex[]> => {
  const result: QueryResult<ShapeIndex> = await query(
    `SELECT ${type.parameters.join(', ')} FROM ${type.table}`
  );
  return result.rows;
};

export const updateShapeIndex = async (
  updateFields: Partial<ShapeIndex>
): Promise<ShapeIndex> => {
  const validFields: string[] = [
    'feature_id',
    'geom_offset',
    'content_length',
    'is_global',
  ];
  return await updateHandler<ShapeIndex>(type.table, validFields, updateFields);
};

export const deleteShapeIndexById = async (id: string): Promise<ShapeIndex> => {
  const result: QueryResult<ShapeIndex> = await query(
    `DELETE FROM ${type.table} WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};
