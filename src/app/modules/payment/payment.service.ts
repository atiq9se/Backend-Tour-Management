
import { BOOKING_STATUS } from "../booking/booking.interface.js";
import { Booking } from "../booking/booking.model.js";
import { PAYMENT_STATUS } from "./payment.interface.js";
import { Payment } from "./payment.model.js";

const successPayment = async (query: Record<string, string>)=>{
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId },{
            status: PAYMENT_STATUS.PAID
        }, {  new: true, runValidators: true, session })

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                {status: BOOKING_STATUS.COMPLETE },
                { runValidators: true, session }
            )

        await session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment completed successful"}
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }

}   

const failPayment = async (query: Record<string, string>)=>{
    const session = await Booking.startSession();
    session.startTransaction();
  
    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId },{
            status: PAYMENT_STATUS.FAILED
        }, { runValidators: true, session })

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                {status: BOOKING_STATUS.FAILED },
                { runValidators: true, session }
            )

        await session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment FAILED"}
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }

}       

const cancelPayment = async (req: Request, res: Response)=>{

}   

export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment
}