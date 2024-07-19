import { Request, Response, NextFunction } from 'express';

import { Types } from 'mongoose';

import logger from './logger';
import Project, { IProject } from '../models/Project';
import { IUser } from '../models/User';

const verifyRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = req.user as IUser;
      const projectId =
        (req.query.projectId as string) || (req.body.projectId as string);

      if (!currentUser) {
        logger.error('[verifyRole] User not logged in');
        return res
          .status(401)
          .json({ msg: 'Unauthorized - User not logged in' });
      }

      if (
        currentUser.role === 'siteOwner' ||
        currentUser.role === 'siteAdmin'
      ) {
        return next();
      }

      if (!projectId) {
        logger.error('[verifyRole] No projectId provided');
        return res
          .status(400)
          .json({ msg: 'Bad Request - No projectId provided' });
      }

      const currentProject = (await Project.findOne({ projectId })) as IProject;

      if (!currentProject) {
        logger.error('[verifyRole] Project not found');
        return res.status(404).json({ msg: 'Project not found' });
      }

      if (currentProject.ownerId === currentUser.userId) {
        return next();
      }

      const isAdmin = currentProject.admins.includes(
        currentUser._id as Types.ObjectId
      );
      const isMember = currentUser.projects.some((projId) =>
        projId.equals(currentProject._id as Types.ObjectId)
      );

      if (role === 'admin' && isAdmin && isMember) {
        return next();
      }
    } catch (error) {
      logger.error('[verifyRole] Error verifying role', error);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  };
};

export default verifyRole;
