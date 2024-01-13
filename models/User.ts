import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
    userId: string;
    fitbitAccessToken: string;
    fitbitRefreshToken: string;
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
    fitbitAccessToken: String,
    fitbitRefreshToken: String,
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