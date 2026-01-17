import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { User } from "../user/user.model.js"
import { BOOKING_STATUS, type IBooking } from "./booking.interface.js"
import { Tour } from "../tour/tour.model.js";
import { PAYMENT_STATUS } from "../payment/payment.interface.js";
import { Booking } from "./booking.model.js";
import { Payment } from "../payment/payment.model.js";

const getTransactionId = ()=> {
    return `tran_${Date.now()}_${Math.floor(Math.random() *1000)}`
}

/**
 * Duplicate db collection/ replica
 * replica db -> [ create boooking -> create payment -> update booking -> error]-> real db
 * 
 */

const createBooking = async (payload: Partial<IBooking>, userId: string) =>{
    const transactionId = getTransactionId();

    console.log(payload)

    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId);

        if(!user?.phone || !user.address){
            throw new AppError(httpStatus.BAD_REQUEST, "Please update your phone and address before making a booking.")
        }

        const tour = await Tour.findById(payload.tour).select("costFrom");

        if(!tour?.costFrom){
            throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found")
        }

        const amount = Number(tour.costFrom) * Number( payload.guestCount!)

        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING, 
            ...payload
        }], { session })

        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId: transactionId,
            amount: amount
        }], { session })

        const updatedBooking = await Booking
            .findByIdAndUpdate(
                booking[0]._id,
                {payment: payment[0]._id},
                { new: true, runValidators: true, session }
            )
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment")
        await session.commitTransaction();
        session.endSession();
        return updatedBooking
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }

}

const getUserBookings = async () =>{
    return{}
}

const getBookingById = async () => {
    return {}
}

const updateBookingStatus = async ()=> {
    return {}
}

const getAllBookings = async () => {
    return {}
}

export const BookingService = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getBookingById,
    updateBookingStatus
};