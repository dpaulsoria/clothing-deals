import { NextRequest, NextResponse } from 'next/server';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import { User, getUserByEmail } from '@db/models/user.model';
import {
  Auth,
  deleteAuthTokenById,
  getAuthTokenByUserId,
} from '@db/models/auth.model';

export async function POST(req: NextRequest) {
  const { email, token, type } = await req.json();
  if (!email || !token || !type)
    return ParamsRequired(['email', 'token', 'type']);
  try {
    const user: User = await getUserByEmail(email);
    if (!user) return NotFoundError('user', 'post');
    const actualToken: Auth = await getAuthTokenByUserId(user.id);
    if (!actualToken) return NotFoundError('user', 'post');

    let compare: boolean;
    if (type === 'reset') compare = token === actualToken.token;
    else compare = token === actualToken.token;

    if (compare) {
      await deleteAuthTokenById(actualToken.id);
      return Success('Token válido');
    } else return NotFoundError('user', 'post');
  } catch (error) {
    return ServerError(error, 'user', 'post');
  }
}
