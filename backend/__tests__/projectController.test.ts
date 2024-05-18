import { Request, Response } from 'express';

import mongoose from 'mongoose';

import {
  getProjectInfo,
  removeMember,
  fetchDevicesHandler,
  fetchIntradayDataHandler,
  fetchDataHandler,
  downloadDataHandler,
} from '../controllers/ProjectController';
import fetchData from '../middleware/util/fetchData';
import fetchDevices from '../middleware/util/fetchDevices';
import fetchIntradayData from '../middleware/util/fetchIntraday';
import Project, { IProject } from '../models/Project';
import User, { IUser } from '../models/User';

jest.mock('../models/Project');
jest.mock('../models/User');
jest.mock('../middleware/util/fetchDevices');
jest.mock('../middleware/util/fetchIntraday');
jest.mock('../middleware/util/fetchData');

interface CustomRequest extends Request {
  user?: IUser;
  project?: IProject;
}

describe('ProjectController', () => {
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;

  beforeAll(() => {
    console.error = jest.fn();
  });

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
      set: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('getProjectInfo', () => {
    it('should return project info if project is found', async () => {
      const mockProject = {
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

      (Project.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockProject),
          }),
        }),
      });

      req.query = { projectId: '123' };

      await getProjectInfo(req as Request, res as Response);

      expect(Project.findOne).toHaveBeenCalledWith({ projectId: '123' });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        project: {
          _id: mockProject._id,
          projectId: '123',
          projectName: 'Test Project',
          projectDescription: 'Description of Test Project',
          ownerId: 'owner123',
          ownerName: 'Owner Name',
          ownerEmail: 'owner@example.com',
          fitbitUserId: 'user123',
          fitbitAccessToken: 'token123',
          fitbitRefreshToken: 'refreshToken123',
          lastTokenRefresh: mockProject.lastTokenRefresh,
          members: [],
          devices: [],
        },
        members: [],
      });
    });

    it('should return 404 if project is not found', async () => {
      (Project.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
          }),
        }),
      });

      req.query = { projectId: '123' };

      await getProjectInfo(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found' });
    });

    it('should return 500 if there is a server error', async () => {
      (Project.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockRejectedValue(new Error('Server error')),
          }),
        }),
      });

      req.query = { projectId: '123' };

      await getProjectInfo(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
    });
  });

  describe('removeMember', () => {
    it('should remove a member successfully', async () => {
      const mockProject = {
        _id: new mongoose.Types.ObjectId(),
        ownerId: 'owner123',
        updateOne: jest.fn().mockResolvedValue({}),
      } as unknown as IProject;
      req.project = mockProject;
      req.body = { userId: 'user123' };

      const mockUser = {
        userId: 'user123',
        _id: new mongoose.Types.ObjectId(),
        deleteOne: jest.fn().mockResolvedValue({}),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await removeMember(req as Request, res as Response);

      expect(User.findOne).toHaveBeenCalledWith({ userId: 'user123' });
      expect(mockProject.updateOne).toHaveBeenCalledWith({
        $pull: { members: mockUser._id },
      });
      expect(mockUser.deleteOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Member removed successfully',
      });
    });

    it('should return 404 if user is not found', async () => {
      req.body = { userId: 'user123' };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await removeMember(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: 'User not found' });
    });

    it('should return 400 if trying to remove the owner', async () => {
      const mockProject = {
        _id: new mongoose.Types.ObjectId(),
        ownerId: 'owner123',
      } as unknown as IProject;
      req.project = mockProject;
      req.body = { userId: 'owner123' };

      const mockUser = {
        userId: 'owner123',
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await removeMember(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Cannot remove owner from project',
      });
    });

    it('should return 500 if there is a server error', async () => {
      req.body = { userId: 'user123' };

      (User.findOne as jest.Mock).mockRejectedValue(new Error('Server error'));

      await removeMember(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Internal Server Error' });
    });
  });

  describe('fetchDevicesHandler', () => {
    it('should return devices if the required parameters are provided', async () => {
      const mockDevices = [{ id: 'device1' }];
      (fetchDevices as jest.Mock).mockResolvedValue(mockDevices);

      const mockProject = {
        fitbitUserId: 'user123',
        fitbitAccessToken: 'token123',
        projectId: '123',
      } as unknown as IProject;
      req.project = mockProject;

      await fetchDevicesHandler(req as Request, res as Response);

      expect(fetchDevices).toHaveBeenCalledWith('user123', 'token123', '123');
      expect(res.json).toHaveBeenCalledWith(mockDevices);
    });

    it('should return 400 if required parameters are missing', async () => {
      const mockProject = {
        fitbitUserId: null,
        fitbitAccessToken: null,
      } as unknown as IProject;
      req.project = mockProject;

      await fetchDevicesHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Fitbit account not linked to project',
      });
    });

    it('should return 500 if there is a server error', async () => {
      (fetchDevices as jest.Mock).mockRejectedValue(new Error('Server error'));

      const mockProject = {
        fitbitUserId: 'user123',
        fitbitAccessToken: 'token123',
        projectId: '123',
      } as unknown as IProject;
      req.project = mockProject;

      await fetchDevicesHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Internal Server Error' });
    });
  });

  describe('fetchIntradayDataHandler', () => {
    it('should return intraday data if the required parameters are provided', async () => {
      const mockData = [{ timestamp: '2023-01-01', value: 100 }];
      (fetchIntradayData as jest.Mock).mockResolvedValue(mockData);

      const mockProject = {
        fitbitUserId: 'user123',
        fitbitAccessToken: 'token123',
      } as unknown as IProject;
      req.project = mockProject;
      req.query = {
        dataType: 'steps',
        date: '2023-01-01',
        detailLevel: '1min',
      };

      await fetchIntradayDataHandler(req as Request, res as Response);

      expect(fetchIntradayData).toHaveBeenCalledWith(
        'user123',
        'token123',
        'steps',
        '2023-01-01',
        '1min'
      );
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should return 400 if required parameters are missing', async () => {
      const mockProject = {
        fitbitUserId: null,
        fitbitAccessToken: null,
      } as unknown as IProject;
      req.project = mockProject;
      req.query = {
        dataType: 'steps',
        date: '2023-01-01',
        detailLevel: '1min',
      };

      await fetchIntradayDataHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Fitbit account not linked to project',
      });
    });

    it('should return 500 if there is a server error', async () => {
      (fetchIntradayData as jest.Mock).mockRejectedValue(
        new Error('Server error')
      );

      const mockProject = {
        fitbitUserId: 'user123',
        fitbitAccessToken: 'token123',
      } as unknown as IProject;
      req.project = mockProject;
      req.query = {
        dataType: 'steps',
        date: '2023-01-01',
        detailLevel: '1min',
      };

      await fetchIntradayDataHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Internal Server Error' });
    });
  });

  describe('fetchDataHandler', () => {
    it('should return data if the required parameters are provided', async () => {
      const mockData = [{ date: '2023-01-01', value: 100 }];
      (fetchData as jest.Mock).mockResolvedValue(mockData);

      const mockProject = {
        fitbitUserId: 'user123',
        fitbitAccessToken: 'token123',
      } as unknown as IProject;
      req.project = mockProject;
      req.query = { startDate: '2023-01-01', endDate: '2023-01-31' };

      await fetchDataHandler(req as Request, res as Response);

      expect(fetchData).toHaveBeenCalledWith(
        'user123',
        'token123',
        '2023-01-01',
        '2023-01-31'
      );
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should return 400 if required parameters are missing', async () => {
      const mockProject = {
        fitbitUserId: null,
        fitbitAccessToken: null,
      } as unknown as IProject;
      req.project = mockProject;
      req.query = { startDate: '2023-01-01', endDate: '2023-01-31' };

      await fetchDataHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Fitbit account not linked to project',
      });
    });

    it('should return 500 if there is a server error', async () => {
      (fetchData as jest.Mock).mockRejectedValue(new Error('Server error'));

      const mockProject = {
        fitbitUserId: 'user123',
        fitbitAccessToken: 'token123',
      } as unknown as IProject;
      req.project = mockProject;
      req.query = { startDate: '2023-01-01', endDate: '2023-01-31' };

      await fetchDataHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Internal Server Error' });
    });
  });

  describe('downloadDataHandler', () => {
    it('should return a CSV file if the required parameters are provided', async () => {
      const mockData = [{ timestamp: '2023-01-01T00:00:00Z', value: 100 }];
      (fetchIntradayData as jest.Mock).mockResolvedValue(mockData);

      const mockProject = {
        fitbitUserId: 'user123',
        fitbitAccessToken: 'token123',
      } as unknown as IProject;
      req.project = mockProject;
      req.query = {
        deviceId: 'device1',
        dataType: 'steps',
        date: '2023-01-01',
        detailLevel: '1min',
      };

      await downloadDataHandler(req as Request, res as Response);

      const expectedCSV = '2023-01-01T00:00:00Z,100\n';
      expect(fetchIntradayData).toHaveBeenCalledWith(
        'user123',
        'token123',
        'steps',
        '2023-01-01',
        '1min'
      );
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="device1-2023-01-01-1min.csv"'
      );
      expect(res.set).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(res.send).toHaveBeenCalledWith(expectedCSV);
    });

    it('should return 400 if required parameters are missing', async () => {
      const mockProject = {
        fitbitUserId: null,
        fitbitAccessToken: null,
      } as unknown as IProject;
      req.project = mockProject;
      req.query = {
        deviceId: 'device1',
        dataType: 'steps',
        date: '2023-01-01',
        detailLevel: '1min',
      };

      await downloadDataHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Fitbit account not linked to project',
      });
    });

    it('should return 500 if there is a server error', async () => {
      (fetchIntradayData as jest.Mock).mockRejectedValue(
        new Error('Server error')
      );

      const mockProject = {
        fitbitUserId: 'user123',
        fitbitAccessToken: 'token123',
      } as unknown as IProject;
      req.project = mockProject;
      req.query = {
        deviceId: 'device1',
        dataType: 'steps',
        date: '2023-01-01',
        detailLevel: '1min',
      };

      await downloadDataHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Internal Server Error' });
    });
  });
});
