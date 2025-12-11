import{ Router } from "express";
import authController = require("./auth.controller");

const router = Router();

router.post("/login", authController.AuthControllers.credentialsLogin)

export const AuthRoutes = router;
