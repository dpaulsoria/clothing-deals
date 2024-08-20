// db/models/workspace_files.model.ts
import { QueryResult } from 'pg';

import { query } from '@db/db';
import { deleteFeatureById, Shapefile } from '@db/models/shapefile.model';
import { ShapeIndex } from '@db/models/shapeindex.model';
import { RasterFile } from '@db/models/raster.model';
import { fileTypes } from '@repository/fileTypes';

export interface WorkspaceFiles {
  id?: string;
  workspaceId: string;
  fileId: string;
  filetypeId: string;
}

const TABLE: string = '"GPG_WORKSPACE_FILES"';

export async function AssociateWorkspace(
  fileId: string,
  workspaceId: string,
  key: keyof typeof fileTypes
): Promise<WorkspaceFiles> {
  const result: QueryResult<WorkspaceFiles> = await query(
    `INSERT INTO ${TABLE} (workspace_id, file_id, filetype_id) 
       VALUES ($1, $2, $3) RETURNING *`,
    [workspaceId, fileId, fileTypes[key].id]
  );
  return result.rows[0];
}

export const getFeaturesByWorkspaceId = async (
  workspaceId: string
): Promise<Shapefile[]> => {
  const tmp = await getFilesByWorkspaceId(workspaceId, 'shp');
  return tmp as Shapefile[];
};

export const getShapeIndexByWorkspaceId = async (
  workspaceId: string
): Promise<ShapeIndex[]> => {
  return (await getFilesByWorkspaceId(workspaceId, 'shx')) as ShapeIndex[];
};

export const getRasterByWorkspaceId = async (
  workspaceId: string
): Promise<Shapefile[]> => {
  return (await getFilesByWorkspaceId(workspaceId, 'tif')) as Shapefile[];
};

export const deleteFeaturesByWorkspaceId = async (workspaceId: string) => {
  const shpIds: { file_id: string }[] = await getFilesIdByWorkspaceId(
    workspaceId,
    'shp'
  );
  const deleted: string[] = [];
  await Promise.all(
    shpIds?.map(async (it) => {
      const result = await deleteFeatureById(it.file_id);
      if (result) deleted.push(it.file_id);
    })
  );
  return deleted;
};

export const deleteShapeIndexByWorkspaceId = async (workspaceId: string) => {
  const shpIds: { file_id: string }[] = await getFilesIdByWorkspaceId(
    workspaceId,
    'shx'
  );
  const deleted: string[] = [];
  await Promise.all(
    shpIds?.map(async (it) => {
      const result = await deleteFeatureById(it.file_id);
      if (result) deleted.push(it.file_id);
    })
  );
  return deleted;
};

export const getFilesIdByWorkspaceId = async (
  workspaceId: string,
  key: keyof typeof fileTypes // shp || shx || tif
): Promise<{ file_id: string }[]> => {
  const type = fileTypes[key];
  const result = await query(
    `SELECT file_id FROM ${TABLE} WHERE workspace_id = $1 AND filetype_id = $2`,
    [workspaceId, type.id]
  );
  return result.rows;
};

// By default as GeoJson
export const getFilesByWorkspaceId = async (
  workspaceId: string,
  key: keyof typeof fileTypes
): Promise<Shapefile[] | ShapeIndex[] | RasterFile[]> => {
  const type = fileTypes[key];
  const filesId: { file_id: string }[] = await getFilesIdByWorkspaceId(
    workspaceId,
    key
  );
  return await Promise.all(
    filesId.map(async (row) => {
      const fileResult = await query(
        `SELECT ${type.parameters.join(', ')} FROM ${type.table} WHERE id = $1`,
        [row.file_id]
      );
      return fileResult.rows[0];
    })
  );
};
