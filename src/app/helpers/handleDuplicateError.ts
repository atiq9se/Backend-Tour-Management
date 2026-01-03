import type errorTypes = require("../interfaces/error.types")

export const handlerDuplicateError = (err: any): errorTypes.TGenericErrorResponse=>{
    const matchedArray = err.message.match(/"([^"]*)"/)

    return {
        statusCode: 400,
        message : `${matchedArray[1]} already exists!!`
    }
}