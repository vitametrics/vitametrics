import sgMail from '@sendgrid/mail';
import logger from '../logger';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const msg = {
    to: options.to,
    from: process.env.SENDGRID_FROM as string,
    subject: options.subject,
    text: options.text,
    html: options.html || options.text,
  };

  try {
    await sgMail.send(msg);
    logger.info('Email sent');
  } catch (error: any) {
    logger.error(`[emailUtil] Error sending email: ${error}`)
    if (error.response) {
      logger.error(error.response.body);
      console.error(error.response.body);
    }
  }
};
