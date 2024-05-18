import { Request, Response, NextFunction } from 'express';

import Project, { IProject } from '../models/Project';
import User, { IUser } from '../models/User';
import HandleResponse from '../types/response';

const checkProjectMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = req.user as IUser;

  if (!currentUser) {
    throw new HandleResponse('Unauthorized - User not logged in', 401);
  }

  const userId = currentUser.userId;

  try {
    const user = await User.findOne({ userId: userId }).populate('projects');

    if (!user) {
      throw new HandleResponse('User not found', 404);
    }

    if (!user.projects.length && user.role !== 'owner') {
      throw new HandleResponse(
        'Access denied - User not a member of any project',
        403
      );
    }

    const projectId = req.body.projectId || req.query.projectId;
    const projectIds = user.projects.map((project) => project._id);
    console.log(projectIds);
    console.log(projectId);
    const matchingProject = await Project.findOne({
      projectId: projectId,
      _id: { $in: projectIds },
    });

    if (!matchingProject && user.role !== 'owner') {
      throw new HandleResponse(
        'Access denied - User not a member of the project',
        403
      );
    }

    req.project = matchingProject as IProject;

    console.log('was in org');
    return next();
  } catch (error) {
    console.error(error);
    throw new HandleResponse();
  }
};

export default checkProjectMembership;
