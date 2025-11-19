const BaseError = require("./BaseError");

class NotFoundError extends BaseError {
    constructor(message, field) {
        super(message, 404, "NotFoundError");
        this.field = field    //Optional field
    }
}

module.exports = NotFoundError;