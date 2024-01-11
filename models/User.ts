import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
    userId: string;
    fitbitAccessToken: string;
    heart_rate: Array<number>;
};

const userSchema = new mongoose.Schema({
    userId: String,
    fitbitAccessToken: String,
    heart_rate: Array<number>
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;