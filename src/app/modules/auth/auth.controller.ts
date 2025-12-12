import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";

import { AuthServices } from "./auth.service";
import catchAsync = require("../../utils/catchAsync");
import sendResponse = require("../../utils/sendResponse");

const credentialsLogin = catchAsync.catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);

  sendResponse.sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User login successfully",
    data: loginInfo,
  });
});

export const AuthControllers = {
  credentialsLogin,
};
