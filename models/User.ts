import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
    userId: string;
    email: string;
    password: string;
    fitbitAccessToken: string;
    fitbitRefreshToken: string;
    fullName: string;
    age: number;
    languageLocale: string;
    distanceUnit: string;
    heart_rate: Array<number>;
    location: Array<number>;
    nutrition: Array<any>;
    oxygen_saturation: Array<number>;
    respiratory_rate: Array<number>;
    temperature: Array<number>;
    weight: Array<number>;
};

const userSchema = new mongoose.Schema({
    userId: String,
    email: String,
    password: String,
    fitbitAccessToken: String,
    fitbitRefreshToken: String,
    fullName: String,
    age: Number,
    languageLocale: String,
    distanceUnit: String,
    heart_rate: Array,
    location: Array,
    nutrition: Array,
    oxygen_saturation: Array,
    respiratory_rate: Array,
    temperature: Array,
    weight: Array,
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;