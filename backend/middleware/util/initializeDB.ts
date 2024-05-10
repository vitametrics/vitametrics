import User from '../../models/User';
import Setting from "../../models/Setting";
import crypto from 'crypto';
import { sendEmail } from './emailUtil';

async function initializeDatabase() {

    console.log('initializing DB');

    try {
        const isInitialized = await Setting.findOne({ type: 'initialized'});
        if (!isInitialized === true && process.env.ADMIN_EMAIL && process.env.NODE_ENV === 'production') {
            const newUserId = crypto.randomBytes(16).toString('hex');
            const newOrgId = crypto.randomBytes(16).toString('hex');
            const passwordToken = crypto.randomBytes(32).toString('hex');

            const newUser = new User({
                userId: newUserId,
                email: process.env.ADMIN_EMAIL,
                role: "owner",
                emailVerfToken: crypto.randomBytes(32).toString('hex'),
                emailVerified: false,
                orgId: newOrgId,
                setPasswordToken: passwordToken,
                languageLocale: 'en-US',
                distanceUnit: 'en-US'
            });

            await newUser.save();

            await sendEmail({
                to: process.env.ADMIN_EMAIL as string,
                subject: 'Your New Account',
                text: `An account has been created for you. Please login using this link: ${process.env.BASE_URL}/set-password?token=${passwordToken}`
            });

            await Setting.create({ type: 'initialized', value: true});

            console.log("Default user has been created");
        } else {
            console.log("Database already initialized");
        }
    } catch (err) {
        console.error("Failed to initialized DB: ", err);
    }
}

export default initializeDatabase;