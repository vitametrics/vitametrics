import express, { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import CodeVerifier from '../models/CodeVerifier';
import User from '../models/User';
import fetchAndStoreData from '../util/fetchData';

const router = express.Router();

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Initiates OAuth2 authentication with Fitbit
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to the Fitbit OAuth2 authorization page.
 *       500:
 *         description: Internal Server Error
 */

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

/**
 * @swagger
 * /callback:
 *   get:
 *     summary: Callback endpoint for Fitbit OAuth2 response
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code provided by Fitbit
 *     responses:
 *       200:
 *         description: User data processed successfully, redirected to login.
 *       500:
 *         description: Internal Server Error
 */

router.get('/callback', async (req: Request, res: Response) => {
    const code = req.query.code as string;
    
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

        await User.findOneAndUpdate(
            {userId: fitbitUserID},
            {
                userId: fitbitUserID,
                email: '',
                password: '',
                fitbitAccessToken: accessToken,
                fitbitRefreshToken: refreshToken,
                fullName: profileResponse.data.user.fullName,
                age: profileResponse.data.user.age,
                languageLocale: profileResponse.data.user.languageLocale,
                distanceUnit: profileResponse.data.user.distanceUnit,
                heart_rate: [],
                location: [],
                nutrition: [],
                oxygen_saturation: [],
                respiratory_rate: [],
                temperature: [],
                weight: []
            },
            {upsert: true, new: true}
        );

        await fetchAndStoreData(fitbitUserID, accessToken);

	res.redirect('/login');
        //res.send(`User ${fitbitUserID} saved/updated with access token: ${accessToken}.`);
    } catch(err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }

});

export default router;