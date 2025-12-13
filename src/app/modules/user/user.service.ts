import type jsonwebtoken = require("jsonwebtoken");
import env = require("../../config/env");
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";

import { JwtPayload } from "jsonwebtoken";
import envVars = require("../../config/env");

import userInterface = require("./user.interface");

const createUser = async (payload: Partial<IUser>)=> {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }
    
    const hashPassword = await bcryptjs.hash(password as string, Number(env.envVars.BCRYPT_SALT_ROUND))

    const authProvider : IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
            email,
            password: hashPassword,
            auths: [authProvider],
            ...rest
    })
        return user;
}

const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken: JwtPayload)=>{
    const userExist = await User.findById(userId);

    if(!userExist){
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if(payload.role){
        if(decodedToken.role === userInterface.Role.USER || decodedToken.role === userInterface.Role.GUIDE){
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }

        if(payload.role === userInterface.Role.SUPER_ADMIN &&  decodedToken.role === userInterface.Role.ADMIN){
            throw new AppError(httpStatus.FORBIDDEN, "You are not Authorized")
        }
    }

    if(payload.isActive || payload.isDeleted || payload.isVerified){
        if(decodedToken.role === userInterface.Role.USER || decodedToken.role === userInterface.Role.GUIDE){
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }

    if(payload.password){
        payload.password = await bcryptjs.hash(payload.password, env.envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdateUser;


}

const getAllUsers = async() => {
    const users = await User.find({});

    const totalUsers = await User.countDocuments()

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}



export const UserServices = {
    createUser,
    getAllUsers,
    updateUser
}