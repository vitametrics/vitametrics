import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import Project from '../models/Project';
import { sendEmail } from '../middleware/util/emailUtil';
import argon2, { verify } from 'argon2';
import crypto from 'crypto';
import HandleResponse from '../types/response';

class UserController {
    static async authStatus(req: Request, res: Response) {
        const currentUser = req.user as IUser;

        if (req.isAuthenticated && req.isAuthenticated()) {
            try {

                const user = await User.findOne({ userId: currentUser.userId });
                if (!user) {
                    throw new HandleResponse('User not found', 404);  
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
                throw new HandleResponse();
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
                throw new HandleResponse("Invalid token", 500);
            }
            res.status(200).json({ msg: 'Token is valid'});
            return;            
        } catch (error) {
            console.error(error);
            throw new HandleResponse();
        }
    }

    static async setPassword(req: Request, res: Response) {
        const { token, password } = req.body;
        const projectId = req.query.projectId as string;
        try {
            const user = await User.findOne({ setPasswordToken: token });
            const project = await Project.findOne({ projectId });
            if (!user) {
                throw new HandleResponse("Invalid or expired token", 400);
            }

            if (!project && user.role === 'admin' || user.role === 'owner') {
                user.password = await argon2.hash(password);
                user.emailVerified = true;
                user.setPasswordToken = null;
                user.passwordTokenExpiry = null;
                await user.save();
                throw new HandleResponse("Password set successfully", 200);
            } else if (!project) {
                throw new HandleResponse("Project not found", 404);
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
            throw new HandleResponse();
        }
    }

    static async changePassword(req: Request, res: Response) {
        const currentUser = req.user as IUser;
        const userId = currentUser.userId;
        const { password } = req.body;
        try {
            const user = await User.findOne({ userId });
            if (!user) {
                throw new HandleResponse("User not found", 404);
            }
            user.password = await argon2.hash(password);
            await user.save();
            res.status(200).json({ msg: 'Password changed successfully'});
            return;
        } catch (error) {
            console.error(error);
            throw new HandleResponse();
        }
    }

    static async changeEmail(req: Request, res: Response) {
        const currentUser = req.user as IUser;
        const userId = currentUser.userId;
        const { email } = req.body;
        try {
            const user = await User.findOne({ userId });
            if (!user) {
                throw new HandleResponse("User not found", 404);
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
        } catch (error) {
            console.error(error);
            throw new HandleResponse();
        }
    }

    static async sendEmailVerification(req: Request, res: Response) {
        const currentUser = req.user as IUser;
        try {
            const user = await User.findOne({ email: currentUser.email });
            if (!user) {
                throw new HandleResponse("User not found", 404);
            }
            const verificationLink = `https://${process.env.BASE_URL}/api/user/verify-email?token=${user.emailVerfToken}`;
            
            if (process.env.NODE_ENV === 'production') {
                await sendEmail({
                    to: user.email,
                    subject: 'Vitametrics Email Verification',
                    text: `Please verify your email using this link ${verificationLink}`
                });
            } else {
                console.log(`[INFO] Email verification link: ${verificationLink}`);
            }
            res.status(200).json({ msg: 'Email sent successfully'});
        } catch (error) {
            console.error(error);
            throw new HandleResponse();
        }
    }

    static async verifyEmail(req: Request, res: Response) {
        const currentUser = req.user as IUser;
        try {
            const user = await User.findOne({ emailVerificationToken: req.query.token as string });
            if (!user) {
                throw new HandleResponse("Invalid or expired verification token", 400);
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
            throw new HandleResponse();
        }
    }

    static async deleteAccount(req: Request, res: Response) {
        const currentUser = req.user as IUser;
        const { password } = req.body;
        const userId = currentUser.userId;
        try {
            const user = await User.findOne({ userId });
            if (!user) {
                throw new HandleResponse("User not found", 404);
            }
            const passMatch = await verify(user.password, password);
            if (!passMatch) {
                throw new HandleResponse("Incorrect password", 401);
            }
            const project = await Project.findOne({ ownerId: userId});
            if (project) {
                throw new HandleResponse("Cannot delete account as owner of the project", 400);
            } else {
                await Project.updateOne(
                    {members: user._id},
                    { $pull: { members: user._id } }
                );
                await User.deleteOne({ userId });
            }
            throw new HandleResponse("Account deleted successfully", 200);
        } catch (error) {
            console.error(error);
            throw new HandleResponse();
        }
    }
}

export default UserController;