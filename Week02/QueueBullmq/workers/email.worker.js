// 3rd Step for bullMq
// Create a Worker for email 

const { Worker } = require("bullmq");


// ===================JOB object ================
/*

name: 'email-queue',
  data: {
    email: 'exampleemail@gmail.com',
    message: 'Hellow this is testing email Queue',
    senderName: 'Deepak'
  },
  opts: { attempts: 0, backoff: undefined },
  id: '1',
  progress: 0,
  returnvalue: null,
  stacktrace: [],
  delay: 0,
  priority: 0,
  attemptsStarted: 1,
  attemptsMade: 0,
  stalledCounter: 0,
  repeatJobKey: undefined,
  timestamp: 1763945092543,
  parentKey: undefined,
  debounceId: undefined,
  deduplicationId: undefined,
  toKey: [Function: bound ],


*/

// Wroker me yehan pe emailQuee ka name dena hai 

/* ===========================WHY RETURN in worker======================

Why result return in the worker ?
Result return karne ke 3 major benefits hote hain:

(A) Result is stored & accessible
BullMQ job ka result Redis me store karta hai.
Example:
    return { status: "sent", id: 45 };

Then queue se result nikal sakte ho:
    const job = await queue.getJob(jobId);
    console.log(job.returnvalue);


Use cases:
-> PDF generate karne ke baad file URL return
-> Video compression ke baad new file path return
-> Payment polling ka final status return
-> OTP verification result return


(B) BullMQ Dashboard me job result dikhta hai
Agar aap @bull-board (dashboard) use karte ho, return value UI me show hoti:

(C) Another job ko result chahiye (job chaining)
Agar aap dependent jobs banate ho (Flow Producer):

Job 1: Fetch Data
Job 2: Process Data (needs Job 1 result)
Job 3: Send Email (needs Job 2 result)

*/

const worker = new Worker("Test-emailQueue",
    async (job) => {
        // console.log("============ JOB object is ========= ===", job)
        console.log("The job Data is ", job.data)
        console.log("The job name is ", job.name)

        return { message: "Email sent Successfully", data: Date.now() }
    },
    {
        connection: {
            host: process.env.HOST,
            port: process.env.PORT

        }
    }



);

// Add event to the work 

worker.on("completed",
    (job, result) => {
        console.log(`Job completed with the id ${job.id}`);
        console.log("Result is", result);
    }
);

worker.on("failed",
    (job, err) => {
        console.log(`Job failed with the id ${job.id}`);
        console.error("Error to execute the work", err.message);
    }
)

worker.on('active', (job) => {
    console.log(`🔄 Processing job ${job.id} for ${job.data.email}`);
});