import type { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validateRequest = (zodSchema: ZodObject<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            req.body = await zodSchema.parseAsync(req.body)
            next()
        } catch (error) {
            next(error)
        }

    }