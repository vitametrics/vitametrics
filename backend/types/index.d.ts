import { IUser } from "../models/User";
import { IProject } from "../models/Project";
import { Request } from 'express';

declare global {
    namespace Express {
        interface User extends IUser {}
    }
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: Express.User;
        project?: IProject;
    }
}