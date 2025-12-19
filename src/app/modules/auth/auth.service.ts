import AppError from "../../errorHelpers/AppError";
import type userInterface = require("../user/user.interface");
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


const credentialsLogin = async(payload: Partial<userInterface.IUser>)=>{
    const { email, password } = payload;

    const isUserExist = await userModel.User.findOne({ email })
    
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }

    const isPsswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)
    
    if(!isPsswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email: isUserExist.email,
    //     role: isUserExist.role
    // }

    // const accessToken = jwts.generateToken(jwtPayload, env.envVars.JWT_ACCESS_SECRET, env.envVars.JWT_ACCESS_EXPIRES)

    // const refreshToken = jwts.generateToken(jwtPayload, env.envVars.JWT_REFRESH_SECRET, env.envVars.JWT_REFRESH_EXPIRES)

    const userTokens= userToken.createUserTokens(isUserExist)

    const {password: pass, ...rest} = isUserExist.toObject()

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }
}

const getNewAccessToken = async(refreshToken: string)=>{
    const verifiedRefreshToken = jwts.verifyToken(refreshToken, env.envVars.JWT_REFRESH_SECRET) as jsonwebtoken.JwtPayload

    const isUserExist = await userModel.User.findOne({ email: verifiedRefreshToken.email })
    
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
    }
    if(!isUserExist.isActive === IsActive.BLOCKED || !isUserExist.isActive === IsActive.INACTIVE){
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if(!isUserExist.isDeleted === IsActive.isDeleted){
        throw new AppError(httpStatus.BAD_REQUEST, "User is Deleted")
    } 

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = jwts.generateToken(jwtPayload, env.envVars.JWT_ACCESS_SECRET, env.envVars.JWT_ACCESS_EXPIRES)

    return {
        accessToken
    }
}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken
}