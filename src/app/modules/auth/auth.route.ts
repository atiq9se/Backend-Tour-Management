import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import checkAuth = require("../../middlewares/checkAuth");
import userInterface = require("../user/user.interface");
import passport = require("passport");
import { Request, Response, NextFunction } from "express";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logout)
router.post("/reset-password", checkAuth.checkAuth(...Object.values(userInterface.Role)) as any, AuthControllers.resetPassword)
router.get("/google", async (req: Request, res: Response, next: NextFunciton) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next)
})
import env = require("../../config/env");

router.get("/google/callback", passport.authenticate("google", { 
    failureRedirect: `${env.envVars.FRONTEND_URL}/login`
}), AuthControllers.googleCallbackController)

export const AuthRoutes = router;
