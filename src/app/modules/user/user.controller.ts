import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import userService = require("./user.service");

const createUser = async(req: Request, res: Response) => {
    try{
       const user = await userService.UserServices.createUser(req.body)

        res.status(httpStatus.CREATED).json({
            message: "User Created Success Fully",
            user
        })
    } catch (err: any){
        console.log(err);
        res.status(httpStatus.BAD_REQUEST).json({
            message: `Something went wrong!! ${err.message}`,

        })
    }
}


export const UserControllers = {
    createUser
}