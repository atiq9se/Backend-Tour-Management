import env = require("../config/env");
import type userInterface = require("../modules/user/user.interface");
import jwts = require("../utils/jwt");

export const createUserTokens = (user: Partial<userInterface.IUser>)=>{
    
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = jwts.generateToken(jwtPayload, env.envVars.JWT_ACCESS_SECRET, env.envVars.JWT_ACCESS_EXPIRES)

    const refreshToken = jwts.generateToken(jwtPayload, env.envVars.JWT_REFRESH_SECRET, env.envVars.JWT_REFRESH_EXPIRES)

    return{
        accessToken,
        refreshToken
    }
}