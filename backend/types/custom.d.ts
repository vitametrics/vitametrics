import { IOrganization } from "../models/Organization";
import { IUser } from "../models/User";
import { Request } from "express";

export interface CustomReq extends Request {
    user?: IUser;
    organization?: IOrganization;
}

declare global {
    namespace Express {
        interface User extends IUser {}
    }
}