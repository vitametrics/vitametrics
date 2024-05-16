import { Request, Response, NextFunction } from 'express';
import Project from '../models/Project';

export const findProject = async (req: Request, res: Response, next: NextFunction ) => {
    const projectId = req.params.projectId || req.query.projectId || req.body.projectId;
    const project = await Project.findOne({ projectId });
    if (!project) {
        return res.status(404).json({ msg: 'Project not found'});
    }
    req.project = project;
    next();
}