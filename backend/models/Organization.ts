import mongoose, { Document, Types } from 'mongoose';

export interface IOrganization extends Document {
    orgId: string;
    orgName: string;
    ownerId: string;
    ownerName: string;
    ownerEmail: string;
    userId: string;
    fitbitAccessToken: string;
    fitbitRefreshToken: string;
    inviteCode: Types.ObjectId[];
    members: Types.ObjectId[];
    devices: Types.ObjectId[];
};

const organizationSchema = new mongoose.Schema({
    orgId: String,
    orgName: String,
    userId: String, // fitbit user id
    ownerId: String,
    ownerName: String,
    ownerEmail: String,
    fitbitAccessToken: String,
    fitbitRefreshToken: String,
    inviteCode: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invite' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }]
});

const orgSchema = mongoose.model<IOrganization>('Organizations', organizationSchema);

export default orgSchema;