const BaseError = require("./BaseError");

class ApiError extends BaseError {
    constructor(message, field) {
        super(message, 400, "API Error");
        this.field = field    //Optional field
    }
}

module.exports = ApiError;