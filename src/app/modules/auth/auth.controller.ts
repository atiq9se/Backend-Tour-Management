import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";

import catchAsync = require("../../utils/catchAsync");
import sendResponse = require("../../utils/sendResponse");
import authService = require("./auth.service");

const credentialsLogin = catchAsync.catchAsync(async (req: Request, res: Response, next: NextFunction)=>{

    const loginInfo = await authService.AuthServices.credentialsLogin(req.body)

    sendResponse.sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User login in successfully",
        data: loginInfo,
    })

})

export const AuthControllers = {
    credentialsLogin
}