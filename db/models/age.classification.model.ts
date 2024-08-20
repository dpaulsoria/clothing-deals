// db/models/age.classification.model.ts
import { query } from '@db/db';
import { Identifier } from '@db/models/indetifier.interface';
import { QueryResult } from 'pg';
import { updateHandler } from '@utils/update.handler';

const TABLE: string = '"GPG_AGE_CLASSIFICATION"';

const ASSOCIATE_TABLE: string = '"GPG_AGE_CLASS_IGUANA"';

export interface AgeClassification extends Identifier {
  id?: string;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AssociateAgeClassMarker extends Identifier {
  id?: string;
  iguana_id: string;
  age_class_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function getAssociatedAgeClassMarker(
  iguanaId: string
): Promise<AssociateAgeClassMarker> {
  const result: QueryResult<AssociateAgeClassMarker> = await query(
    `SELECT * FROM ${ASSOCIATE_TABLE} WHERE iguana_id = $1`,
    [iguanaId]
  );
  return result.rows[0];
}

export async function associateAgeClassMarker(
  markerId: string,
  ageClassId: string
): Promise<boolean> {
  const result: QueryResult<AssociateAgeClassMarker> = await query(
    `INSERT INTO ${ASSOCIATE_TABLE} (iguana_id, age_class_id) VALUES ($1, $2) RETURNING *`,
    [markerId, ageClassId]
  );
  return result.rowCount > 0;
}

export async function isValidAgeClassification(
  ageClassificationId: string
): Promise<boolean> {
  console.log(`isvalid`, ageClassificationId);
  const result: QueryResult<AgeClassification> = await query(
    `SELECT * FROM ${TABLE} WHERE id = $1`,
    [ageClassificationId]
  );
  return result.rowCount > 0;
}

// Crear una nueva clasificación de edad
export async function createAgeClassification(
  ageClassification: AgeClassification
): Promise<AgeClassification> {
  const result: QueryResult<AgeClassification> = await query(
    `INSERT INTO ${TABLE} (name, description, created_at, updated_at) 
     VALUES ($1, $2, NOW(), NOW()) RETURNING *`,
    [ageClassification.name, ageClassification.description]
  );
  return result.rows[0];
}

// Obtener todas las clasificaciones de edad
export async function getAllAgeClassifications(): Promise<AgeClassification[]> {
  const result: QueryResult<AgeClassification> = await query(
    `SELECT * FROM ${TABLE}`
  );
  return result.rows;
}

// Obtener una clasificación de edad por su ID
export async function getAgeClassificationById(
  id: string
): Promise<AgeClassification> {
  const result: QueryResult<AgeClassification> = await query(
    `SELECT * FROM ${TABLE} WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function updateAgeClassificationById(
  updateFields: Partial<AgeClassification>
): Promise<AgeClassification> {
  const validWorkspaceFields: string[] = ['name', 'description'];
  return await updateHandler<AgeClassification>(
    TABLE,
    validWorkspaceFields,
    updateFields
  );
}

export async function deleteAgeClassificationById(
  id: string
): Promise<AgeClassification> {
  const result: QueryResult<AgeClassification> = await query(
    `DELETE FROM ${TABLE} WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
