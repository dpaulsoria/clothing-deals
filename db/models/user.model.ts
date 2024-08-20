// db/models/user.model.ts
import { query } from '@db/db';
import { Identifier } from '@db/models/indetifier.interface';
import { updateHandler } from '@utils/update.handler';
import { QueryResult } from 'pg';

const TABLE: string = '"GPG_USER"';
export type SafeUser = Omit<User, 'password'>;

export interface User extends Identifier {
  id?: string;
  email: string;
  name: string;
  profileImage_url?: string;
  password: string;
  isAdmin: number;
  isActive: number;
  token?: string;
  created_at?: Date;
  updated_at?: Date;
}
export interface CredentialsUser {
  name: string;
  email: string;
}
export const createUser = async (
  user: Omit<User, 'id' | 'created_at' | 'updated_at'>
): Promise<User> => {
  const result: QueryResult<User> = await query(
    `insert into ${TABLE} 
 (email, name, password, isAdmin, isActive, profileImage_url)
 values ($1, $2, $3, $4, $5, $6) returning *`,
    [
      user.email,
      user.name,
      user.password,
      user.isAdmin,
      user.isActive,
      user.profileImage_url,
    ]
  );
  return result.rows[0];
};

export const getUserById = async (it: string): Promise<User> => {
  const result: QueryResult<User> = await query(
    `select * from ${TABLE} where id = $1`,
    [it]
  );
  return result.rows[0];
};

export const getUserByEmail = async (it: string): Promise<User> => {
  const result: QueryResult<User> = await query(
    `select * from ${TABLE} where email = $1`,
    [it]
  );
  return result.rows[0];
};

export const getAllUsers = async (): Promise<User[]> => {
  const result: QueryResult<User> = await query(`select * from ${TABLE}`);
  return result.rows;
};

export async function updateUser(updateFields: Partial<User>): Promise<User> {
  const validUserFields = [
    'id',
    'email',
    'name',
    'password',
    'isAdmin',
    'isActive',
    'avatarUrl',
  ];
  return await updateHandler<User>(TABLE, validUserFields, updateFields);
}

export const deleteUserById = async (it: string): Promise<User> => {
  const result: QueryResult<User> = await query(
    `delete from ${TABLE} where id = $1 returning *`,
    [it]
  );
  return result.rows[0];
};

export const deleteUserByEmail = async (it: string): Promise<User> => {
  const result: QueryResult<User> = await query(
    `delete from ${TABLE} where email = $1 returning *`,
    [it]
  );
  return result.rows[0];
};
