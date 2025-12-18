import AppError from "../../errorHelpers/AppError";
import type userInterface = require("../user/user.interface");
import httpStatus from "http-status-codes";
import userModel = require("../user/user.model");
import bcryptjs from "bcryptjs";
import jwts = require("../../utils/jwt");
import env = require("../../config/env");
import userToken = require("../../utils/userToken");


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

    const {password: pass, ...rest} = isUserExist

    return {
        accessToken:userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }

}

export const AuthServices = {
    credentialsLogin
}