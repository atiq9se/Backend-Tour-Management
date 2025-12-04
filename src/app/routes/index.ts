import { Router } from "express";
import userRoute = require("../modules/user/user.route");


export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoute.UserRoutes
    },
]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})

