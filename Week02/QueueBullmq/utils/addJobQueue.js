// 2nd Step 
// Add the job to Queue 

const emailQueue = require("../queue/email.queue")

// =================Adding Multiple jobs ================ 
// ====Option While adding the job ====
const Option = {
    priority: 10,           // Higher number = higher priority
    delay: 5000,           // Delay 5 seconds before processing
    attempts: 3,           // Retry up to 3 times on failure
    backoff: {             // Exponential backoff between retries
        type: 'exponential',
        delay: 2000
    }
}

// Job Naming Convention**
// javascript
// ✅ Good: Descriptive, hierarchical names
// await emailQueue.add('user.welcome.send', data);
// await emailQueue.add('user.password.reset', data);
// await emailQueue.add('admin.report.weekly', data);
const addEmailJob = async () => {
    await emailQueue.add("email-queue01", {
        email: "exampleemail@gmail.com",
        message: "Hellow this is testing email Queue",
        senderName: "Deepak",
    }, Option);


    await emailQueue.add("email-queue02", {
        email: "test02@gmail.com",
        message: "Hellow this is testing email Queue",
        senderName: "test02",
    });

    await emailQueue.add("email-queue03", {
        email: "test02@gmail.com",
        message: "Hellow this is testing email Queue",
        senderName: "test02",
    });

    // =====AddMultiple Job efficintly==========
    const multipleJobs = [
        { name: 'newsletter', data: { email: 'user1@example.com', type: 'weekly' } },
        { name: 'reminder', data: { email: 'user2@example.com', type: 'payment' } },
        { name: 'notification', data: { email: 'user3@example.com', type: 'update' } }
    ]
    await emailQueue.addBulk(multipleJobs);


    console.log("Email Job added sucessfully !");
}

module.exports = addEmailJob;