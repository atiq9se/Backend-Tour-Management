import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import userService = require("./user.service");
import AppError from "../../errorHelpers/AppError";

const createUser = async(req: Request, res: Response, next: NextFunction) => {
    try{
        // throw new Error("Fake error normal")
        // throw new AppError(httpStatus.BAD_REQUEST, "FAKE ERROR")

       const user = await userService.UserServices.createUser(req.body)

        res.status(httpStatus.CREATED).json({
            message: "User Created Success Fully",
            user
        })
    } catch (err: any){
        console.log(err);
        next(err);
    }
}


export const UserControllers = {
    createUser
}