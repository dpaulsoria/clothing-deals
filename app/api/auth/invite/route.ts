// app/api/auth/invite
import { NextRequest } from 'next/server';
import {
  ParamsRequired,
  ServerError,
  Success,
  NotFoundError,
} from '@utils/response.handler';
import {
  getUserByEmail,
  createUser,
  updateUser,
  User,
} from '@db/models/user.model';
import { sendEmail } from '@repository/mail.util';
import crypto from 'crypto';
import { isValidEmail } from '@repository/util';
import { CustomResponse } from '@utils/customResponse';
import { encryptPassword } from '@repository/auth.util';

const key: keyof CustomResponse = 'user';

// Función para generar una contraseña temporal
function generateTemporaryPassword(): string {
  return crypto.randomBytes(8).toString('hex'); // Genera una contraseña de 16 caracteres hexadecimales
}

// Función para generar una plantilla HTML
function generateEmailTemplate(name: string, tempPassword: string): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Bienvenido a nuestra aplicación web GIS</h2>
      <p>Hola ${name},</p>
      <p>Nos complace invitarte a probar nuestra aplicación web GIS. Esta aplicación te permitirá realizar un seguimiento detallado de tus proyectos geoespaciales y analizar datos de manera eficiente.</p>
      <p>Tu cuenta ha sido creada con la siguiente contraseña temporal:</p>
      <p style="font-size: 18px; font-weight: bold;">${tempPassword}</p>
      <p>Por favor, inicia sesión y cambia tu contraseña en tu primer acceso para garantizar la seguridad de tu cuenta.</p>
      <p>Puedes acceder a la aplicación en el siguiente enlace:</p>
      <p><a href="https://galapagosgis.live/login" style="color: #0066cc;">Iniciar sesión</a></p>
      <p>Gracias por unirte a nosotros,</p>
      <p>El equipo de GPG</p>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    // Validar parámetros y correo electrónico
    if (!email || !name) return ParamsRequired(['email', 'name']);
    if (!isValidEmail(email)) return ParamsRequired(['A valid email address']);

    // Verificar si el usuario ya existe
    const user: User | null = await getUserByEmail(email);
    if (user) return NotFoundError(key, 'post');

    // Generar una contraseña temporal
    const tempPassword = generateTemporaryPassword();

    // Enviar el correo de invitación con la contraseña temporal
    const subject: string = 'Invitación de Registro';
    const html: string = generateEmailTemplate(name, tempPassword);
    const emailSent: boolean = await sendEmail({
      to: email,
      subject,
      text: `Hola ${name},\n\nNos complace invitarte a probar nuestra aplicación web GIS. Tu contraseña temporal es: ${tempPassword}.\n\nPor favor, inicia sesión en https://yourwebsite.com/login y cambia tu contraseña en tu primer acceso.`,
      html, // Usamos la plantilla HTML aquí
    });

    if (!emailSent) {
      return ServerError(
        'Failed to send invitation email. User not created.',
        key,
        'post'
      );
    }

    // Crear un nuevo usuario con la contraseña temporal solo si el correo fue enviado con éxito
    const result: User = await createUser({
      name,
      email,
      password: await encryptPassword(tempPassword), // Guardar la contraseña temporal
      isAdmin: 0,
      isActive: 1, // Activamos el usuario inmediatamente después de enviar el correo
    });

    if (result) {
      // Omite la propiedad `password` del objeto `user`
      const { password: _, ...safeUser }: User = result;

      return Success({ emailSent, user: safeUser });
    } else {
      return NotFoundError(key, 'post');
    }
  } catch (error) {
    return ServerError(error, key, 'post');
  }
}
