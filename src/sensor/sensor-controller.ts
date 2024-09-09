import { Elysia } from 'elysia';
import {
    deleteSensor,
    getSensors,
    getSensorsById,
    storeSensor,
    syncSensor,
    updateSensor,
} from './sensor-handler';
import { getId, sensorCreated, sensorUpdated } from './sensor-schema';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { jwtAccessSetup } from '../auth/auth-schema';
import { handlePrismaError } from '../error/errorHandler';

const secret = process.env.JWT_SECRET as string;

const sensorRoutes = new Elysia({ prefix: '/sensor' });

sensorRoutes
    .use(jwtAccessSetup)
    .use(isAuthenticated)
    .post('/sync', async () => {
        return await syncSensor();
    })
    .get('/', () => {
        return getSensors();
    })
    .get('/:id', ({ params: { id } }) => getSensorsById(Number(id)), {
        params: getId,
    })
    .post('/', async ({ body }: { body: any }) => storeSensor(body), {
        body: sensorCreated,
    })
    .put(
        '/:id',
        async ({
            params: { id },
            body,
        }: {
            params: { id: number };
            body: any;
        }) => {
            const data = await updateSensor(id, body);
            return data;
        },
        {
            params: getId,
            body: sensorUpdated,
        }
    )
    .delete('/:id', ({ params: { id } }) => deleteSensor(id), {
        params: getId,
    });

export default sensorRoutes;
