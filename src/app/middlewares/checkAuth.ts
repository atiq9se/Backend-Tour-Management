import { NextFunction, Response, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import jwt = require("../utils/jwt");
import env = require("../config/env");
import userModel = require("../modules/user/user.model");
import httpStatus from "http-status-codes";
import IsActive = require("../modules/user/user.interface");

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No Token Recieved")
        }

        const verifiedToken = jwt.verifyToken(accessToken, env.envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExist = await userModel.User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
        }
        if (!isUserExist.isActive === IsActive.BLOCKED || !isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }
        if (!isUserExist.isDeleted === IsActive.isDeleted) {
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