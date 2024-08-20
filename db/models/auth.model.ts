// db/models/auth.model.ts
// db/models/auth.model.ts
import { query } from '@db/db';
import { Identifier } from '@db/models/indetifier.interface';
import { updateHandler } from '@utils/update.handler';
import { QueryResult } from 'pg';

const TABLE: string = '"GPG_AUTH"';

export interface Auth extends Identifier {
  id?: string;
  user_id: string;
  token?: string;
  type?: number;
  created_at?: Date;
  expires_at?: Date;
}

export const createAuthToken = async (
  auth: Omit<Auth, 'id' | 'created_at'>
): Promise<Auth> => {
  const result: QueryResult<Auth> = await query(
    `insert into ${TABLE} 
 (user_id, token, type, expires_at)
 values ($1, $2, $3, $4) returning *`,
    [auth.user_id, auth.token || null, auth.type, auth.expires_at || null]
  );
  return result.rows[0];
};

export const getAuthTokenById = async (id: string): Promise<Auth> => {
  const result: QueryResult<Auth> = await query(
    `select * from ${TABLE} where id = $1`,
    [id]
  );
  return result.rows[0];
};

export const getAuthTokenByUserId = async (user_id: string): Promise<Auth> => {
  const result: QueryResult<Auth> = await query(
    `select * from ${TABLE} where user_id = $1 order by id desc`,
    [user_id]
  );
  return result.rows[0];
};

export const getAuthTokenByResetToken = async (
  resetToken: string
): Promise<Auth> => {
  const result: QueryResult<Auth> = await query(
    `select * from ${TABLE} where reset_token = $1`,
    [resetToken]
  );
  return result.rows[0];
};

export const getAuthTokensByUserId = async (
  userId: string
): Promise<Auth[]> => {
  const result: QueryResult<Auth> = await query(
    `select * from ${TABLE} where user_id = $1`,
    [userId]
  );
  return result.rows;
};

export const getAuthTokenBySessionToken = async (
  sessionToken: string
): Promise<Auth> => {
  const result: QueryResult<Auth> = await query(
    `select * from ${TABLE} where session_token = $1`,
    [sessionToken]
  );
  return result.rows[0];
};

export const deleteAuthTokenById = async (id: string): Promise<Auth> => {
  const result: QueryResult<Auth> = await query(
    `delete from ${TABLE} where id = $1 returning *`,
    [id]
  );
  return result.rows[0];
};

export async function updateAuthToken(
  updateFields: Partial<Auth>
): Promise<Auth> {
  const validAuthFields = ['user_id', 'token', 'type', 'expires_at'];
  return await updateHandler<Auth>(TABLE, validAuthFields, updateFields);
}
