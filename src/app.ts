import cors from "cors";
import express from "express";
import { type Request, type Response, type NextFunction } from "express";
import { router } from "./app/routes/index.js";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler.js";
import notFound from "./app/middlewares/notFound.js";
import cookieParser from "cookie-parser"
import expressSession from "express-session";
import passport from "passport";
import "./app/config/passport.js";

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

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to tour management system backend"
    });
});

app.use(globalErrorHandler)

app.use(notFound)

export default app;
