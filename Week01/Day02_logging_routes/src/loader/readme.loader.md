Load folder =Starup initialization system 

App start hote waqt jo kuch load hona chiye pehle run hona chiye wo sara yehan rehega 


1. express.js → Express middleware loader
Isme kya hota hai?

body parser

CORS

helmet security

cookie parser

rate limiter

morgan logger

compression

express.json()

Kyun loader me?

✔ app.js clean rahe
✔ Express setup ka code separate ho
✔ Easily modify kar sakte ho (toggle, add, remove)

🔥 2. routes.js → Auto route loader
Isme kya hota hai?

routes folder ko scan karna

har .routes.js file load karna

app.use(…) mount karna

Kyun loader me?

✔ app.js me manual imports nahi
✔ New routes add karna super easy
✔ Big applications me manageable

🔥 3. db.js → Database initialization
Isme kya hota hai?

MongoDB connection

Retry logic

DB events log

Connection options set

Kyun loader me?

✔ App start hote hi DB connect ho
✔ Server and database init separated rahe
✔ Testing me fake DB load ho sakta hai
✔ Production me multiple DB load ho sakte hain

🔥 4. logger.js → Winston / Bunyan logger init
Isme kya hota hai?

Winston logger config

Log format

File logs

Console logs

Error logs

Kyun loader me?

✔ Logging system app-level dependency hai
✔ Pure project me use hota hai
✔ Ek jagah se manage hota hai

🔥 5. jobs.js → Cron jobs / scheduled tasks
Isme kya hota hai?

Daily jobs

Email reminders

Cleanup jobs

Database maintenance tasks

Kyun loader me?

✔ App start hote hi jobs schedule ho
✔ Ek jagah se saare cron manage ho

🔥 6. cache.js → Redis client loader
Isme kya hota hai?

Redis connect

Redis health check

Cache helper export

Kyun loader me?

✔ Redis startup pe hi initialize ho
✔ Routes/services me direct use kar sakte ho
✔ Performance boost

🔥 7. swagger.js → API documentation loader
Isme kya hota hai?

Swagger UI

YAML/JSON docs

Documentation route

Kyun loader me?

✔ App start time docs auto load
✔ Dev tools separate rahe

🔥 8. events.js → Event emitter system
Isme kya hota hai?

Custom events

Email sender

Notification events

Hook system

Kyun loader me?

✔ Event listeners startup time initialize hon
✔ Microservice ready architecture