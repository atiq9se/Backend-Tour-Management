import AppError from "../../errorHelpers/AppError";
import type userInterface = require("../user/user.interface");
import httpStatus from "http-status-codes";
import userModel = require("../user/user.model");
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


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

    const accessToken = jwt.sign(jwtPayload, "secret", {
        expiresIn: "2s"
    })

    return {
        accessToken
    }

}

export const AuthServices = {
    credentialsLogin
}