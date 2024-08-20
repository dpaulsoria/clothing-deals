// app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import {
  ParamsRequired,
  Success,
  NotFoundError,
  ServerError,
} from '@utils/response.handler';
import { getUserByEmail, User } from '@db/models/user.model';
import { comparePassword, encryptPassword } from '@repository/auth.util';
import { Auth, createAuthToken } from '@db/models/auth.model';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return ParamsRequired(['email', 'password']);
    const user: User | null = await getUserByEmail(email);
    if (!user) return NotFoundError('user', 'post');
    const isPasswordValid: boolean = await comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) return NotFoundError('user', 'post');
    const expiresAt: Date = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 horas a partir de ahora
    console.log(`Login`, {
      user_id: user.id,
      token: await encryptPassword(String(user)),
      expires_at: expiresAt,
      type: 0,
    });
    const authToken: Auth = await createAuthToken({
      user_id: user.id,
      token: await encryptPassword(String(user)),
      expires_at: expiresAt,
      type: 0,
    });
    if (!authToken) return NotFoundError('user', 'post');
    user.token = authToken.token;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser }: User = user;
    return Success(safeUser);
  } catch (error) {
    return ServerError(error, 'user', 'post');
  }
}
