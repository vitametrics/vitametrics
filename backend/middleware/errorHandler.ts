import { Request, Response, NextFunction } from 'express';

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
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    // default to 500
    let errorCode: number = err.status || 500;
    let message: string = err.message || 'Something went wrong on the server.';

    if (err.name === 'UnauthorizedError') {
        errorCode = 401;
        message = 'Unauthorized access';
    }

    console.error(err);

    const errorResponse: IErrorResponse = {
        status:errorCode,
        message: message
    };

    res.status(errorCode).json(errorResponse);


}