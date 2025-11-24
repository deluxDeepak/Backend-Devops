const express = require('express');
const httpLogger = require('./middleware/logging.middleware');
const logger = require('./config/logger');


const app = express();
// Apply http logging middleware first 
app.use(httpLogger);

app.use('/api/user', (req, res) => {
    logger.info('Fetching users', { reuseID: req.id });

    res.json({ users: [] })
})

// ======Error handling middleware ========

const connect = () => {
    try {
        app.listen(3000, (err) => {
            logger.info('Http server is Live ')
        });
    } catch (error) {
        logger.error('Error in Running the server');

    }

};

connect();
