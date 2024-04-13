import mongoose, { Document } from 'mongoose';

export interface IDevice extends Document {
    ownerName: string;
    deviceName: string;
    deviceId: string;
}

const deviceSchema = new mongoose.Schema({
    ownerName: { type: String, default: ""},
    deviceName: {type: String, default: ""},
    deviceId: { type: String, default: ""}
});

const deviceModel = mongoose.model<IDevice>('Devices', deviceSchema);

export default deviceModel;