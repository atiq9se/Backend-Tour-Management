import cors from "cors";
import express, { Request, Response } from "express";
import routes = require("./app/routes");


const app = express();

app.use(express.json());
app.use(cors())

app.use("/api/v1", routes.router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to tour management system backend"
    });
});

export default app;
