import { Router } from "express";
import { UserControllers } from "./user.controller";
import { Request, Response, NextFunction } from "express";
import z from "zod";

const router = Router();

router.post("/register", async (req: Request, res: Response, next: NextFunction)=> {
     const createUserZodSchema = z.object({
        name: z
            .string({ invalid_type_error: "Name must be string" })
            .min(2, {message: "Name must be at least 2 characters long"})
            .max(50, {message: "Name cannot exceed 50 characters" }),
        email: z
            .string({ invalid_type_error: "Email must be string"})
            .email({ message: "Invalid email address formate."})
            .min(5, { message: "Email must be at least 5 characters long."})
            .max(100, { message: "Email cannot exceed 100 characters."}),
        password : z
            .string({ invalid_type_error: "Email must be string"})
            .min(8, { message: "Password must be at least 8 characters long."})
            .regex(/^(?=.*[A-Z])/,{
                message: "Password must contain at least 1 uppercase letter."
            })
            .regex(/^(?=.*[!@#$%^&*])/, {
                message: "Password must contain at least 1 special character.",
            })
            .regex(/^(?=.*\d)/, {
                message: "Password must contain at least 1 number.",
            }),
        phone: z
            .string({ invalid_type_error: "Email must be string"})
            .regex(/^(?:\+8801\d{9}|01\d{9})$/,{
                message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxxx",
            })
            .optional(),
        address: z
                 .string({ invalid_type_error: "Email must be string"})
                 .max(100, { message: "Email cannot exceed 100 characters."})
                 .optional()
     })
     req.body = await createUserZodSchema.parseAsync(req.body)
     console.log(req.body);
    //  next()

}, UserControllers.createUser)

router.get("/all-users", UserControllers.getAllUsers)


export const UserRoutes = router
