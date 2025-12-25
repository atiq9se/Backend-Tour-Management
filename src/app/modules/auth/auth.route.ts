import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import checkAuth = require("../../middlewares/checkAuth");
import userInterface = require("../user/user.interface");

const router = Router();

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logout)
router.post("/reset-password", checkAuth.checkAuth(...Object.values(userInterface.Role)) as any, AuthControllers.resetPassword)

export const AuthRoutes = router;
