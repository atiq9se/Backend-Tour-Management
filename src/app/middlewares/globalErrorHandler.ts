import { Request, Response, NextFunction } from "express";
import env = require("../config/env")
import AppError from "../errorHelpers/AppError";
import {handlerDuplicateError} from "../helpers/handleDuplicateError";
import {handlerCastError} from "../helpers/handleCastError";
import {handlerZodError} from "../helpers/handleZodError";
import {handlerValidationError} from "../helpers/handleValidationError";
import {TErrorSources } from "../interfaces/error.types";
import envVars = require("../config/env");

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction)=> {
    if(env.envVars.NODE_ENV === "development"){
        console.log(err)
    }

    let errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = `Something went wrong!!`

    //Duplicate error
    if(err.code === 11000){
        const simplifiedError = handlerDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    //Object ID error / Cast Error
    else if(err.name === "CastError"){
        const simplifiedError = handlerCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }

    //ZOD Error
    else if(err.name === "ZodError"){
        const simplifiedError = handlerZodError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }

    //Mongoose validation error
    else if(err.name === "ValidationError"){
        const simplifiedError = handlerValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message;
    }

    else if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    }else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: env.envVars.NODE_ENV === "development" ? err: null, 
        stack: env.envVars.NODE_ENV === "development" ? err.stack : null
    })
}