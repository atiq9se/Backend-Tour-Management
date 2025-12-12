import { Router, NextFunction,Response, Request } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validate";
import { validateRequest} from "../../middlewares/validateRequest";
import jwt from "jsonwebtoken";
import AppError = require("../../errorHelpers/AppError");

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser)

router.get("/all-users", async(req: Request, res: Response, next: NextFunction)=>{
try{
    const accessToken = req.headers.authorization;

    if(!accessToken){
        throw new AppError(403, "No Token Recieved")
    }

    const verifiedToken = jwt.verify(accessToken as string, "secret")

    // if(!verifiedToken){
    //     throw new AppError(403, "You are not authorized")
    // }

    if(verifiedToken.role !== Role.ADMIN || Role.SUPER_ADMIN){
        throw new AppError(403, "you are non permitted to view all users")
    }
    console.log(verifiedToken)
    next()

} catch(error){
    console.log(error)
    next(error)
}
    

}, UserControllers.getAllUsers)

export const UserRoutes = router
