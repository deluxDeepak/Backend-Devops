const http=require('http');
const config=require('./config/index');
const { createApp } = require("./app");

// Create the server 
const app=createApp();
const server=http.createServer(app);

// Start the server listening 
server.listen(config.port,()=>{
    console.log(`Server is Running on port ${config.port}`)
})

// Stop the listening 

// =========Graceful Shutdown==========
const shutdown = () => {
  console.log("\n🛑 Shutting down server...");
  server.close(() => {
    console.log("✅ Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);









