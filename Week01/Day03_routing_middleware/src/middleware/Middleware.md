2. Middleware (Deep)

Types of Middleware:

a) Application-level middleware
b) Router-level middleware
c) Error-handling middleware
d) Built-in middleware
e) Third-party middleware

Examples you will build:

Logging middleware

Request-time middleware

Auth middleware

Role-based access middleware

Query validation middleware

✅ 3. Creating Custom Middleware

You will learn to build:

🔹 requestLogger

Logs each API request.

🔹 authenticate

Checks JWT and verifies user.

🔹 authorize(role)

Allows only selected roles to access a route.

🔹 validate(schema)

Validates request body using Zod/Joi.

==================================================
next() :next() Express ka built-in function hai jo middleware chaining ko control karta hai.
Tumhare code me next() ka role bahut important hai.
pipline for request 
Request → Middleware 1 → Middleware 2 → Route Handler → Response


Agar middleware successful ho → next() call karo, taaki request aagle middleware ya controller tak pahunch jaaye.
✔ Agar error aata hai → next(new ErrorObject) call karo, taaki Express request ko global error handler tak forward kare.


