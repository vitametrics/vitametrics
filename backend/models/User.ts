import mongoose, { Document, Types } from 'mongoose';

export interface IUser extends Document {
    userId: string;
    email: string;
    name: string;
    password: string;
    role: string;
    emailVerfToken: string;
    emailVerified: boolean;
    projects: Types.ObjectId[];
    languageLocale: string;
    distanceUnit: string;
    setPasswordToken: string | null;
    passwordTokenExpiry: Date | null;
    lastInviteSent: Date | null;
};

const userSchema = new mongoose.Schema({
    userId: {type: String, default: ""},
    name: {type: String, default: ""},
    email: {type: String, default: ""},
    password: {type: String, default: ""},
    role: {type: String, default: "user"},
    emailVerfToken: {type: String, default: ""},
    emailVerified: {type: Boolean, default: false},
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' }],
    languageLocale: {type: String, default: 'en-US'},
    distanceUnit: {type: String, default: 'en-US'},
    setPasswordToken: {type: String, default: ""},
    passwordTokenExpiry: {type: Date, default: null},
    lastInviteSent: {type: Date, default: null}
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;