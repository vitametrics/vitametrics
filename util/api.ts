import User from '../models/User';

async function generateUniqueApiKey(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    while (true) {
        // Generate a random API key
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Check if the generated key exists in the database
        const existingKey = await User.findOne({ apiKey: result });

        // If the key does not exist, break the loop
        if (!existingKey) break;

        // If the key exists, clear the result and generate a new key in the next iteration
        result = '';
    }

    return result;
}

export default generateUniqueApiKey;