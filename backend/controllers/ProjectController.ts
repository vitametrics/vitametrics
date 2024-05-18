import { Request, Response } from 'express';

import fetchData from '../middleware/util/fetchData';
import fetchDevices from '../middleware/util/fetchDevices';
import fetchIntradayData from '../middleware/util/fetchIntraday';
import Project, { IProject } from '../models/Project';
import User from '../models/User';

export async function getProjectInfo(req: Request, res: Response) {
  try {
    const project = await Project.findOne({
      projectId: req.query.projectId as string,
    })
      .select(
        '-fitbitUserId -fitbitAccessToken -fitbitRefreshToken -lastTokenRefresh'
      )
      .populate('members', 'userId email name role emailVerified')
      .populate('devices', 'deviceId deviceName deviceVersion');

    //console.log(project);

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.cookie('projectId', project.projectId);
    res.json({ project, members: project.members });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
}

export async function removeMember(req: Request, res: Response) {
  const { userId } = req.body;
  const project = req.project as IProject;
  try {
    const userToRemove = await User.findOne({ userId });
    if (!userToRemove) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }

    if (project.ownerId === userToRemove.userId) {
      res.status(400).json({ msg: 'Cannot remove owner from project' });
      return;
    }

    await project.updateOne({ $pull: { members: userToRemove._id } });
    await userToRemove.deleteOne();
    res.status(200).json({ message: 'Member removed successfully' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function fetchDevicesHandler(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  try {
    if (!currentProject.fitbitUserId || !currentProject.fitbitAccessToken) {
      res.status(400).json({ message: 'Fitbit account not linked to project' });
      return;
    }
    const devices = await fetchDevices(
      currentProject.fitbitUserId,
      currentProject.fitbitAccessToken,
      currentProject.projectId
    );
    res.json(devices);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function fetchIntradayDataHandler(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  try {
    const { dataType, date, detailLevel } = req.query;
    if (!currentProject.fitbitUserId || !currentProject.fitbitAccessToken) {
      res.status(400).json({ message: 'Fitbit account not linked to project' });
      return;
    }
    const data = await fetchIntradayData(
      currentProject.fitbitUserId,
      currentProject.fitbitAccessToken,
      dataType as string,
      date as string,
      detailLevel as string
    );
    res.json(data);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function fetchDataHandler(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  const { startDate, endDate } = req.query;
  try {
    if (!currentProject.fitbitUserId || !currentProject.fitbitAccessToken) {
      res.status(400).json({ message: 'Fitbit account not linked to project' });
      return;
    }
    const data = await fetchData(
      currentProject.fitbitUserId,
      currentProject.fitbitAccessToken,
      startDate as string,
      endDate as string
    );
    res.json(data);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
}

export async function downloadDataHandler(req: Request, res: Response) {
  const currentProject = req.project as IProject;
  const { deviceId, dataType, date, detailLevel } = req.query;
  try {
    if (!currentProject.fitbitUserId || !currentProject.fitbitAccessToken) {
      res.status(400).json({ message: 'Fitbit account not linked to project' });
      return;
    }
    const data = await fetchIntradayData(
      currentProject.fitbitUserId,
      currentProject.fitbitAccessToken,
      dataType as string,
      date as string,
      detailLevel as string
    );
    const csv = data.map((d) => `${d.timestamp},${d.value}`).join('\n') + '\n';
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${deviceId}-${date}-${detailLevel}.csv"`
    );
    res.set('Content-Type', 'text/csv');
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
}
