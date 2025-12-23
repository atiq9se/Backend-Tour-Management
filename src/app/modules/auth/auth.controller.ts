import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";

import { AuthServices } from "./auth.service";
import catchAsync = require("../../utils/catchAsync");
import sendResponse = require("../../utils/sendResponse");
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";

const credentialsLogin = catchAsync.catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);

  res.cookie("accessToken", loginInfo.accessToken, {
            httpOnly: true,
            secure: false,
 })

  res.cookie("refreshToken", loginInfo.refreshToken, {
            httpOnly: true,
            secure: false,
 })

  // setAuthCookie(res, loginInfo)

  sendResponse.sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User login successfully",
    data: loginInfo,
  });
});

const getNewAccessToken = catchAsync.catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
  }

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

  // setAuthCookie(res, tokenInfo);

  sendResponse.sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User login successfully",
    data: tokenInfo,
  });
});

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken
};
