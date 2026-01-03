import mongoose = require("mongoose")
import type errorTypes = require("../interfaces/error.types")

export const handlerCastError = (err: mongoose.Error.CastError): errorTypes.TGenericErrorResponse=> {
    return{
        statusCode : 400,
        message : "Invalid MongoDB ObjectID. Please provide a valid id"
    }
}