// generate the Connection here 
const mongoose = require('mongoose');
const config = require('../config');

const connectDb = async () => {
    try {
        console.log("Mongotest Uri", config.MOGO_db.uri);
        await mongoose.connect(config.MOGO_db.uri, {
            user: config.MOGO_db.user,
            pass: config.MOGO_db.pass
        })

        console.log("DB connected ");
        // TODO:Add logging here 

    } catch (error) {
        console.error("Db connection fail", error.message);
        // TODO:Add logging here 
        process.exit(1);
    }

}
module.exports = connectDb