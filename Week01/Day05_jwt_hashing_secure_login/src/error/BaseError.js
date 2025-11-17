class BaseError extends Error {
    constructor(message, statusCode, name = "Error") {
        super(message);
        this.statusCode=statusCode;
        this.name=name;
    }
}
module.exports=BaseError;