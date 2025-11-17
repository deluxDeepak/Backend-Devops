# Day02 - logging & routes (backend)

Summary
- Entry point: `src/server.js`
- Stack: Express with middleware (helmet, cors, morgan) and Winston for logging.
- Control environment via `NODE_ENV` (development, staging, production, test).

Scripts
- npm run dev
  - Run in development with `nodemon` and `NODE_ENV=development`. Auto-restarts on file changes.
- npm test
  - Run tests with `NODE_ENV=test` and Jest (`--runInBand` to run tests serially).
- npm run staging
  - Start the server with `NODE_ENV=staging` (plain node).
- npm start
  - Start the server for production with `NODE_ENV=production`.

PM2 helper scripts
- npm run pm2:dev
  - Start the app under PM2 using the `development` env and a dedicated process name.
- npm run pm2:staging
  - Start the app under PM2 using the `staging` env.
- npm run pm2:prod
  - Start the app under PM2 using the `production` env.
- npm run pm2:stop
  - Stop all PM2 processes.
- npm run pm2:delete
  - Delete all PM2 processes from the process list.
- npm run pm2:logs
  - Tail PM2 logs (shows recent lines).

Quick start
1. Install deps:
   - npm install
2. Development:
   - npm run dev
3. Test:
   - npm test
4. Start (production):
   - npm start

5. npm install cross-env --save-dev
  - Give a Universal commad for all system 
  "dev": "NODE_ENV=development nodemon src/server.js", this will not run in window 

  so write 
  "dev": "cross-env NODE_ENV=development nodemon src/server.js",


Notes
- Ensure `src/server.js` initializes logging (winston) early so middleware like morgan can pipe or format logs consistently.
- Consider adding environment files (.