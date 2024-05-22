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
        (!projectId && currentUser.role === 'siteAdmin') ||
        currentUser.role === 'siteOwner'
      ) {
        return next();
      } else if (projectId) {
        const currentProject = (await Project.findOne({
          projectId,
        })) as IProject;

        if (!currentProject) {
          logger.error('[verifyRole] Project not found');
          return res.status(404).json({ msg: 'Project not found' });
        }

        if (currentProject.ownerId === currentUser.userId) {
          return next();
        }

        const isAdmin =
          currentUser.role === 'siteAdmin' ||
          currentProject.admins.includes(currentUser._id as Types.ObjectId);
        const isMember = currentUser.projects.some((projId) =>
          projId.equals(currentProject._id as string)
        );

        if (isAdmin && role === 'user' && isMember) {
          return next();
        }
      } else {
        logger.error(
          `[verifyRole] Access denied - User does not have the required role`
        );
        return res.status(403).json({
          msg: 'Access denied - User does not have the required role',
        });
      }
    } catch (error) {
      logger.error(`[verifyRole] Error verifying role: ${error}`);
      res.status(500).json({ msg: 'Internal Server Error' });
      return;
    }
  };
};

export default verifyRole;
