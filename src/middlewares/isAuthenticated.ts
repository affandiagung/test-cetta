import type { Elysia } from 'elysia';
import { jwtAccessSetup } from '../auth/auth-schema';
import prisma from '../prisma/prisma';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (app: Elysia) =>
    app
        .use(jwtAccessSetup)
        .derive(async function handler({
            jwtAccess,
            set,
            request: { headers },
        }) {
            const authorization = headers.get('authorization');

            if (!authorization) {
                set.status = 401;
                throw new Error('Unauthorized');
            }
            const token = authorization.split(' ')[1];

            if (!token) {
                set.status = 401;
                throw new Error('Unauthorized');
            }

            const decoded = jwt.decode(token, { complete: true });

            const payloadId = decoded?.payload?.sub;

            if (!payloadId) {
                set.status = 401;
                throw new Error('Unauthorized');
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: Number(payloadId),
                },
            });

            if (!user) {
                set.status = 401;
                throw new Error('Unauthorized');
            }

            return {
                user,
            };
        });
