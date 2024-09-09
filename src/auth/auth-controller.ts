import { Elysia } from 'elysia';

import {
    basicAuthModel,
    jwtAccessSetup,
    storeUserModel,
} from './auth-schema';

import { login, register } from './auth-handler';
import { isAuthenticated } from '../middlewares/isAuthenticated';

export const authRoutes = new Elysia({ prefix: '/auth' });

authRoutes
    .use(basicAuthModel)
    .use(jwtAccessSetup)
    .post(
        '/login',
        async ({ body, jwtAccess }) => {
            return await login(body, jwtAccess);
        },
        {
            body: 'basicAuthModel',
        }
    )
    .use(storeUserModel)
    .post(
        '/register',
        async ({ body }) => {
            return await register(body);
        },
        {
            body: 'storeUserModel',
        }
    )
    .use(isAuthenticated)
    .get('/me', ({ user }) => {
        return {
            statusCode: 200,
            message: 'success',
            data: user,
        };
    });
