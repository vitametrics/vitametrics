import mongoose, { Document, Schema } from 'mongoose';

export interface ICache extends Document {
  key: string;
  projectId: string;
  deviceId: string;
  data: string;
  createdAt: Date;
}

const cacheSchema = new Schema({
  key: { type: String, required: true, unique: true },
  projectId: { type: String, required: true },
  deviceId: { type: String, required: true },
  data: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Cache = mongoose.model<ICache>('Cache', cacheSchema);

export default Cache;
