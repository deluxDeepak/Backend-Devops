const BaseError = require("./BaseError");

class UnuthorizedError extends BaseError {
    constructor(message, field) {
        super(message, 400, "UnuthorizedError");
        this.field = field; //OPtional Feild

    }
}
module.exports = UnuthorizedError