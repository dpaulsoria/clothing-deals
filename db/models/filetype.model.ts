// db/models/filetype.model.ts
import { Identifier } from '@db/models/indetifier.interface';
import { QueryResult } from 'pg';
import { query } from '@db/db';
import { updateHandler } from '@utils/update.handler';

// es importante tener las " " porque asi se debe hacer la consulta en la BD
const TABLE: string = '"GPG_FILETYPE"';

export interface FileType extends Identifier {
  id?: string;
  name: string;
  extension: string;
  created_at?: Date;
  updated_at?: Date;
}

export async function createFileType(filetype: FileType): Promise<FileType> {
  const result: QueryResult<FileType> = await query(
    `INSERT INTO ${TABLE} (name, extension) VALUES ($1, $2) RETURNING *`,
    [filetype.name, filetype.extension]
  );
  return result.rows[0];
}

export async function getFileTypeById(id: number): Promise<FileType> {
  const result: QueryResult<FileType> = await query(
    `SELECT * FROM ${TABLE} WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function getAllFiletypes(): Promise<FileType[]> {
  const result: QueryResult<FileType> = await query(`SELECT * FROM ${TABLE}`);
  return result.rows;
}

export async function getFileTypeByExtension(
  extension: string
): Promise<FileType[]> {
  const result: QueryResult<FileType> = await query(
    `SELECT * FROM ${TABLE} WHERE extension = $1`,
    [extension]
  );
  return result.rows;
}

export const updateFileType = async (
  updateFields: Partial<FileType>
): Promise<FileType> => {
  const validFields: string[] = ['name', 'extension'];
  return await updateHandler<FileType>(TABLE, validFields, updateFields);
};

export const deleteFileTypeById = async (id: string): Promise<FileType> => {
  const result = await query(`DELETE FROM ${TABLE} WHERE id = $1 RETURNING *`, [
    id,
  ]);
  return result.rows[0];
};
