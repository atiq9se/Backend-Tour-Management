import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";

import { AuthServices } from "./auth.service";
import catchAsync = require("../../utils/catchAsync");
import sendResponse = require("../../utils/sendResponse");
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/setCookie";
import userToken = require("../../utils/userToken");
import env = require("../../config/env");
import type jsonwebtoken = require("jsonwebtoken");

const credentialsLogin = catchAsync.catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const loginInfo = await AuthServices.credentialsLogin(req.body);

  setAuthCookie(res, loginInfo)

  sendResponse.sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User login successfully",
    data: loginInfo,
  });
});

const getNewAccessToken = catchAsync.catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
  }

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

  setAuthCookie(res, tokenInfo);

  sendResponse.sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User login successfully",
    data: tokenInfo,
  });
});

const logout = catchAsync.catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  })

  sendResponse.sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User logout successfully",
    data: null,
  });
});

const resetPassword = catchAsync.catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

  await AuthServices.resetPassword(oldPassword as string, newPassword as string, decodedToken as jsonwebtoken.JwtPayload)

  sendResponse.sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Password change succefully",
    data: null,
  });
});

const googleCallbackController = catchAsync.catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const user = req.user as any;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found")
  }
  const tokenInfo = userToken.createUserTokens(user)
  setAuthCookie(res, tokenInfo)

  res.redirect(env.envVars.FRONTEND_URL)
});



export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
  logout,
  googleCallbackController
};
