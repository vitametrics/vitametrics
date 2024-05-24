import mongoose, { Document, Types } from 'mongoose';

import { IUser } from './User';

export interface IProject extends Document {
  projectId: string;
  projectName: string;
  projectDescription: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  fitbitUserId: string;
  fitbitAccessToken: string;
  fitbitRefreshToken: string;
  lastTokenRefresh: Date;
  members: Types.ObjectId[];
  admins: (Types.ObjectId | IUser)[];
  devices: Types.ObjectId[];
}

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true },
    projectName: { type: String, required: true },
    projectDescription: { type: String, default: 'No Description' },
    ownerId: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    fitbitUserId: { type: String, required: false },
    fitbitAccessToken: { type: String, required: false },
    fitbitRefreshToken: { type: String, required: false },
    lastTokenRefresh: { type: Date },
    creationDate: { type: Date, default: Date.now },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Devices' }],
  },
  { timestamps: true }
);

const projectModel = mongoose.model<IProject>('Projects', projectSchema);

export default projectModel;
