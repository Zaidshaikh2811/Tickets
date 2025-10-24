import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError";
import { ValidationError } from "express-validator";

interface ErrorResponse {
    errors: Array<{
        message: string;
        field?: string;
    }>;
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Handle CustomError instances
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            errors: [{ message: err.message }]
        });
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        const errors = Object.values((err as any).errors).map((e: any) => ({
            message: e.message,
            field: e.path
        }));
        return res.status(400).json({ errors });
    }

    // Handle Mongoose duplicate key errors
    if ((err as any).code === 11000) {
        const field = Object.keys((err as any).keyPattern)[0];
        return res.status(400).json({
            errors: [{ message: `${field} already exists`, field }]
        });
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            errors: [{ message: "Invalid token" }]
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            errors: [{ message: "Token expired" }]
        });
    }

    // Log unexpected errors
    console.error("Unexpected error:", err);

    // Default error response
    return res.status(500).json({
        errors: [{ message: "Something went wrong" }]
    });
};

// Async error wrapper to catch errors in async route handlers
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};