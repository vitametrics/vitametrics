import mongoose, { Document, Types } from 'mongoose';

import { IUser } from './User';

export interface IProject extends Document {
  projectId: string;
  projectName: string;
  projectDescription: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  areNotificationsEnabled: boolean;
  members: Types.ObjectId[];
  admins: (Types.ObjectId | IUser)[];
  devices: Types.ObjectId[];
  fitbitAccounts: mongoose.Types.ObjectId[];
  isMember(userId: Types.ObjectId): boolean;
  isAdmin(userId: Types.ObjectId): boolean;
  isOwner(userId: string): boolean;
  hasDevice(deviceId: Types.ObjectId): boolean;
  removeDevice(deviceId: Types.ObjectId): Promise<void>;
  unlinkFitbitAccount(fitbitUserId: Types.ObjectId): Promise<void>;
  addMember(userId: Types.ObjectId, role: string): Promise<void>;
  addFitbitAccount(account: Types.ObjectId): Promise<void>;
}

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true },
    projectName: { type: String, required: true },
    projectDescription: { type: String, default: 'No Description' },
    ownerId: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    areNotificationsEnabled: { type: Boolean, default: true },
    creationDate: { type: Date, default: Date.now },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Devices' }],
    fitbitAccounts: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'FitbitAccount' },
    ],
  },
  { timestamps: true }
);

projectSchema.methods.isMember = function (
  this: IProject,
  userId: Types.ObjectId
): boolean {
  return this.members.some((member) => member._id.equals(userId));
};

projectSchema.methods.isAdmin = function (
  this: IProject,
  userId: Types.ObjectId
): boolean {
  return this.admins.some((admin) =>
    (admin._id as Types.ObjectId).equals(userId)
  );
};

projectSchema.methods.isOwner = function (
  this: IProject,
  userId: string
): boolean {
  return this.ownerId === userId;
};

projectSchema.methods.hasDevice = function (
  this: IProject,
  device_id: Types.ObjectId
): boolean {
  return this.devices.some((device) => device.equals(device_id));
};

projectSchema.methods.removeDevice = async function (
  this: IProject,
  device_id: Types.ObjectId
): Promise<void> {
  this.devices = this.devices.filter((device) => !device.equals(device_id));
  await this.save();
};

projectSchema.methods.unlinkFitbitAccount = async function (
  this: IProject,
  fitbitAccount_id: Types.ObjectId
): Promise<void> {
  this.fitbitAccounts = this.fitbitAccounts.filter(
    (accountId) => !accountId.equals(fitbitAccount_id)
  );
  await this.save();
};

projectSchema.methods.addFitbitAccount = async function (
  this: IProject,
  account_id: Types.ObjectId
): Promise<void> {
  if (!this.fitbitAccounts.some((id) => id.equals(account_id))) {
    this.fitbitAccounts.push(account_id);
    await this.save();
  }
};

projectSchema.methods.deviceCount = function (this: IProject) {
  return this.devices.length;
};

projectSchema.methods.memberCount = function (this: IProject) {
  return this.members.length;
};

projectSchema.methods.addMember = async function (
  this: IProject,
  user_id: Types.ObjectId,
  role: string
): Promise<void> {
  this.members.push(user_id);
  if (role === 'admin') {
    this.admins.push(user_id);
  }
  await this.save();
};

const projectModel = mongoose.model<IProject>('Projects', projectSchema);

export default projectModel;
