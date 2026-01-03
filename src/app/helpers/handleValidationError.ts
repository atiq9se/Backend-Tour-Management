import mongoose = require("mongoose")
import type errorTypes = require("../interfaces/error.types")
import {TErrorSources} from "../interfaces/error.types"

export const handlerValidationError = (err: mongoose.Error.ValidationError): errorTypes.TGenericErrorResponse => {
    const errorSources: TErrorSources[] = []
    const errors = Object.values(err.errors)

    errors.forEach((errorObject: any)=> errorSources.push({
        path: errorObject.path,
        message: errorObject.message
    }))

    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources
    }
}