import mongoose, { Document } from 'mongoose';

export interface IDevice extends Document {
  deviceName: string;
  deviceVersion: string;
  batteryLevel: string;
  deviceId: string;
  lastSyncTime: string;
}

const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, default: '' },
  deviceVersion: { type: String, default: '' },
  batteryLevel: { type: String, default: '0%' },
  deviceId: { type: String, default: '' },
  lastSyncTime: { type: String },
});

const deviceModel = mongoose.model<IDevice>('Devices', deviceSchema);

export default deviceModel;
