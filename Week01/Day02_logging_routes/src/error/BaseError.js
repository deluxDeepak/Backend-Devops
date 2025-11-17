// One Base error for all the error All the error are children of this error 

class BaseError extends Error {
    constructor(message, statusCode, name = "Error") {
        super(message)
        this.statusCode = statusCode;
        this.name = name;
    }
}

// AS default error kam karta hai 
module.exports = BaseError