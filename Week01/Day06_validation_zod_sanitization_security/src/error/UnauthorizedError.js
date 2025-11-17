const BaseError = require("./BaseError");

class UnauthorizedError extends BaseError {
    constructor(message, field) {
        // 401 is the correct HTTP status code for unauthorized access
        super(message, 401, "UnauthorizedError");
        this.field = field    //Optional field
    }
}

module.exports = UnauthorizedError;