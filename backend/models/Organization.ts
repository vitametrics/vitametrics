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
    orgId: {type: String, default: ""},
    orgName: {type: String, default: ""},
    userId: {type: String, default: ""},
    ownerId: {type: String, default: ""},
    ownerName: {type: String, default: ""},
    ownerEmail: {type: String, default: ""},
    fitbitAccessToken: {type: String, default: ""},
    fitbitRefreshToken: {type: String, default: ""},
    inviteCode: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invite' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }]
});

const orgSchema = mongoose.model<IOrganization>('Organizations', organizationSchema);

export default orgSchema;