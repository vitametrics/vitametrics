import mongoose, { Document } from 'mongoose';

export interface IDevice extends Document {
    deviceName: string;
    deviceVersion: string;
    deviceId: string;
}

const deviceSchema = new mongoose.Schema({
    deviceName: {type: String, default: ""},
    deviceVersion: { type: String, default: ""},
    deviceId: { type: String, default: ""}
});

const deviceModel = mongoose.model<IDevice>('Devices', deviceSchema);

export default deviceModel;