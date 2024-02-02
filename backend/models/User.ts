import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    userId: string;
    email: string;
    password: string;
    emailVerfToken: string;
    emailVerified: boolean;
    orgId: string;
    languageLocale: string;
    distanceUnit: string;
};

const userSchema = new mongoose.Schema({
    userId: {type: String, default: ""},
    email: {type: String, default: ""},
    password: {type: String, default: ""},
    emailVerfToken: {type: String, default: ""},
    emailVerified: {type: Boolean, default: false},
    orgId: {type: String, default: ""},
    languageLocale: {type: String, default: 'en-US'},
    distanceUnit: {type: String, default: 'en-US'}
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;