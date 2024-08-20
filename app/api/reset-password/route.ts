// app/api/reset-password/route.ts
import { NextRequest } from 'next/server';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import { User, getUserByEmail, updateUser } from '@db/models/user.model';
import { encryptPassword } from '@repository/auth.util';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return ParamsRequired(['email', 'password']);
  try {
    const user: User = await getUserByEmail(email);
    if (!user) return NotFoundError('user', 'post');
    user.password = await encryptPassword(password);
    const response: User = await updateUser(user);
    if (!response) return NotFoundError('user', 'post');
    else return Success(true);
  } catch (error) {
    return ServerError(error, 'user', 'post');
  }
}
