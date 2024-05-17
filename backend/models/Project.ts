import mongoose, { Document, Types } from 'mongoose';

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
    devices: string[];
};

const projectSchema = new mongoose.Schema({
    projectId: { type: String, required: true},
    projectName: { type: String, required: true},
    projectDescription: { type: String, default: "No Description"},
    ownerId: { type: String, required: true},
    fitbitUserId: { type: String, required: false },
    fitbitAccessToken: { type: String, required: false },
    fitbitRefreshToken: { type: String, required: false },
    lastTokenRefresh: { type: Date, default: null },
    creationDate: { type: Date, default: Date.now},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    devices: [{ type: String }]
}, { timestamps: true});

const projectModel = mongoose.model<IProject>('Projects', projectSchema);

export default projectModel;
