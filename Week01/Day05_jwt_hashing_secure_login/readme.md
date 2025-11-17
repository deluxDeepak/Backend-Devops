# Dependencies (Production)

compression  
Purpose: Compresses HTTP responses for smaller payloads and faster transfers.  
Basic syntax:
```js
const compression = require('compression');
app.use(compression());
```

cookie-parser  
Purpose: Parses cookies on incoming requests and exposes req.cookies.  
Basic syntax:
```js
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```

cors  
Purpose: Enables/configures Cross-Origin Resource Sharing for your API.  
Basic syntax:
```js
const cors = require('cors');
app.use(cors()); // or app.use(cors({ origin: 'https://example.com' }));
```

dotenv  
Purpose: Loads environment variables from a .env file into process.env.  
Basic syntax:
```js
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

express  
Purpose: Web framework for routing and middleware composition.  
Basic syntax:
```js
const express = require('express');
const app = express();
app.use(express.json());
app.get('/', (req, res) => res.json({ status: 'ok' }));
```

express-rate-limit  
Purpose: Throttles repeated requests to protect against abuse/DDoS.  
Basic syntax:
```js
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

helmet  
Purpose: Adds secure HTTP headers to reduce web vulnerabilities.  
Basic syntax:
```js
const helmet = require('helmet');
app.use(helmet());
```

morgan  
Purpose: HTTP request logger for development/monitoring.  
Basic syntax:
```js
const morgan = require('morgan');
app.use(morgan('combined'));
```

winston  
Purpose: Flexible logging library for structured, persistent logs.  
Basic syntax:
```js
const winston = require('winston');
const logger = winston.createLogger({
  transports: [new winston.transports.Console({ level: 'info' })]
});
logger.info('server started');
```

---

🛠️ Dev Dependencies (Development Only)

jest  
Purpose: Testing framework for unit/integration tests.  
Basic syntax (package.json script + simple test):
```json
// package.json (partial)
"scripts": { "test": "jest" }
```
```js
// example.test.js
test('basic math', () => expect(1 + 1).toBe(2));
```

nodemon  
Purpose: Restarts the server automatically on file changes during development.  
Basic syntax (package.json script):
```json
// package.json (partial)
"scripts": { "dev": "nodemon server.js" }
```

pm2  
Purpose: Production process manager to keep apps alive and manage restarts.  
Basic usage:
```bash
pm2 start server.js --name my-app
pm2 logs my-app
```

## Add this three also 
mongoose 
bcrypt jsonwebtoken
 
## Authorization header — समस्या, कारण और समाधान (हिन्दी)

Server console में आप यह देख रहे हैं:

- AuthHeader: undefined
- UnauthorizedError: Authorization header missing

क्यों होता है:

- जब आप ब्राउज़र के address bar में सीधे URL खोलते हैं या साधारण link/form request करते हैं, तो ब्राउज़र `Authorization` header नहीं भेजता।
- सिर्फ URL पर जाना (GET via address bar) या साधारण form submit से custom headers नहीं निकलते।
- अगर frontend किसी अलग origin (domain/port) से request कर रहा है तो ब्राउज़र preflight (OPTIONS) भेजेगा और तभी custom headers (जैसे `Authorization`) भेजेगा जब server CORS में उन्हें allow करता हो.

समाधान:

- Development या debugging के लिए Postman/Insomnia/curl इस्तेमाल करें और `Authorization` header भेजें:

```bash
# curl example
curl -H "Authorization: Bearer <YOUR_TOKEN_HERE>" http://localhost:5000/api/protected
```

- Browser से programmatic request करते समय `fetch` या axios में header सेट करें:

```js
// fetch example
fetch('http://localhost:5000/api/protected', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOi...'
  }
})
.then(r => r.json()).then(console.log)
```

- यदि frontend और backend अलग origins पर हैं, server पर CORS को authorize header अनुमति देनी होगी. express में `cors` पैकेज के साथ उदाहरण:

```js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

क्या होते हैं HTTP headers (short):

- `Host`, `User-Agent`, `Accept`, `Content-Type`, `Authorization`, `Cookie` आदि होते हैं।
- `Authorization` header authentication information रखता है — आमतौर पर दो common formats:
  - `Bearer <token>` — JWT/token based auth
  - `Basic <base64(user:pass)>` — basic auth

`Authorization` में क्या आता है (उदाहरण):

- Bearer token: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Basic auth: `Authorization: Basic dXNlcjpwYXNzd29yZA==`

Best practices (simple list):

- Sensitive tokens को httpOnly cookies में रखना ज़्यादा सुरक्षित होता है (XSS से बचने के लिए). अगर cookies use कर रहे हों, `fetch` में `credentials: 'include'` भेजें और server पर CORS में `credentials: true` enabled होनी चाहिए.
- अगर token header में भेज रहे हैं, frontend से explicitly `Authorization` header सेट करें।
- Server middleware (जैसे `authenticate`) सिर्फ header parsing करे; token verification अलग step में करें (e.g., `jsonwebtoken.verify`).
- Preflight / CORS ध्यान में रखें: server को `Authorization` allow करना होगा या browser header नहीं भेजेगा.
- Development में debug के लिए server-side console log helpful है — पर production में इन logs में tokens print न करें.

Quick checklist to fix your current problem:

1. If you opened URL in browser address bar -> that's why header is missing. Use Postman/curl or a frontend `fetch` that sets the header.
2. From frontend, set header: `Authorization: 'Bearer <your-token>'`.
3. If frontend runs on different origin, enable CORS and include `Authorization` in allowed headers.
4. Check server console logs for `AuthHeader:` to confirm header arrived.

Example: testing with curl (recommended for quick test):

```bash
curl -i -H "Authorization: Bearer TEST_TOKEN" http://localhost:5000/your-protected-route
```

यह section README में जोड़ दिया गया ताकि आने वाले developers को वही error और उसका तुरन्त समाधान मिल जाए।
