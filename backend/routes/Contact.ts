import express, {Request, Response} from 'express';
import rateLimit from 'express-rate-limit';
import {body, validationResult } from 'express-validator';
import { sendEmail } from '../util/emailUtil';

const router = express.Router();

const contactRateLimit= rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 10 // limit each IP to 10 requests per windowMs
  });

router.post('/', contactRateLimit, [
    body('email').isEmail().withMessage('Invalid email format'),
    body('organizationName').isLength({max: 100}).withMessage('Organization name is too long'),
    body('msgBody').isLength({max: 1000}).withMessage('Message body is too long')

], async(req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, organizationName, msgBody} = req.body;

    try {
        await sendEmail({
            to: process.env.ADMIN_EMAIL as string,
            subject: `New Contact Message from ${organizationName}`,
            text: `Message from ${email}: \n`,
            html: msgBody, //test this
        })
        return res.status(200).json({ msg: 'Message sent successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Error sending message' });
    }
});

export default router;