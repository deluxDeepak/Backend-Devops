const BaseError = require("./BaseError");

class ForbiddenError extends BaseError {
    constructor(message, field) {
        super(message, 400, "ForbiddenError");
        this.field = field; //OPtional Feild

    }
}
module.exports = ForbiddenError