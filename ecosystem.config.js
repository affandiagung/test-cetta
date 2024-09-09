module.exports = {
    apps: [
        {
            name: 'sensorApp',
            script: 'bun',
            args: 'run src/index.ts',
            interpreter: 'none',
            watch: true,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
