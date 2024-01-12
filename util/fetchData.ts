import axios from 'axios';
import User  from '../models/User';


async function fetchAndStoreData(userId: String, accessToken: String) {
    try {
        const heartRateResponse = await axios.get(`https://api.fitbit.com/1/user/${userId}/activities.json`, {
            headers: {'Authorization': `Bearer ${accessToken}`}
        });

        const nutritionResponse = await axios.get(`https://api.fitbit.com/1/user/${userId}/foods/log/date/today.json`, {
            headers: {'Authorization': `Bearer ${accessToken}`}
        });

        const weightResponse = await axios.get(`https://api.fitbit.com/1/user/${userId}/body/log/weight/date/today.json`, {
            headers: {'Authorization': `Bearer ${accessToken}`}
        });

        await User.findOneAndUpdate(
            {userId},
            { 
                heart_rate: heartRateResponse.data,
                nutrition: nutritionResponse.data,
                weight: weightResponse.data,
            },
            {new: true}
        )
    } catch (err) {
        console.error("Error fetching heart rate data: ", err);
    }
}

export default fetchAndStoreData;