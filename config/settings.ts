import { registerAs } from '@nestjs/config';

export default registerAs('settings', () => ({
  secret: process.env.SECRET_KEY,
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  emailTemplateViews: process.env.EMAIL_TEMPLATE_DIR,
  emailSender: process.env.EMAIL_SENDER,
  orderAdminEmail: process.env.ADMIN_EMAIL,
}));
