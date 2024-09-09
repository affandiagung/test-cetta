import prisma from '../prisma/prisma';
import { HttpStatusCode } from 'axios';
import { handlePrismaError, throwError } from '../error/errorHandler';
import { getExpTimestamp } from './auth-schema';

interface Register {
    name: string;
    email: string;
    password: string;
}

interface Login {
    email: string;
    password: string;
}
export async function login(body: Login, jwtAccess: any) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: body.email },
        });

        if (!user)
            return {
                statusCode: HttpStatusCode.Unauthorized,
                message:
                    'The email address or password you entered is incorrect',
            };

        const matchPassword = await Bun.password.verify(
            body.password,
            user.password
        );

        if (!matchPassword)
            return {
                statusCode: HttpStatusCode.Unauthorized,
                message:
                    'The email address or password you entered is incorrect',
            };

        const accessToken = await jwtAccess.sign({
            sub: user.id,
            exp: getExpTimestamp(60 * 60 * 24),
        });

        return {
            statusCode: 200,
            message: 'Login Successful',
            data: {
                user,
                accessToken,
            },
        };
    } catch (error) {
        return handlePrismaError(error);
    }
}

export async function register(body: Register) {
    try {
        const password = await Bun.password.hash(body.password);
        const user = await prisma.user.create({
            data: {
                ...body,
                password,
            },
        });
        return {
            statusCode: 201,
            message: 'Account created successfully',
            data: {
                user,
            },
        };
    } catch (error) {
        return handlePrismaError(error);
    }
}
