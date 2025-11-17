const BaseError = require("./BaseError");

class ValidationError extends BaseError {
    constructor(message, field) {
        super(message, 400, "ValidationError");
        this.field = field    //Optional field
    }
}

module.exports = ValidationError;