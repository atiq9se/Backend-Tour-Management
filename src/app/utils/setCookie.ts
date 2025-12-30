import type { Request, Response, NextFunction } from "express";

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}
import env = require("../config/env");

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    const cookieOptions = {
        httpOnly: true,
        secure: env.envVars.NODE_ENV === 'production',
        sameSite: env.envVars.NODE_ENV === 'production' ? 'none' : 'lax' as 'none' | 'lax' | 'strict',
    };

    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, cookieOptions)
    }

    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, cookieOptions)
    }
}