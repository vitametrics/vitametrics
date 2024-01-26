import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

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
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
};