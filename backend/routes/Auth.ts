import express, { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import CodeVerifier from '../models/CodeVerifier';
import Organization from '../models/Organization';
import { IUser } from '../models/User';
import verifySession from '../middleware/verifySession';
import fetchAndStoreDevices from '../util/fetchDevices';

const router = express.Router();

router.get('/auth', async (_req: Request, res: Response) => {
    const codeVerifier = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(codeVerifier).digest('base64');
    const codeChallenge = hash.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    try {
        await new CodeVerifier({ value: codeVerifier}).save();

        const authUrl = `https://www.fitbit.com/oauth2/authorize?client_id=${process.env.FITBIT_CLIENT_ID}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=activity%20heartrate%20location%20nutrition%20oxygen_saturation%20respiratory_rate%20settings%20sleep%20social%20temperature%20weight%20profile&redirect_uri=${process.env.REDIRECT_URI}`;

        res.redirect(authUrl);
    } catch(err) {
        res.status(500).send('Internal Server Error');
    }

});

router.get('/callback', verifySession, async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const userId = (req.user as IUser).userId;

    try {
        const verifier = await CodeVerifier.findOne().sort({createdAt: -1}).limit(1);
        const codeVerifier = verifier?.value;
        // cleanup verifier from db
        await CodeVerifier.findOneAndDelete(verifier?._id);

        const params = new URLSearchParams();
        params.append('client_id', process.env.FITBIT_CLIENT_ID as string);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', process.env.REDIRECT_URI as string);
        params.append('code_verifier', codeVerifier as string);

        const tokenResponse = await axios.post('https://api.fitbit.com/oauth2/token', params, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        const profileResponse = await axios.get('https://api.fitbit.com/1/user/-/profile.json', {
            headers: {'Authorization': `Bearer ${accessToken}`}    
        });

        const fitbitUserID = profileResponse.data.user.encodedId;

        const refreshToken = tokenResponse.data.refresh_token;

        const organization = await Organization.findOne({ ownerId: userId });

        if (!organization) {
            console.error('Organization not found');
            return res.status(404).send('Organization not found');
        }

        organization.userId = fitbitUserID;
        organization.fitbitAccessToken = accessToken;
        organization.fitbitRefreshToken = refreshToken;

        await organization.save();

        const orgId = organization.ownerId;

        await fetchAndStoreDevices(fitbitUserID, accessToken, orgId);
        // this should not handle redirects. fine for now i guess.
	    return res.redirect('/dashboard?view=data');
    } catch(err) {
        console.error(err);
        res.status(500).json({success: false, msg: 'Internal Server Error'});
    }

    return;

});

export default router;
