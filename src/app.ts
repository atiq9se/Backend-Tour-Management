import cors from "cors";
import express from "express";
import { Request, Response, NextFunction } from "express";
import routes = require("./app/routes");
import env = require("./app/config/env");
import globalErrorHandler = require("./app/middlewares/globalErrorHandler");




const app = express();

app.use(express.json());
app.use(cors())

app.use("/api/v1", routes.router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to tour management system backend"
    });
});

app.use(globalErrorHandler.globalErrorHandler)

export default app;
