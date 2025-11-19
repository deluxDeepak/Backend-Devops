const http = require('http');
const config = require('./config/index');
const createApp = require('./app');

(async () => {
    try {
        const app = await createApp();
        const server = http.createServer(app);

        server.listen(config.app.port, () => {
            console.log(`Server is running at port ${config.app.port}`);
        });

        // Graceful shutdown the server
        const shutdown = () => {
            console.log('Shutting down the server');
            server.close(() => {
                console.log('Server close');
                process.exit(0);
            });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (err) {
        console.error('Failed to start application', err);
        process.exit(1);
    }
})();

