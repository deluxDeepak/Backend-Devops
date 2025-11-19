const BaseError = require("./BaseError");

// Added for client-side errors
class BadRequestError extends BaseError {
    constructor(message, field) {
        super(message, 404, "API Error");
        this.field = field    //Optional field
    }
}

module.exports = BadRequestError;