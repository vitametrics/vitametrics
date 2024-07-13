import mongoose, { Document } from 'mongoose';

export interface IDevice extends Document {
  owner: string;
  ownerName: string;
  projectId: string;
  fitbitUserId: string;
  deviceName: string;
  deviceVersion: string;
  batteryLevel: string;
  deviceId: string;
  lastSyncTime: string;
}

const deviceSchema = new mongoose.Schema({
  owner: { type: String, required: true },
  ownerName: { type: String, required: true },
  projectId: { type: String, required: true },
  fitbitUserId: { type: String, required: true },
  deviceName: { type: String, default: '' },
  deviceVersion: { type: String, default: '' },
  batteryLevel: { type: String, default: '0%' },
  deviceId: { type: String, default: '' },
  lastSyncTime: { type: String },
});

const deviceModel = mongoose.model<IDevice>('Devices', deviceSchema);

export default deviceModel;
