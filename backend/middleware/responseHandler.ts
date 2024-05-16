import { Request, Response, NextFunction } from 'express';
import HandleResponse from '../types/response';

interface IErrorResponse {
    status: number;
    message: string;
}

/**
 * Error handler middleware
 * @param err - error object
 * @param req - request object
 * @param res - response object
 * @param next - next function
 */
export function handleResponse(err: HandleResponse, req: Request, res: Response, next: NextFunction) {

    const statusCode: number = err.statusCode;
    const message: string = err.message;

    console.error(err);

    const errorResponse: IErrorResponse = {
        status: statusCode,
        message: message
    };

    res.status(statusCode).json(errorResponse);
}