// generate the Connection here 
const mongoose = require('mongoose');
const config = require('../config');

const connectMongoDb = async () => {
    try {
        console.log("Mongotest Uri", config.MOGO_db.uri);
        await mongoose.connect(config.MOGO_db.uri, {
            user: config.MOGO_db.user,
            pass: config.MOGO_db.pass
        })

        console.log("Mongo connected ");
        // TODO:Add logging here 

    } catch (error) {
        console.error("Mongo connection fail", error.message);
        // TODO:Add logging here 
        process.exit(1);
    }

}
module.exports = connectMongoDb