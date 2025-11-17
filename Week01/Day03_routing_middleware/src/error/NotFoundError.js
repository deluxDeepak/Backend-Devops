const BaseError = require("./BaseError");

class NotFoundError extends BaseError {
    constructor(message, field) {
        super(message, 400, "NotFoundError");
        this.field = field    //Optional field
    }
}

module.exports = NotFoundError;