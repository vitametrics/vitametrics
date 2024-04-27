import mongoose, { Document } from 'mongoose';

export interface IDevice extends Document {
    deviceName: string;
    deviceId: string;
    orgId: string;
}

const deviceSchema = new mongoose.Schema({
    deviceName: {type: String, default: ""},
    deviceId: { type: String, default: ""},
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }
});

const deviceModel = mongoose.model<IDevice>('Devices', deviceSchema);

export default deviceModel;