import { jwt } from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';

export const signupBodySchema = t.Object({
    name: t.String({ maxLength: 60, minLength: 1 }),
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8 }),
});

export const loginBodySchema = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8 }),
});

export function getExpTimestamp(seconds: number) {
    const currentTimeMillis = Date.now();
    const secondsIntoMillis = seconds * 1000;
    const expirationTimeMillis =
        currentTimeMillis + secondsIntoMillis;

    return Math.floor(expirationTimeMillis / 1000);
}

export const jwtAccessSetup = new Elysia({
    name: 'jwtAccess',
}).use(
    jwt({
        name: 'jwtAccess',
        schema: t.Object({
            id: t.String(),
            name: t.String(),
        }),
        secret: process.env.JWT_ACCESS_SECRET!,
        exp: '1d',
    })
);

export const basicAuthModel = new Elysia().model({
    basicAuthModel: t.Object({
        email: t.String(),
        password: t.String(),
    }),
});

export const storeUserModel = new Elysia().model({
    storeUserModel: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
    }),
});
