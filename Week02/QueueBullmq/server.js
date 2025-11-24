const express = require("express");
const addEmailJob = require("./utils/addJobQueue");
const emailQueue = require("./queue/email.queue");

// Make dashboard Of bullmq
const app = express();

addEmailJob();


// Health check points 
app.use("/health/queues", async (req,res) => {
    try {
        const waiting = await emailQueue.getWaiting();
        const active = await emailQueue.getActive();
        const completed = await emailQueue.getCompleted();
        const failed = await emailQueue.getFailed();

        res.json({
            status: 'healthy',
            queues: {
                email: {
                    waiting: waiting.length,
                    active: active.length,
                    completed: completed.length,
                    failed: failed.length
                }
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'unhealthy', error: error.message });
    }
})
app.listen(3001,
    () => console.log("Health check at http://localhost:3001/health/queues")

)