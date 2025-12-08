import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import userService = require("./user.service");
import AppError from "../../errorHelpers/AppError";
import UserServices = require("./user.service");
import catchAsync = require("../../utils/catchAsync");



const createUser = catchAsync.catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const user = await userService.UserServices.createUser(req.body)
    res.status(httpStatus.CREATED).json({
        message: "User Created Success Fully",
        user
    })
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
    
        const users = await userService.UserServices.getAllUsers();
        res.status(httpStatus.OK).json({
            success: true,
            message: "all users retrived successfully",
            data: users
        })
}) 
    





export const UserControllers = {
    createUser,
    getAllUsers
}