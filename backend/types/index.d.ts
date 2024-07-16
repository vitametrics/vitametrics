import { IProject } from '../models/Project';
import { IUser } from '../models/User';

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

declare module 'express-session' {
  interface SessionData {
    authToken?: string;
    projectId?: string;
    userId?: string;
  }
}
