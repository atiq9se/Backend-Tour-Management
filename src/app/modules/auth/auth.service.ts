import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import userModel = require("../user/user.model");
import bcryptjs from "bcryptjs";
import jwts = require("../../utils/jwt");
import env = require("../../config/env");
import userToken = require("../../utils/userToken");
import verifyToken = require("../../utils/jwt");
import envVars = require("../../config/env");
import type jsonwebtoken = require("jsonwebtoken");
import IsActive = require("../user/user.interface");
import createNewAccessTokenWithRefreshToken = require("../../utils/userToken");
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await userModel.User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPsswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPsswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const userTokens = userToken.createUserTokens(isUserExist)

    const { password: pass, ...rest } = isUserExist.toObject()

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }
}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken:JwtPayload) => {

    const user = await userModel.User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if(!isOldPasswordMatch){
        throw new AppError(httpStatus.UNAUTHORIZED, "old password does not match");
    }

    user!.password = await bcryptjs.hash(newPassword, Number(env.envVars.BCRYPT_SALT_ROUND))

    user!.save();
}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}