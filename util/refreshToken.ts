import axios from 'axios';
import User from '../models/User';

async function refreshToken(userId: string) {
    const user = await User.findOne({userId});
    const refreshToken = user?.fitbitRefreshToken;

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken as string);

    try {
        const response = await axios.post('https://api.fitbit.com/oauth2/token', params, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        await User.findOneAndUpdate(   
            {userId},
            {
                fitbitAccessToken: newAccessToken, 
                fitbitRefreshToken: newRefreshToken
            },
            { new: true }
        );

        return newAccessToken;
    } catch (err) {
        console.error("Error refreshing access token: ", err);
        throw err;
    }

}

export default refreshToken;