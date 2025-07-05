// smtp.js
import nodemailer from 'nodemailer';
import { smtp_host, smtp_port, smtp_user, smtp_pass } from '../lib/configs.js';

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: smtp_host,
    port: smtp_port,
    secure: true,
    auth: {
      user: smtp_user,
      pass: smtp_pass,
    },
  });

  await transporter.sendMail({
    from: `"Music App" <${smtp_user}>`,
    to,
    subject,
    html,
  });
};
