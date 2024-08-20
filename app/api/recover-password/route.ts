// app/api/recover-password/route.ts
import { NextRequest } from 'next/server';
import { createHmac } from 'crypto';
import {
  NotFoundError,
  ParamsRequired,
  ServerError,
  Success,
} from '@utils/response.handler';
import { getUserByEmail, User } from '@db/models/user.model';
import { sendEmail } from '@api/_repository/mail.util';
import { Auth, createAuthToken } from '@db/models/auth.model';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return ParamsRequired(['email']);

  try {
    const user: User = await getUserByEmail(email);
    if (!user) {
      return NotFoundError('user', 'post');
    }

    // Generar el token seguro usando HMAC
    const resetToken: string = generateResetToken(email);
    const resetUrl: string = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password?email=${email}&token=${resetToken}`;
    console.log(`Reset Token`, resetToken);
    console.log(`Reset Url`, resetUrl);
    // Aquí podrías guardar el resetToken en la base de datos si lo necesitas para validarlo más tarde
    const expiresAt: Date = new Date(Date.now() + 3600 * 1000); // 1 hora en milisegundos

    const savedToken: Auth = await createAuthToken({
      user_id: user.id,
      token: resetToken,
      type: 1,
      expires_at: expiresAt,
    });

    if (!savedToken) {
      throw new Error(
        'Error al guardar el token de restablecimiento de contraseña.'
      );
    }

    // Contenido del correo
    const subject: string = 'Recuperación de Contraseña';
    const text: string = `Hola ${user.name},\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace:\n\n${resetUrl}\n\nSi no solicitaste esta acción, ignora este correo.`;
    const html: string = `
      <p>Hola ${user.name},</p>
      <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
      <a href="${resetUrl}">Restablecer contraseña</a>
      <p>Si no solicitaste esta acción, ignora este correo.</p>
    `;

    // Enviar el correo
    const emailSent = await sendEmail({
      to: email,
      subject,
      text,
      html,
    });

    if (emailSent)
      return Success({ message: 'Correo de recuperación enviado' });
    else return ServerError('No se pudo enviar el correo', 'user', 'post');
  } catch (error) {
    return ServerError(error, 'user', 'post');
  }
}

function generateResetToken(email: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET no está definido en el entorno');
  }

  // Crear un HMAC utilizando el email y el NEXTAUTH_SECRET como salt
  const hmac = createHmac('sha256', secret);
  hmac.update(email);

  // Devolver el token como un string hexadecimal
  return hmac.digest('hex');
}
