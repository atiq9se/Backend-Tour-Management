import {NextFunction,Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import jwt = require("../utils/jwt");
import env = require("../config/env");

export const checkAuth = (...authRoles: string[]) => async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const accessToken = req.headers.authorization;

        if(!accessToken){
            throw new AppError(403, "No Token Recieved")
        }

        const verifiedToken = jwt.verifyToken(accessToken, env.envVars.JWT_ACCESS_SECRET) as JwtPayload

        if(!authRoles.includes(verifiedToken.role)){
            throw new AppError(403, "You are not permitted to view this route")
        }

        next()

    } catch(error){
            next(error)
        }
}