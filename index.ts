import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import CodeVerifier from './models/CodeVerifier';
import User from './models/User';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_URI as string)
    .then(() => console.log('Connected to database'))
    .catch((err) => console.error('Could not connect to the database', err));


app.get('/auth', async (_req: Request, res: Response) => {
    const codeVerifier = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(codeVerifier).digest('base64');
    const codeChallenge = hash.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    try {
        await new CodeVerifier({ value: codeVerifier}).save();

        const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&scope=activity%20nutrition%20heartrate%20profile%20sleep&redirect_uri=${process.env.REDIRECT_URI}&code_challenge=${codeChallenge}&code_challenge_method=S256`;


        res.redirect(authUrl);
    } catch(err) {
        res.status(500).send('Internal Server Error');
    }

});

app.get('/callback', async (req: Request, res: Response) => {
    const code = req.query.code as string;
    
    try {
        const verifier = await CodeVerifier.findOne().sort({createdAt: -1}).limit(1);
        const codeVerifier = verifier?.value;

        const tokenResponse = await axios.post('https://api.fitbit.com/oauth2/token', {
            clientId: process.env.FITBIT_CLIENT_ID,
            grantType: 'authorization_code',
            code: code,
            redirectUri: process.env.REDIRECT_URI,
            codeVerifier: codeVerifier,
        }, {
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

        await User.findOneAndUpdate({userId: fitbitUserID});

        res.send(`User ${fitbitUserID} saved/updated with access token: ${accessToken}.`);
    } catch(err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }

});

app.listen(3000, () => {
    console.log('Listening on port 3000');
})