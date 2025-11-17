// Here we add only the configuration 
// Create Configuration Loader (src/config/index.js)
const dotenv = require('dotenv')
dotenv.config()

const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV
}

// Use commonjs_module export 
module.exports = config