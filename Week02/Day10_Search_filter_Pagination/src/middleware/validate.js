const ValidationError = require('../error/ValidationError');

const validate = (schema) => (req, res, next) => {
    if (!schema || typeof schema.safeParse !== 'function') return next();

    // Helpful log for debugging
    console.log('validate', { path: req.path, method: req.method, contentType: req.headers['content-type'] });

    // If no body parser ran or client didn't send JSON, req.body can be undefined
    if (req.body === undefined) {
        return res.status(400).json({
            success: false,
            message: "Request body is missing. Ensure you're sending JSON and include header 'Content-Type: application/json'.",
        });
    }

    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
    });

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: result.error.errors,
        });
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;

    next();
};

module.exports = validate;