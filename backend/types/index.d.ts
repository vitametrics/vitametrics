import { IProject } from '../models/Project';
import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export interface IPopulatedUser {
  _id: Types.ObjectId;
  userId: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: Express.User;
    project?: IProject;
  }
}
