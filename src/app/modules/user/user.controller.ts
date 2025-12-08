import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import userService = require("./user.service");
import AppError from "../../errorHelpers/AppError";
import UserServices = require("./user.service");

type AsyncHandler = (req: Request, res: Response, next: NextFunction)=> Promise<void>

const catchAsync = (fn: AsyncHandler)=> (req: Request, res: Response, next: NextFunction)=>{
    Promise.resolve(fn(req, res, next)).catch((err: any)=>{
        console.log(err);
        next(err)
    })
}

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
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

const getAllUsers = async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const users = await userService.UserServices.getAllUsers();
        return users;
    }catch(err:any){
        console.log(err)
        next(err)
    }
}


export const UserControllers = {
    createUser,
    getAllUsers
}