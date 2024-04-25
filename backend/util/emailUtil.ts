import sgMail from '@sendgrid/mail';

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
    } catch (error: any) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
};