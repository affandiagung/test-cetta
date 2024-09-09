import { Elysia } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { swagger } from '@elysiajs/swagger';
import sensorRoutes from './sensor/sensor-controller';
import { authRoutes } from './auth/auth-controller';
import cors from '@elysiajs/cors';

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
});

const port = process.env.PORT || 3000;
const app = new Elysia({ prefix: `/api/v1` });

app.use(swagger());
app.use(cors({ origin: '*', methods: 'GET, PUT, POST, DELETE, ' }));

app.use(authRoutes);
app.use(sensorRoutes);
app.get('/', () => 'Hello World');

app.listen(port, () => {});

console.log(`Server is running on port ${app.server?.port}`);
