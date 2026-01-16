import type { NextFunction, Response, Request } from "express";
import { type JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import { envVars } from "../config/env.js";
import { User } from "../modules/user/user.model.js";
import httpStatus from "http-status-codes";
import { IsActive } from "../modules/user/user.interface.js";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No Token Recieved")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
        }
        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }
        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted")
        }


        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route")
        }

        req.user = verifiedToken

        next()

    } catch (error) {
        next(error)
    }
}