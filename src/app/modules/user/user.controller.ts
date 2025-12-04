import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import userService = require("./user.service");

const createUser = async(req: Request, res: Response, next: NextFunction) => {
    try{
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