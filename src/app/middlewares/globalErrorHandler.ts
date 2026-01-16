import { type Request, type Response, type NextFunction } from "express";
import { envVars } from "../config/env.js";
import AppError from "../errorHelpers/AppError.js";
import { handlerDuplicateError } from "../helpers/handleDuplicateError.js";
import { handlerCastError } from "../helpers/handleCastError.js";
import { handlerZodError } from "../helpers/handleZodError.js";
import { handlerValidationError } from "../helpers/handleValidationError.js";
import { type TErrorSources } from "../interfaces/error.types.js";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
        console.log(err)
    }

    let errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = `Something went wrong!!`

    //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    //Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = handlerCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }

    //ZOD Error
    else if (err.name === "ZodError") {
        const simplifiedError = handlerZodError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }

    //Mongoose validation error
    else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message;
    }

    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}