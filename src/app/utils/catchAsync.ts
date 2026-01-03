import { Request, Response, NextFunction } from "express";
import envVars = require("../config/env");

type AsyncHandler = (req: Request, res: Response, next: NextFunction)=> Promise<void>

export const catchAsync = (fn: AsyncHandler)=> (req: Request, res: Response, next: NextFunction)=>{
    Promise.resolve(fn(req, res, next)).catch((err: any)=>{
        if(env.envVars.NODE_ENV === "development"){
                console.log(err)
            }
        next(err)
    })
}

