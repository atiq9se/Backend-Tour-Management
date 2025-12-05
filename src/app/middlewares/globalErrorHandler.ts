import { Request, Response, NextFunction } from "express";
import env = require("../config/env")
import AppError from "../errorHelpers/AppError";


export const globalErrorHandler = (err: any, req: e.Request, res: Response, next: NextFunction)=> {
    let statusCode = 500
    let message = `Something went wrong!!`

    if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    }else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        err, 
        stack: env.envVars.NODE_ENV === "development" ? null : err.stack
    })
}