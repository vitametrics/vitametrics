import { NextFunction, Request, Response} from 'express';
import Project, { IProject } from '../models/Project';
import User from '../models/User';
import fetchDevices from '../middleware/util/fetchDevices';
import fetchIntradayData from '../middleware/util/fetchIntraday';
import fetchData from '../middleware/util/fetchData';

export async function getProjectInfo(req: Request, res: Response) {
    const project = await Project.findOne({ projectId: req.query.projectId as string}).populate('members');
    if (!project) {
        throw { status: 404, message: 'Project not found'};
    }
    res.json({ project, members: project.members});
    return;
}

export async function removeMember(req: Request, res: Response) {
    const { userId } = req.body;
    const project = req.project as IProject;
    try {
        const userToRemove = await User.findOne({ userId });
        if (!userToRemove) {
            throw { status: 404, message: 'User not found'};
            return;
        }

        if (project.ownerId === userToRemove.userId) {
            throw { status: 400, message: 'Cannot remove owner from project'};
            return;
        }

        await project.updateOne({ $pull: { members: userToRemove._id}});
        await userToRemove.deleteOne();
        res.status(200).json({ message: 'Member removed successfully'});
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error'});
        return;
    }
}

export async function fetchDevicesHandler(req: Request, res: Response) {
    const currentProject = req.project as IProject;

    try {

        if (!currentProject.fibitUserId || !currentProject.fitbitAccessToken) {
            res.status(400).json({ message: 'Missing required parameters'});
            return;
        }
        const devices = await fetchDevices(currentProject.fibitUserId, currentProject.fitbitAccessToken, currentProject.projectId);
        res.json(devices);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error'});
        return;
    }
}

export async function fetchIntradayDataHandler(req: Request, res: Response) {
    const currentProject = req.project as IProject;
    try {
        const { dataType, date, detailLevel } = req.query;
        if (!currentProject.fibitUserId || !currentProject.fitbitAccessToken) {
            res.status(400).json({ message: 'Missing required parameters'});
            return;
        }
        const data = await fetchIntradayData(currentProject.fibitUserId, currentProject.fitbitAccessToken, dataType as string, date as string, detailLevel as string);
        res.json(data);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error'});
        return;
    }
}

export async function fetchDataHandler(req: Request, res: Response) {
    const currentProject = req.project as IProject;
    const { startDate, endDate } = req.query;
    try {
        if (!currentProject.fibitUserId || currentProject.fitbitAccessToken) {
            res.status(400).json({ message: 'Missing required parameters'});
            return;
        }
        const data = await fetchData(currentProject.fibitUserId, currentProject.fitbitAccessToken, startDate as string, endDate as string);
        res.json(data);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Internal Server Error'});
        return;
    }
}

export async function downloadDataHandler(req: Request, res: Response) {
    const currentProject = req.project as IProject;
    const { deviceId, dataType, date, detailLevel } = req.query;
    try {
        if (!currentProject.fibitUserId || !currentProject.fitbitAccessToken) {
            res.status(400).json({ message: 'Missing required parameters'});
            return;
        }
        const data = await fetchIntradayData(currentProject.fibitUserId, currentProject.fitbitAccessToken, dataType as string, date as string, detailLevel as string);
        const csv = data.map(d => `${d.timestamp},${d.value}`).join("\n");
        res.setHeader('Content-Disposition', `attachment; filename="${deviceId}-${date}-${detailLevel}.csv"`);
        res.set('Content-Type', 'text/csv');
        res.send(csv);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal Server Error' });
        return;
    }
}