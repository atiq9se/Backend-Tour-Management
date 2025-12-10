import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export const validateRequest = (zodSchema: AnyZodObject) => 
    async (req: Request, res: Response, next: NextFunction)=> {
    
        try{
            console.log("old body", req.body)
            req.body = await zodSchema.parseAsync(req.body)
            console.log(" body", req.body)
            // next()
        }catch(error){
            next(error)
        }

    }