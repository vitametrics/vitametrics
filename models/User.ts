import mongoose, { Schema, Document } from 'mongoose';

// TODO: Define the user interface
interface IUser extends Document {
    userId: string;
    apiKey: string;
    heart_rate: Array<number>;
    accellerometer: Array<number>;
    // TODO: add data fields
}

// User schema
const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    apiKey: { type: String, required: true },
    heart_rate: { type: Schema.Types.Array, required: true},
    accellerometer: {type: Schema.Types.Array, required: true}
    // TODO: add data fields
});

export default mongoose.model<IUser>('User', UserSchema);
