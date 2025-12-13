import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import userService = require("./user.service");
import sendResponse = require("../../utils/sendResponse");
import { catchAsync } from "../../utils/catchAsync";
import jwt = require("../../utils/jwt");
import env = require("../../config/env");
import type jsonwebtoken = require("jsonwebtoken");



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const user = await userService.UserServices.createUser(req.body)

    sendResponse.sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
    })

    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Success Fully",
    //     user
    // })
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{

    const userId = req.params.id;
    const token = req.headers.authorization
    const verifiedToken = jwt.verifyToken(token as string, env.envVars.JWT_ACCESS_SECRET) as jsonwebtoken.JwtPayload
    const payload = req.body;

    const user = await userService.UserServices.updateUser(userId, payload, verifiedToken)

    sendResponse.sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User updated Successfully",
        data: user,
    })

    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Success Fully",
    //     user
    // })
})

// const createUser = async(req: Request, res: Response, next: NextFunction) => {
//     try{
//         // throw new Error("Fake error normal")
//         // throw new AppError(httpStatus.BAD_REQUEST, "FAKE ERROR")

//        const user = await userService.UserServices.createUser(req.body)

//         res.status(httpStatus.CREATED).json({
//             message: "User Created Success Fully",
//             user
//         })
//     } catch (err: any){
//         console.log(err);
//         next(err);
//     }
// }

// const getAllUsers = async (req: Request, res: Response, next: NextFunction)=>{
//     try{
//         const users = await userService.UserServices.getAllUsers();
//         return users;
//     }catch(err:any){
//         console.log(err)
//         next(err)
//     }
// }

const getAllUsers = catchAsync( async (req: Request, res: Response, next: NextFunction)=>{
    
        const result = await userService.UserServices.getAllUsers();

        sendResponse.sendResponse(res,{
            success: true,
            statusCode: httpStatus.CREATED,
            message: "All user retrived Successfully",
            data: result.data,
            meta: result.meta
        })

        // res.status(httpStatus.OK).json({
        //     success: true,
        //     message: "all users retrived successfully",
        //     data: users
        // })
}) 
    





export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser
}