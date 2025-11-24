// Make a queue for email 

const { Queue } = require("bullmq");

// Creating a queue 
const emailQueue = new Queue("Test-emailQueue",
    {
        connection: {
            host: process.env.HOST,
            port: process.env.PORT

        }
    });

module.exports=emailQueue;
