import express from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { Role } from "../user/user.interface.js"
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation.js";
import { BookingController } from "./booking.controller.js";

const router = express.Router();

//api/v1/booking
router.post("/",
   checkAuth(...Object.values(Role)),
   validateRequest(createBookingZodSchema),
   BookingController.createBooking
)

//api/v1/booking
router.get("/",
   checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
   BookingController.getAllBookings
)

//api/v1/booking/my-bookings
router.get("/my-bookings",
   checkAuth(...Object.values(Role)),
   BookingController.getUserBookings
)

//api/v1/booking/bookingId/status
router.get("/:boookingId",
   checkAuth(...Object.values(Role)),
   BookingController.getSingleBooking
)

router.patch("/:bookingId/status",
   checkAuth(...Object.values(Role)),
   validateRequest(updateBookingStatusZodSchema),
   BookingController.updateBookingStatus
)

export const BookingRoutes = router

