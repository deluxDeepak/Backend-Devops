const BaseError = require("./BaseError");

class NotFoundError extends BaseError {
    constructor(message, field) {
        super(message, 400, "NotFoundError");
        this.field = field; //OPtional Feild

    }
}
module.exports = NotFoundError