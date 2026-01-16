import { Server } from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin.js";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect("mongodb+srv://atiq9se_db_user:nmxlKB9oFBHPNbuJ@cluster0.jaby5lr.mongodb.net/tour-db");
        console.log("connected to DB");

        server = app.listen(5000, () => {
            console.log("Server is listening on port 5000");
        });
    } catch (error) {
        console.log(error);
    }
};

(async () => {
    await startServer();
    await seedSuperAdmin()
})()

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection detected:", err);
    console.log("Server shutting down...");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit(1)
})

process.on("uncaughtException", () => {
    console.log("Unhandled Rejection detected... Server shutting down...");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit()
})


process.on("SIGTERM", () => {
    console.log("SIGTERM signal recieved... Server shutting down...");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit()
})

process.on("SIGINT", () => {
    console.log("SIGINT signal recieved... Server shutting down...");

    if (server) {
        server.close(() => {
            process.exit(1)
        });
    }

    process.exit()
})


// unhandle rejection error
// Promise.reject(new Error("I forgot to catch this promise"))

// uncaught exception error
// throw new Error("I forgot to handle this local error")
