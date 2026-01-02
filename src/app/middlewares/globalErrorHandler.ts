import { Request, Response, NextFunction } from "express";
import env = require("../config/env")
import AppError from "../errorHelpers/AppError";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction)=> {
    
    /**
     * Mongoose
     * zod
     */

    /**
     * Mongoose
     * - duplicate
     * - cast error
     * - validation
     */

    const errorSources: any = []

    let statusCode = 500
    let message = `Something went wrong!!`

    //Duplicate error
    if(err.code === 11000){
        console.log("Duplicate error", err.message);
        const duplicate = err.message.match(/"([^"]*)"/)
        statusCode = 400;
        message = `${duplicate[1]} already exists!!`
    }
    //Object ID error / Cast Error
    else if(err.name === "CastError"){
        statusCode = 400;
        message = "Invalid MongoDB ObjectID. Please provide a valid id"
    }

    else if(err.name === "ZodError"){
        statusCode = 400;
        message= "Zod Error"

        console.log(err.issues);
        err.issues.forEach((issue: any)=>{
            errorSources.push({
                path: issue.path[issue.path.length-1],
                //path: "nickname inside lastname inside name"
                message: issue.message
            })
        })
    }

    //Mongoose validation error
    else if(err.name === "ValidationError"){
        statusCode = 400;
        const errors = Object.values(err.errors)

        errors.forEach((errorObject: any)=> errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }))

        message = "Validation Error"
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
        err, 
        stack: env.envVars.NODE_ENV === "development" ? null : err.stack
    })
}