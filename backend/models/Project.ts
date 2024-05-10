import mongoose, { Document, Types } from 'mongoose';

export interface IProject extends Document {
    projectId: string;
    projectName: string;
    ownerId: string;
    ownerName: string;
    ownerEmail: string;
    fibitUserId: string;
    fitbitAccessToken: string;
    fitbitRefreshToken: string;
    lastTokenRefresh: Date;
    inviteCode: Types.ObjectId[];
    members: Types.ObjectId[];
    devices: string[];
};

const projectSchema = new mongoose.Schema({
    projectId: {type: String, default: ""},
    projectName: {type: String, default: ""},
    fitbitUserId: {type: String, default: ""}, // fitbit user id
    ownerId: {type: String, default: ""},
    ownerName: {type: String, default: ""},
    ownerEmail: {type: String, default: ""},
    fitbitAccessToken: {type: String, default: ""},
    fitbitRefreshToken: {type: String, default: ""},
    lastTokenRefresh: { type: Date, default: null},
    creationDate: { type: Date, default: Date.now },
    inviteCode: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invite' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    devices: [{ type: String}]
});

const projectModel = mongoose.model<IProject>('Organizations', projectSchema);

export default projectModel;
