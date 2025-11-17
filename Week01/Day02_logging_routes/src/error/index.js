// Export all the error at one place 

const ApiError = require("./ApiError");
const DatabaseError = require("./DatabaseError");
const ForbiddenError = require("./ForbiddenError");
const NotFoundError = require("./NotfoundError");
const UnuthorizedError = require("./UnuthorizedError");
const ValidationError = require("./ValidationError");

module.exports={
    ValidationError,
    NotFoundError,
    ApiError,
    ForbiddenError,
    UnuthorizedError,
    DatabaseError
}