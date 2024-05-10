import { Request, Response, NextFunction } from 'express';
import Project, { IProject } from '../models/Project';
import User from '../models/User';
import { CustomReq } from '../types/custom';

const checkProjectMembership = async (expressReq: Request, res: Response, next: NextFunction) => {
    
    const req = expressReq as CustomReq;
    
    if (!req.user) {
        return res.status(401).json({ msg: 'Unauthorized - User not logged in' });
    }

    const userId = req.user.userId;

    try {

        const user = await User.findOne({ userId: userId}).populate('projects');

        if (!user) {
            return res.status(404).json({msg: 'User not found'});
        }

        if (!user.projects.length && user.role !== 'owner') {
            return res.status(403).json({ msg: 'Access denied - User not a member of any project' });
        }

        const projectId = req.body.projectId || req.query.projectId;
        const projectIds = user.projects.map(project => project._id);
        console.log(projectIds);
        console.log(projectId);
        const matchingProject = await Project.findOne({
            projectId: projectId,
            _id: { $in: projectIds }
        });

        if (!matchingProject && user.role !== 'owner') {
            return res.status(403).json({ msg: 'Access denied - User not a member of the project' });
        }

        req.project = matchingProject as IProject;

        console.log('was in org');
        return next();
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

export default checkProjectMembership;