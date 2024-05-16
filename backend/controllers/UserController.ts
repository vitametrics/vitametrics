import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import Project from '../models/Project';
import { sendEmail } from '../middleware/util/emailUtil';
import argon2, { verify } from 'argon2';
import crypto from 'crypto';

class UserController {
    static async authStatus(req: Request, res: Response) {
        const currentUser = req.user as IUser;

        if (req.isAuthenticated && req.isAuthenticated()) {
            try {

                const user = await User.findOne({ userId: currentUser.userId });
                if (!user) {
                    res.status(404).json({ msg: 'User not found'});
                    return;
                }

                const projects = await Project.find({
                    members: { $in: [ user._id ]}
                }).lean();

                const userProjects = projects.map(project => ({
                    projectId: project.projectId,
                    projectName: project.projectName,
                    isOwner: project.ownerId === user.userId,
                    hasFitbitAccountLinked: project.fitbitAccessToken !== ""
                }));
                res.json({
                    isAuthenticated: true,
                    user: {
                        id: currentUser.userId,
                        email: currentUser.email,
                        role: currentUser.role,
                        isEmailVerified: currentUser.emailVerified,
                        projects: userProjects
                    }
                });
                return;
            } catch (error) {
                console.error(error);
                res.status(500).json({ msg: 'Internal Server Error'});
                return;
            }
        } else {
            res.json({ isAuthenticated: false });
            return;
        } 
    }

    static async checkPasswordToken(req: Request, res: Response) {
        const { token } = req.body;
        try {
            const user = await User.findOne({ setPasswordToken: token});
            if (!user) {
                res.status(500).json({ msg: 'Invalid token'});
                return;
            }
            res.status(200).json({ msg: 'Token is valid'});
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error'});
            return;
        }
    }

    static async setPassword(req: Request, res: Response) {
        const { token, password } = req.body;
        const projectId = req.query.projectId as string;
        try {
            const user = await User.findOne({ setPasswordToken: token });
            const project = await Project.findOne({ projectId });
            if (!user) {
                res.status(400).json({ msg: 'Invalid or expired token'});
                return;
            }

            if (!project && user.role === 'admin' || user.role === 'owner') {
                user.password = await argon2.hash(password);
                user.emailVerified = true;
                user.setPasswordToken = null;
                user.passwordTokenExpiry = null;
                await user.save();
                res.status(200).json({ msg: 'Password has been set successfully', email: user.email});
                return;
            } else if (!project) {
                res.status(404).json({ msg: 'Project not found'});
                return;
            }

            user.password = await argon2.hash(password);
            user.emailVerified = true;
            user.setPasswordToken = null;
            user.passwordTokenExpiry = null;
            user.projects.push(project._id);
            await user.save();

            project.members.push(user._id);
            await project.save();

            res.status(200).json({ msg: 'Password set successfully', email: user.email});
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error'});
            return;
        }
    }

    static async changePassword(req: Request, res: Response) {
        const currentUser = req.user as IUser;
        const userId = currentUser.userId;
        const { password } = req.body;
        try {
            const user = await User.findOne({ userId });
            if (!user) {
                res.status(404).json({ msg: 'User not found'});
                return;
            }
            user.password = await argon2.hash(password);
            await user.save();
            res.status(200).json({ msg: 'Password changed successfully'});
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error'});
            return;
        }
    }

    static async changeEmail(req: Request, res: Response) {
        const currentUser = req.user as IUser;
        const userId = currentUser.userId;
        const { email } = req.body;
        try {
            const user = await User.findOne({ userId });
            if (!user) {
                res.status(404).json({ msg: 'User not found'});
                return;
            }
            user.email = email;
            user.emailVerified = false;
            user.emailVerfToken = crypto.randomBytes(32).toString('hex');
            await user.save();
            const project = await Project.findOne({ ownerId: userId});
            if (project) {
                project.ownerEmail = email
                await project.save();
            }
            res.status(200).json({ msg: 'Email changed successfully'});
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error'});
            return;
        }
    }

    static async sendEmailVerification(req: Request, res: Response) {
        const currentUser = req.user as IUser;
        try {
            const user = await User.findOne({ email: currentUser.email });
            if (!user) {
                res.status(401).json({ msg: 'Unauthorized'});
                return;
            }
            const verificationLink = `https://${process.env.BASE_URL}/api/user/verify-email?token=${user.emailVerfToken}`;
            await sendEmail({
                to: user.email,
                subject: 'Vitametrics Email Verification',
                text: `Please verify your email using this link ${verificationLink}`
            });
            res.status(200).json({msg: 'Email sent successfully'});
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error'});
            return;
        }
    }

    static async verifyEmail(req: Request, res: Response) {
        const currentUser = req.user as IUser;
        try {
            const user = await User.findOne({ emailVerificationToken: req.query.token as string });
            if (!user) {
                res.status(400).json({ msg: 'Invalid or expired verification token'});
                return;
            }
            if (!currentUser || currentUser.id !== user._id.toString()) {
                return res.redirect('/dashboard');
            }
            user.emailVerified = true;
            user.emailVerfToken = "";
            await user.save();
            res.redirect('/dashboard?verified=true');
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error'});
            return;
        }
    }

    static async deleteAccount(req: Request, res: Response) {
        const currentUser = req.user as IUser;
        const { password } = req.body;
        const userId = currentUser.userId;
        try {
            const user = await User.findOne({ userId });
            if (!user) {
                res.status(404).json({ msg: 'User not found'});
                return;
            }
            const passMatch = await verify(user.password, password);
            if (!passMatch) {
                res.status(401).json({ msg: 'Incorrect Password'});
                return;
            }
            const project = await Project.findOne({ ownerId: userId});
            if (project) {
                res.status(400).json({ msg: 'Cannot delete account as owner of the project.'});
                return;
            } else {
                await Project.updateOne(
                    {members: user._id},
                    { $pull: { members: user._id } }
                );
                await User.deleteOne({ userId });
            }
            res.status(200).json({ msg: 'Account deleted'});
            return;
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Internal Server Error'});
            return;
        }
    }
}

export default UserController;