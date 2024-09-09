import { t } from 'elysia';

export const sensorCreated = t.Object({
    id: t.Optional(t.Number()),
    tanggal: t.Date({ format: 'yyyy-MM-dd' }),
    sensorPM25: t.Number({ maxDecimalPlaces: 2 }),
    sensorPM10: t.Number({ maxDecimalPlaces: 2 }),
    sensorO3: t.Number({ maxDecimalPlaces: 2 }),
    sensorUVI: t.Number({ maxDecimalPlaces: 2 }),
});

export const sensorUpdated = t.Object({
    id: t.Optional(t.Number()),
    sensorPM25: t.Number({ maxDecimalPlaces: 2 }),
    sensorPM10: t.Number({ maxDecimalPlaces: 2 }),
    sensorO3: t.Number({ maxDecimalPlaces: 2 }),
    sensorUVI: t.Number({ maxDecimalPlaces: 2 }),
});

export const getId = t.Object({
    id: t.Number(),
});
