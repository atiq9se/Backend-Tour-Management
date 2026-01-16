import { BOOKING_STATUS } from "./booking.interface.js";
import {z} from "zod";

export const createBookingZodSchema = z.object({
    tour: z.string(),
    guestCount: z.number().int().positive()
});

export const updateBookingStatusZodSchema = z.object({
    status: z.enum(Object.values(BOOKING_STATUS) as [string])
});