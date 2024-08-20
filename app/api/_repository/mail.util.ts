// app/api/_repository/mail.util.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_MAILER_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  const { to, subject, text, html } = emailData;

  const msg = {
    to,
    from: 'dpaulsoria@gmail.com',
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    return false;
  }
};
