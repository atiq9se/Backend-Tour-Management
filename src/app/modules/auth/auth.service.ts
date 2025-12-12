import AppError from "../../errorHelpers/AppError";
import type userInterface = require("../user/user.interface");
import httpStatus from "http-status-codes";
import userModel = require("../user/user.model");
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import jwt = require("../../utils/jwt");
import generateToken = require("../../utils/jwt");
import env = require("../../config/env");
import envVars = require("../../config/env");


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

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, env.envVars.JWT_ACCESS_SECRET, env.envVars.JWT_ACCESS_EXPIRES)

    return {
        accessToken
    }

}

export const AuthServices = {
    credentialsLogin
}