import { Request, Response } from 'express';
import Project from '../models/Project';
import User, { IUser } from '../models/User';
import Device from '../models/Device';
import crypto from 'crypto';
import { sendEmail } from '../middleware/util/emailUtil';

class AdminController {
    static async createProject(req: Request, res: Response) {
        const { projectName } = req.body;
        const user = req.user as IUser;

        try {

            const existingProject = await Project.findOne({ projectName });
            if (existingProject) {
                res.status(409).json({ msg: 'Project with that name already exists!'});
                return;
            }

            const newProjectId = crypto.randomBytes(16).toString('hex');

             const newProject = new Project({
                projectName,
                projectId: newProjectId,
                ownerId: user.userId,
                ownerName: user.name,
                ownerEmail: user.email,
                members: [user._id]
             });

             const savedProject = await newProject.save();

             user.projects.push(savedProject._id);

             await user.save();

             await sendEmail({
                to: user.email,
                subject: 'Your new project',
                text: `You have created a new project: ${projectName}. Access it here: ${process.env.BASE_URL}/user/projects/${newProjectId}`
             });

             res.status(201).json({ msg: 'Project created successfully', project: savedProject});
             return;

        } catch (error) {
            console.error(error);
            res.status(500).json({msg: 'Internal Server Error'});
            return;
        }
    }

    static async deleteProject(req: Request, res: Response) {
        const currentUser = req.user as IUser;
        const projectId = req.query.projectId as string;
        const userId = currentUser.userId; 

        try {

            const user = await User.findOne({ userId });
            if (!user) {
                res.status(404).json({ msg: 'User not found'});
                return;
            }

            const project = await Project.findOne({ projectId });
            if (!project) {
                res.status(404).json({ msg: 'Project not found'});
                return;
            }

            const members = project.members;
            const deviceIds = project.devices;

            if (deviceIds && deviceIds.length > 0) {
                await Device.deleteMany({ deviceId: { $in: deviceIds }});
            }

            if (members && members.length > 0) {
                for (const member of members) {
                    await User.deleteOne({ _id: member});
                }
            }

            await Project.findOneAndDelete({projectId});
            res.status(200).json({ msg: 'Project deleted successfully'});
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error'});
            return;
        }
    }

    static async addMember(req: Request, res: Response) {
        const { email, name, role } = req.body;
        const projectId = req.query.projectId as string;

        try {
            const project = await Project.findOne({ projectId });
            if (!project) {
                res.status(404).json({ msg: 'Project not found'});
                return;
            }

            let user = await User.findOne({ email });
            if (!user) {

                const newUserId = crypto.randomBytes(16).toString('hex');
                const passwordToken = crypto.randomBytes(32).toString('hex');
                const tokenExpiry = new Date(Date.now() + 3600000);

                const newUser = new User({
                    userId: newUserId,
                    email: email,
                    name: name,
                    role: role,
                    passwordToken: passwordToken,
                    passwordTokenExpiry: tokenExpiry
                });

                await newUser.save();
                user = newUser;
            }

            await sendEmail({ 
                to: email,
                subject: 'Invitation to join a project',
                text: `You have been invited to join the project: ${project.projectName}. Please set your password by following this link: ${process.env.BASE_URL}/set-password?token=${user.setPasswordToken}`
            });

            res.status(200).json({ msg: 'Member added successfully', project});
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal server error'});
            return;
        }
    }

    static async removeMember(req: Request, res: Response) {
        const userId = req.body.userId as string;
        const projectId = req.query.projectId as string;

        try {

            const project = await Project.findOne({ projectId });
            if (!project) {
                res.status(404).json({ msg: 'Project not found'});
                return;
            }

            project.members = project.members.filter(memberId => !memberId.equals(userId));
            await project.save();

            const user = await User.findOne({ userId });
            if (!user) {
                res.status(404).json({ msg: 'User not found'});
                return;
            }

            user.projects = user.projects.filter(pid => !pid.equals(project._id));
            await user.save();

            await sendEmail({
                to: user.email,
                subject: 'Removal from project',
                text: `You have been removed from the project: ${project.projectName}.`
            });

            res.status(200).json({ msg: 'Member removed successfully'});
            return;

        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error'});
            return;
        }
    }
}

export default AdminController;