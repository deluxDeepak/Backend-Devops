// Load correct ENV configuartion 
const dotenv=require('dotenv')
dotenv.config()

const config={
    port:process.env.PORT || 5000,
    nodeEnv:process.env.NODE_ENV
}

module.exports=config
