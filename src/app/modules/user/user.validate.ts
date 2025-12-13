import z from "zod";
import userInterface from "./user.interface";
import Role = require("./user.interface");
import IsActive = require("./user.interface");

export const createUserZodSchema = z.object({
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

 export const updateUserZodSchema = z.object({
        name: z
            .string({ invalid_type_error: "Name must be string" })
            .min(2, {message: "Name must be at least 2 characters long"})
            .max(50, {message: "Name cannot exceed 50 characters" })
            .optional(),

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
            })
            .optional(),
        phone: z
            .string({ invalid_type_error: "Email must be string"})
            .regex(/^(?:\+8801\d{9}|01\d{9})$/,{
                message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxxx",
            })
            .optional(),

        role: z
             .enum(Object.values(Role) as [string])
             .optional(),

        IsActive : z
            .enum(Object.keys(IsActive) as [string])
            .optional(),

        isDeleted: z
            .boolean({ invalid_type_error: "isDeleted nust be true or false"})
            .optional(),

            
        isVerified: z
            .boolean({ invalid_type_error: "isDeleted nust be true or false"})
            .optional(),

        address: z
            .string({ invalid_type_error: "Email must be string"})
            .max(100, { message: "Email cannot exceed 100 characters."})
            .optional()
     })