import { Request, Response, NextFunction } from "express";
import env = require("../config/env")


export const globalErrorHandler = (err: any, req: e.Request, res: Response, next: NextFunction)=> {
    const statusCode = 500
    const message = `Something went wrong!! ${err.message}`

    res.status(statusCode).json({
        success: false,
        message,
        err, 
        stack: env.envVars.NODE_ENV === "development" ? null : err.stack
    })
}