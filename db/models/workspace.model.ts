// db/models/workspace.model.ts
import { query } from '@db/db';
import { QueryResult } from 'pg';
import { updateHandler } from '@utils/update.handler';
import { Identifier } from '@db/models/indetifier.interface';

const TABLE: string = '"GPG_WORKSPACE"';

export interface WorkspaceRelation {
  workspace_ids?: string[];
}

export interface Workspace extends Identifier {
  id?: string;
  user_id: number;
  user_name?: string;
  user_email?: string;
  name: string;
  description: string;
  state: number;
  is_global: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export async function isValidWorkspace(workspaceId: string): Promise<boolean> {
  const result: QueryResult = await query(
    `SELECT * FROM ${TABLE} WHERE id = $1`,
    [workspaceId]
  );
  return result.rowCount > 0;
}

export async function createWorkspace(
  workspace: Partial<Workspace>
): Promise<Workspace> {
  const result: QueryResult<Workspace> = await query(
    `INSERT INTO ${TABLE} (user_id, name, description, state, is_global)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      workspace.user_id,
      workspace.name,
      workspace.description,
      workspace.state,
      workspace.is_global,
    ]
  );
  return result.rows[0];
}

export async function getWorkspaceById(id: string): Promise<Workspace> {
  const result = await query(
    `SELECT w.*, u.name AS user_name, u.email AS user_email 
     FROM ${TABLE} w
     INNER JOIN "GPG_USER" u ON w.user_id = u.id 
     WHERE w.id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function getWorkspaceByUserId(
  user_id: string
): Promise<Array<Workspace>> {
  const result = await query(
    `SELECT w.*, u.name AS user_name, u.email AS user_email 
     FROM ${TABLE} w
     INNER JOIN "GPG_USER" u ON w.user_id = u.id 
     WHERE w.user_id = $1`,
    [user_id]
  );
  return result.rows;
}

export async function getAllWorkspaces(): Promise<Array<Workspace>> {
  const result = await query(
    `SELECT w.*, u.name AS user_name, u.email AS user_email 
     FROM ${TABLE} w
     INNER JOIN "GPG_USER" u ON w.user_id = u.id`
  );
  return result.rows;
}

export async function updateWorkspaceById(updateFields: Partial<Workspace>) {
  const validWorkspaceFields = ['name', 'description', 'is_global'];
  return await updateHandler<Workspace>(
    TABLE,
    validWorkspaceFields,
    updateFields
  );
}

export async function deleteWorkspaceById(id: string) {
  const result = await query(`DElETE FROM ${TABLE} WHERE id = $1 RETURNING *`, [
    id,
  ]);
  return result.rows[0];
}
