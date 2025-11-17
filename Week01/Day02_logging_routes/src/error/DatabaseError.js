const BaseError = require("./BaseError");

class DatabaseError extends BaseError {
    constructor(message, field) {
        super(message, 400, "DatabaseError");
        this.field = field; //OPtional Feild

    }
}
module.exports = DatabaseError