const http = require('http')
const { createApp } = require("./app");
const config = require('./config/index');


const app = createApp()
const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server is running at port ${config.port}`)
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

