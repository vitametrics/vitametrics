import User from '../models/User';
import Organization from '../models/Organization';
import Setting from "../models/Setting";
import crypto from 'crypto';
import argon2 from 'argon2';
import { sendEmail } from './emailUtil';

async function initializeDatabase() {
    try {
        const isInitialized = await Setting.findOne({ type: 'initialized'});
        if (!isInitialized && process.env.ADMIN_EMAIL && process.env.NODE_ENV === 'production') {
            const newUserId = crypto.randomBytes(16).toString('hex');
            const newOrgId = crypto.randomBytes(16).toString('hex');
            const tempPassword = crypto.randomBytes(16).toString('hex');

            const newUser = new User({
                userId: newUserId,
                email: process.env.ADMIN_EMAIL,
                password: await argon2.hash(tempPassword),
                emailVerfToken: crypto.randomBytes(32).toString('hex'),
                emailVerified: false,
                orgId: newOrgId,
                languageLocale: 'en-US',
                distanceUnit: 'en-US'
            });

            await newUser.save();

            const newOrganization = new Organization({
                orgId: newOrgId,
                orgName: "Admin Organization",
                ownerId: newUserId,
                ownerName: "Admin",
                ownerEmail: process.env.ADMIN_EMAIL,
                members: [newUser._id]
            });

            await newOrganization.save();

            await sendEmail({
                to: process.env.ADMIN_EMAIL as string,
                subject: 'Your New Organization Account',
                text: `Username: ${newUser.email}\nPassword: ${tempPassword}`
            });

            await Setting.create({ type: 'initialized', value: true});

            console.log("Default organization and admin user have been created");
        } else {
            console.log("Database already initialized");
        }
    } catch (err) {
        console.error("Failed to initialized DB: ", err);
    }
}

export default initializeDatabase;