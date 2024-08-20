// db/models/state.model.ts
import { query } from '@db/db';
import { QueryResult } from 'pg';
import { Identifier } from '@db/models/indetifier.interface';
import { updateHandler } from '@utils/update.handler';

const TABLE: string = '"GPG_STATE"';

const ASSOCIATE_TABLE: string = '"GPG_STATE_IGUANA"';

export interface State extends Identifier {
  id?: string;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AssociateStateMarker extends Identifier {
  id?: string;
  iguana_id: string;
  state_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function associateStateClassMarker(
  markerId: string,
  stateClassId: string
): Promise<boolean> {
  const result: QueryResult<AssociateStateMarker> = await query(
    `INSERT INTO ${ASSOCIATE_TABLE} (iguana_id, state_id) VALUES ($1, $2) RETURNING *`,
    [markerId, stateClassId]
  );
  return result.rowCount > 0;
}

export async function getAssociatedStateMarker(
  iguanaId: string
): Promise<AssociateStateMarker> {
  const result: QueryResult<AssociateStateMarker> = await query(
    `SELECT * FROM ${ASSOCIATE_TABLE} WHERE iguana_id = $1`,
    [iguanaId]
  );
  return result.rows[0];
}

export async function isValidStateClassification(
  stateClassificationId: string
): Promise<boolean> {
  const result: QueryResult<State> = await query(
    `SELECT * FROM ${TABLE} WHERE id = $1`,
    [stateClassificationId]
  );
  return result.rowCount > 0;
}

// Crear un nuevo estado
export async function createState(state: State): Promise<State> {
  const result: QueryResult<State> = await query(
    `INSERT INTO ${TABLE} (name, description) 
     VALUES ($1, $2) RETURNING *`,
    [state.name, state.description]
  );
  return result.rows[0];
}

// Obtener todos los estados
export async function getAllStates(): Promise<State[]> {
  const result: QueryResult<State> = await query(
    `SELECT id, name, description, created_at, updated_at FROM ${TABLE}`
  );
  return result.rows;
}

// Obtener un estado por su ID
export async function getStateById(id: string): Promise<State | null> {
  const result: QueryResult<State> = await query(
    `SELECT id, name, description, created_at, updated_at FROM ${TABLE} WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function updateStateById(
  updateFields: Partial<State>
): Promise<State> {
  const validWorkspaceFields = ['name', 'description'];
  return await updateHandler<State>(TABLE, validWorkspaceFields, updateFields);
}

export async function deleteStateById(id: string): Promise<State> {
  const result: QueryResult<State> = await query(
    `DELETE FROM ${TABLE} WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
