import { Request, Response, NextFunction } from 'express';

import logger from './logger';
import Project, { IProject } from '../models/Project';
import User, { IUser } from '../models/User';

const checkProjectMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = req.user as IUser;

  if (!currentUser) {
    logger.error('[checkProjectMembership] User not logged in');
    res.status(401).json({ msg: 'Unauthorized - User not logged in' });
    return;
  }

  const userId = currentUser.userId;

  try {
    logger.info('[checkProjectMembership] Checking project membership');

    const user = await User.findOne({ userId: userId }).populate('projects');

    if (!user) {
      logger.error('[checkProjectMembership] User not found');
      res.status(404).json({ msg: 'User not found' });
      return;
    }

    const projectId =
      req.body.projectId || req.query.projectId || req.cookies.projectId;

    if (currentUser.role === 'siteOwner' || currentUser.role === 'siteAdmin') {
      const project = await Project.findOne({ projectId });
      if (!project) {
        logger.error(
          `[checkProjectMembership] Project not found: ${projectId}`
        );
        res.status(404).json({ msg: 'Project not found' });
        return;
      }
      logger.info('[checkProjectMembership] Site owner/admin access granted');
      req.project = project as IProject;
      return next();
    }

    if (!user.projects.length && user.role !== 'siteOwner') {
      res
        .status(403)
        .json({ msg: `Access denied - User not a member of any project` });
      return;
    }

    const projectIds = user.projects.map((project) => project._id);
    const matchingProject = await Project.findOne({
      projectId: projectId,
      _id: { $in: projectIds },
    });

    if (!matchingProject) {
      logger.error(
        '[checkProjectMembership] Access denied - User not a member of the project'
      );
      res
        .status(403)
        .json({ msg: `Access denied - User not a member of the project` });
      return;
    } else {
      logger.info('[checkProjectMembership] Project membership verified');
      req.project = matchingProject as IProject;

      return next();
    }
  } catch (error) {
    logger.error(
      `[checkProjectMembership] Error checking project membership: ${error}`
    );
    res.status(500).json({ msg: 'Internal Server Error' });
    return;
  }
};

export default checkProjectMembership;
