import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    userId: string;
    email: string;
    password: string;
    languageLocale: string;
    distanceUnit: string;
    orgId: string;
};

const userSchema = new mongoose.Schema({
    userId: String,
    email: String,
    password: String,
    languageLocale: String,
    distanceUnit: String,
    orgId: String
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;