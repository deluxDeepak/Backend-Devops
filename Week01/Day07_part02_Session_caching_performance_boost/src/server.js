const http = require('http');
const config = require('./config/index');
const createApp = require('./app');
const connectDb = require('./databse/mongo.db');


const app = createApp();
const server = http.createServer(app);

// Connect the Db before app listining 
connectDb();

server.listen(config.app.port, () => {
    console.log(`Server is running at port ${config.app.port}`)
})

// Graceful shutdown the server 
const shutdown = () => {
    console.log("Shutting down the server")
    server.close(() => {
        console.log("Server close")
        process.exit(0)
    })
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown)

