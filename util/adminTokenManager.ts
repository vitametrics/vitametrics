import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin';

const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
}

const storeToken = async (token: string) => {
    const salt = await bcrypt.genSalt(10);
    const tokenHash = await bcrypt.hash(token, salt);
    
    const existingToken = await Admin.findOne();
    if (existingToken) {
        existingToken.tokenHash = tokenHash;
        await existingToken.save();
    } else {
        await new Admin({tokenHash}).save();
    }
}

const regenerateToken = () => {
    const token = generateToken();
    storeToken(token);
    console.log(`New Admin Token: ${token}`);
};

setInterval(regenerateToken, 1000 * 60 * 60 * 4);

export { regenerateToken, storeToken, generateToken};