//====================== Zod validation ===============
// Remove special characters 
// Convert types 
// Ensure only safe data reaches controller 

const { ValidationError } = require("../error")

const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            params: req.params,
            query: req.query,
        })

        req.body = parsed.body;
        req.params = parsed.params;
        req.query = parsed.query;
        next();

    } catch (error) {
        return next(new ValidationError("validation Error from controller.validate.js", false));

    }
};

module.exports=validate;