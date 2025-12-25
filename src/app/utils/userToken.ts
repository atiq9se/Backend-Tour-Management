import env = require("../config/env");
import { IUser } from "../modules/user/user.interface";
import userModel = require("../modules/user/user.model");
import jwts = require("../utils/jwt");
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import IsActive = require("../modules/user/user.interface");
import type jsonwebtoken = require("jsonwebtoken");

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = jwts.generateToken(jwtPayload, env.envVars.JWT_ACCESS_SECRET, env.envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = jwts.generateToken(jwtPayload, env.envVars.JWT_REFRESH_SECRET, env.envVars.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwts.verifyToken(refreshToken, env.envVars.JWT_REFRESH_SECRET) as jsonwebtoken.JwtPayload

    const isUserExist = await userModel.User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }
    if (!isUserExist.isActive === IsActive.BLOCKED || !isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (!isUserExist.isDeleted === IsActive.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = jwts.generateToken(jwtPayload, env.envVars.JWT_ACCESS_SECRET, env.envVars.JWT_ACCESS_EXPIRES)

    return accessToken
}