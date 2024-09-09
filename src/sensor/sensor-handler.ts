import { NotFoundError } from 'elysia';
import prisma from '../prisma/prisma';
import axios from 'axios';
import { HttpStatusCode } from 'axios';
import { handlePrismaError } from '../error/errorHandler';

import moment from 'moment';

interface Post {
    id?: number;
    title: string;
    path: string;
    content: string;
}

interface SensorData {
    // id?: number;
    tanggal: Date;
    sensorO3: number;
    sensorPM25: number;
    sensorUVI: number;
    sensorPM10: number;
}

export async function syncSensor() {
    try {
        const token = process.env.SENSOR_TOKEN;
        const response = await axios.post(
            `https://api.waqi.info/feed/jakarta/?token=${token}`
        );

        const responseData = response?.data?.data?.forecast?.daily;

        const processData = (data: any) => {
            let sensorO3 = 0;
            let sensorPM25 = 0;
            let sensorPM10 = 0;
            let sensorUVI = 0;

            const todayO3 = data.o3.find(
                (e: any) => e.day == moment().format('YYYY-MM-DD')
            );
            const todayPM25 = data.pm25.find(
                (e: any) => e.day == moment().format('YYYY-MM-DD')
            );
            const todayPM10 = data.pm10.find(
                (e: any) => e.day == moment().format('YYYY-MM-DD')
            );
            const todayUVI = data.uvi.find(
                (e: any) => e.day == moment().format('YYYY-MM-DD')
            );

            sensorO3 = todayO3.max;
            sensorPM25 = todayPM25.max;
            sensorPM10 = todayPM10.max;
            sensorUVI = todayUVI.max;

            return {
                tanggal: moment().format('YYYY-MM-DD'),
                sensorO3,
                sensorPM25,
                sensorPM10,
                sensorUVI,
            };
        };

        const sensorData = processData(responseData);

        if (!response.data) {
            return {
                statusCode: HttpStatusCode.NotFound,
                message: ' Data Not Found',
            };
        }

        const findDataSensor = await prisma.sensor_data.findUnique({
            where: {
                tanggal: moment(sensorData.tanggal)
                    .add(7, 'hour')
                    .toISOString(),
            },
        });

        if (!findDataSensor) {
            await prisma.sensor_data.create({
                data: {
                    ...sensorData,
                    tanggal: moment(sensorData.tanggal)
                        .add(7, 'hour')
                        .toISOString(),
                },
            });
        } else {
            await prisma.sensor_data.update({
                where: {
                    tanggal: moment(sensorData.tanggal)
                        .add(7, 'hour')
                        .toISOString(),
                },
                data: {
                    sensorO3: sensorData.sensorO3,
                    sensorPM25: sensorData.sensorPM25,
                    sensorPM10: sensorData.sensorPM10,
                    sensorUVI: sensorData.sensorUVI,
                },
            });
        }

        return {
            statusCode: HttpStatusCode.Created,
            data: sensorData,
            message: 'Data sync',
        };
    } catch (error) {
        console.log(error);

        return handlePrismaError(error);
    }
}
export async function getSensors() {
    try {
        const sensor = await prisma.sensor_data.findMany({
            orderBy: { tanggal: 'desc' },
        });

        if (sensor.length == 0)
            return {
                statusCode: HttpStatusCode.NotFound,
                message: 'No Data Found',
            };

        const data = sensor.map((record: any) => ({
            ...record,
            sensorPM25: record.sensorPM25.toNumber(),
            sensorPM10: record.sensorPM10.toNumber(),
            sensorO3: record.sensorO3.toNumber(),
            sensorUVI: record.sensorUVI.toNumber(),
        }));

        return {
            statusCode: HttpStatusCode.Ok,
            data,
        };
    } catch (error) {
        return handlePrismaError(error);
    }
}

export async function getSensorsById(id: number) {
    try {
        const sensor = await prisma.sensor_data.findUnique({
            where: { id: Number(id) },
        });

        if (!sensor)
            return {
                statusCode: HttpStatusCode.NotFound,
                message: 'Data Not Found',
            };

        return {
            statusCode: HttpStatusCode.Ok,
            data: sensor,
        };
    } catch (error) {
        return handlePrismaError(error);
    }
}

export async function storeSensor(options: SensorData) {
    try {
        const {
            tanggal,
            sensorO3,
            sensorPM25,
            sensorUVI,
            sensorPM10,
        } = options;
        const sensor = await prisma.sensor_data.create({
            data: { ...options },
        });

        if (!sensor)
            return {
                statusCode: HttpStatusCode.InternalServerError,
                message: 'Internal Server Error',
            };
        return {
            statusCode: HttpStatusCode.Created,
            message: 'Data Created',
            data: sensor,
        };
    } catch (error) {
        return handlePrismaError(error);
    }
}

export async function updateSensor(id: number, options: SensorData) {
    try {
        const { sensorO3, sensorPM25, sensorUVI, sensorPM10 } =
            options;
        const data = await prisma.sensor_data.update({
            where: { id: Number(id) },
            data: { ...options },
        });
        return {
            statusCode: 201,
            data,
            message: 'sensor updated',
        };
    } catch (error) {
        return handlePrismaError(error);
    }
}

export async function deleteSensor(id: number) {
    try {
        await prisma.sensor_data.delete({
            where: { id: Number(id) },
        });
        return {
            statusCode: HttpStatusCode.Ok,
            message: 'Data Deleted ',
        };
    } catch (error) {
        return handlePrismaError(error);
    }
}
