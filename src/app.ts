import cors from "cors";
import express from "express";
import { Request, Response, NextFunction } from "express";
import routes = require("./app/routes");
import env = require("./app/config/env");
import globalErrorHandler = require("./app/middlewares/globalErrorHandler");
import notFound from  "./app/middlewares/notFound";
import cookieParser from "cookie-parser"
import expressSession from "express-session";
import passport from "passport";
import "./app/config/passport";

const app = express();

app.use(expressSession({
    secret: "Your secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json());
app.use(cors())

app.use("/api/v1", routes.router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to tour management system backend"
    });
});

app.use(globalErrorHandler.globalErrorHandler)

app.use(notFound)

export default app;
