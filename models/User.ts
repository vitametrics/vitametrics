import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    userId: string;
    email: string;
    password: string;
    fitbitAccessToken: string;
    fitbitRefreshToken: string;
    languageLocale: string;
    distanceUnit: string;
};

const userSchema = new mongoose.Schema({
    userId: String,
    email: String,
    password: String,
    fitbitAccessToken: String,
    languageLocale: String,
    distanceUnit: String
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;