import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { HttpStatusCode } from 'axios';

interface ErrorResponse {
    statusCode: number;
    message: string;
}

export function handlePrismaError(error: any): ErrorResponse {
    if (error instanceof PrismaClientKnownRequestError) {
        const meta = error.meta as Record<string, string>;
        const target = meta?.target as string;
        const model = meta?.target as string;
        switch (error.code) {
            case 'P2002':
                return {
                    statusCode: HttpStatusCode.Conflict,
                    message: `Unique constraint failed on the '${target}' field`,
                };
            case 'P2025':
                return {
                    statusCode: HttpStatusCode.NotFound,

                    message: `Data Not Found`,
                };
            default:
                return {
                    statusCode: HttpStatusCode.InternalServerError,
                    message: 'An unexpected error occurred.',
                };
        }
    } else {
        return {
            statusCode: HttpStatusCode.InternalServerError,
            message: 'An unexpected error occurred.',
        };
    }
}

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export function throwError(
    message: string,
    statusCode: number
): never {
    throw new AppError(message, statusCode);
}
