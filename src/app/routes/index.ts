import { Router } from "express";
import userRoute = require("../modules/user/user.route");
import authRoute = require("../modules/auth/auth.route");


export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoute.UserRoutes
    },
    {
        path: "/auth",
        route: authRoute.AuthRoutes
    },
]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})

