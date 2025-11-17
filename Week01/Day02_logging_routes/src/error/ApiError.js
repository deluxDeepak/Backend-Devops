const BaseError = require("./BaseError");

class ApiError extends BaseError {
    constructor(message, field) {
        super(message, 400, "ApiError");
        this.field = field; //OPtional Feild

    }
}
module.exports = ApiError