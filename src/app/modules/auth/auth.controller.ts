import type { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";

import { AuthServices } from "./auth.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import AppError from "../../errorHelpers/AppError.js";
import { setAuthCookie } from "../../utils/setCookie.js";
import * as userToken from "../../utils/userToken.js";
import { envVars } from "../../config/env.js";
import type jsonwebtoken from "jsonwebtoken";
import passport from "passport";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // const loginInfo = await AuthServices.credentialsLogin(req.body);

  passport.authenticate("local", async (err: any, user: any, info: any) => {
    if (err) {
      // return next(err)
      return next(new AppError(401, err))
    }
    if (!user) {
      return next(new AppError(401, info.message))
    }

    const userTokens = await userToken.createUserTokens(user)


    const { password: pass, ...rest } = user.toObject()

    setAuthCookie(res, userTokens)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User login successfully",
      data: {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken
      }
    });
  })(req, res, next);
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "No refresh token recieved from cookies")
  }

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User login successfully",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User logout successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

  await AuthServices.resetPassword(oldPassword as string, newPassword as string, decodedToken as jsonwebtoken.JwtPayload)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Password change succefully",
    data: null,
  });
});

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  let redirectTo = req.query.state ? req.query.state as string : ""

  if (redirectTo.startsWith("/")) {
    redirectTo = redirectTo.slice(1)
  }


  const user = req.user as any;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found")
  }
  const tokenInfo = userToken.createUserTokens(user)
  setAuthCookie(res, tokenInfo)

  res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
});



export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
  logout,
  googleCallbackController
};
