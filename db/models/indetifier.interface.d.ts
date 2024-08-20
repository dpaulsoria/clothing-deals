// db/models/identifier.interface.d.ts
import { DefaultUser } from 'next-auth';

export interface Identifier extends DefaultUser {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}
