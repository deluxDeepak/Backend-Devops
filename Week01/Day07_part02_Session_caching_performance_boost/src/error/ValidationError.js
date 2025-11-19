const BaseError = require("./BaseError");

class ValidationError extends BaseError {
    constructor(message, sucess) {
        super(message, 400, "ValidationError");
        this.sucess = sucess;

    }
}

module.exports = ValidationError;