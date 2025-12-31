import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import checkAuth = require("../../middlewares/checkAuth");
import userInterface = require("../user/user.interface");
import passport = require("passport");
import { Request, Response, NextFunction } from "express";
import env = require("../../config/env");

const router = Router();

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logout)
router.post("/reset-password", checkAuth.checkAuth(...Object.values(userInterface.Role)) as any, AuthControllers.resetPassword)

// /booking-> login-> succesful google login->/booking frontend
// /login-> succesful google login -> frontend
router.get("/google", async (req: Request, res: Response, next: NextFunciton) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

// api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport.authenticate("google", { 
    failureRedirect: `${env.envVars.FRONTEND_URL}/login`
}), AuthControllers.googleCallbackController)

export const AuthRoutes = router;
