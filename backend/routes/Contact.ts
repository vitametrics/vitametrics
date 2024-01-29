import express, {Request, Response} from 'express';
import rateLimit from 'express-rate-limit';
import sgMail from '@sendgrid/mail';
import validator from 'validator';



sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const router = express.Router();

const contactRateLimit= rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 10 // limit each IP to 10 requests per windowMs
  });

router.post('/', contactRateLimit, async(req: Request, res: Response) => {
    const {email, organizationName, msgBody} = req.body;

    console.log('email: ', email, '\norgName: ', organizationName, '\nmsgBody: ', msgBody);

    if (!email || !organizationName || !msgBody) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ msg: 'Invalid email format' }); 
    }

    // arbitrary length check
    if (organizationName.length > 100 || msgBody.length > 1000) {
        return res.status(400).json({ msg: 'Invalid input length' });
    }

    const sanitizedEmail = validator.escape(email);
    const sanitizedOrgName = validator.escape(organizationName);
   


    const msg = {
        to: process.env.ADMIN_EMAIL as string,
        from: process.env.SENDGRID_FROM as string,
        subject: `New Contact Message from ${sanitizedOrgName}`,
        /*text: `Message from ${sanitizedEmail}: ${msgBody}`,*/
        text: `Message from ${sanitizedEmail}: \n`,
        html: msgBody, //test this
    };

    try {
        await sgMail.send(msg);
        return res.status(200).json({ msg: 'Message sent successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Error sending message' });
    }
});

export default router;