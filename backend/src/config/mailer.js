import nodemailer from 'nodemailer';

export const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn('SMTP env not fully set. Forgot password emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

export const sendMail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  if (!transporter) return { queued: false };
  const from = process.env.FROM_EMAIL || 'no-reply@example.com';
  return transporter.sendMail({ from, to, subject, html, text });
};
