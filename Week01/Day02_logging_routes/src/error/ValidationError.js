const BaseError = require("./BaseError");

class ValidationError extends BaseError {
    constructor(message, field) {
        super(message, 400, "ValidationError");
        this.field = field; //OPtional Feild

    }
}
module.exports = ValidationError
