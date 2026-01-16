import { type Request, type Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { BookingService } from "./booking.service.js";

const createBooking = catchAsync(async(req: Request, res: Response)=> {
    const decodeToken = req.user as JwtPayload
    const booking = await BookingService.createBooking(req.body, decodeToken.userId);
    sendResponse(res, {
        statusCode: 501,
        success: true,
        message: "Booking created successfully",
        data: booking,
    });
})

const getAllBookings = catchAsync(async(req: Request, res: Response)=> {
    const bookings = await BookingService.getAllBookings();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrived successfull",
        data: bookings
    })
})

const getUserBookings = catchAsync(async (req: Request, res: Response)=> {
    const bookings = await BookingService.getUserBookings();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrived successfully",
        data: bookings,

    })
})

const getSingleBooking = catchAsync(async(req: Request, res: Response)=>{
    const booking = await BookingService.getBookingById();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking retrived successfully",
        data: booking
    })
})


const updateBookingStatus = catchAsync(async(req: Request, res: Response)=> {
    const updated = await BookingService.updateBookingStatus();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking Status Updated Successfully",
        data: updated,
    })
})

export const BookingController = {
    createBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus,
    getSingleBooking
};
