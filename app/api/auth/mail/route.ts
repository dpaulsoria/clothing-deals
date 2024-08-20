// app/api/auth/mail/route.ts
import sgMail from '@sendgrid/mail';
import { NextRequest } from 'next/server';
import { ParamsRequired, ServerError, Success } from '@utils/response.handler';

sgMail.setApiKey(process.env.SENDGRID_MAILER_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, subject, message } = await request.json();

    // Verifica que todos los parámetros requeridos estén presentes
    if (!email || !subject || !message) {
      return ParamsRequired(['email', 'subject', 'message']);
    }

    const msg = {
      to: email,
      from: 'dpaulsoria@gmail.com',
      subject: subject,
      text: message,
    };

    // Enviar el correo utilizando SendGrid
    await sgMail.send(msg);

    return Success('Email sent successfully');
  } catch (error) {
    return ServerError(error, 'mail', 'post');
  }
}
