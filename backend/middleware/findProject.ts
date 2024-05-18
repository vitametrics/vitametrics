import { Request, Response, NextFunction } from 'express';

import Project from '../models/Project';
import HandleResponse from '../types/response';

export const findProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const projectId =
    req.params.projectId || req.query.projectId || req.body.projectId;
  const project = await Project.findOne({ projectId });
  if (!project) {
    throw new HandleResponse('Project not found', 404);
  }
  req.project = project;
  next();
};
