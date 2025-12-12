import { Router, NextFunction,Response, Request } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validate";
import { validateRequest} from "../../middlewares/validateRequest";
import jwt from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import userInterface = require("./user.interface");
import type JwtPayload = require("jsonwebtoken");
import jwt = require("../../utils/jwt");
import env = require("../../config/env");

const router = Router();

const checkAuth = (...authRoles: string[]) => async(req: Request, res: Response, next: NextFunction)=>{
try{
    const accessToken = req.headers.authorization;

    if(!accessToken){
        throw new AppError(403, "No Token Recieved")
    }

    const verifiedToken = jwt.verifyToken(accessToken, env.envVars.JWT_ACCESS_SECRET)

    // if(!verifiedToken){
    //     throw new AppError(403, "You are not authorized")
    // }

    if((verifiedToken as JwtPayload).role !== userInterface.Role.ADMIN){
        throw new AppError(403, "you are non permitted to view all users")
    }
    console.log(verifiedToken)
    next()

} catch(error){
    console.log(error)
    next(error)
}
    

}

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)

router.get("/all-users", checkAuth("ADMIN", "SUPER_ADMIN"), UserControllers.getAllUsers)

export const UserRoutes = router
