import { IOrganization } from "../models/Project";
import { IUser } from "../models/User";
import { Request } from "express";

export interface CustomReq extends Request {
    [x: string]: import("mongoose").Types.ObjectId;
    req: import("mongoose").Types.ObjectId;
    user?: IUser;
    project?: IOrganization;
}

declare global {
    namespace Express {
        interface User extends IUser {}
    }
}