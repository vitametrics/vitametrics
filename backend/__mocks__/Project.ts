import { IProject } from '../models/Project';
import mongoose from 'mongoose';

const mockProject: Partial<IProject> = {
    _id: new mongoose.Types.ObjectId(),
    projectId: '123',
    projectName: 'Test Project',
    projectDescription: 'Description of Test Project',
    ownerId: 'owner123',
    ownerName: 'Owner Name',
    ownerEmail: 'owner@example.com',
    fitbitUserId: 'user123',
    fitbitAccessToken: 'token123',
    fitbitRefreshToken: 'refreshToken123',
    lastTokenRefresh: new Date(),
    members: [],
    devices: [],
};

const Project = {
    findOne: jest.fn().mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProject),
    })),
};

export default Project;
