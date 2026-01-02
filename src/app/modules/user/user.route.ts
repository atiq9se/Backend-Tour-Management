import { Router, NextFunction, Response, Request } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validate";
import { validateRequest} from "../../middlewares/validateRequest";
import checkAuth = require("../../middlewares/checkAuth");
import userInterface = require("./user.interface");


const router = Router();

router.post("/register", 
    validateRequest(createUserZodSchema), 
    UserControllers.createUser)

router.get("/all-users", checkAuth.checkAuth( userInterface.Role.ADMIN, userInterface.Role.SUPER_ADMIN), UserControllers.getAllUsers)

router.patch("/:id", checkAuth.checkAuth(...Object.values(userInterface.Role)), UserControllers.updateUser)
export const UserRoutes = router
