import { BOOKING_STATUS } from "../booking/booking.interface.js";
import { Booking } from "../booking/booking.model.js";
import { PAYMENT_STATUS } from "./payment.interface.js";
import { Payment } from "./payment.model.js";

const successPayment = async ()=>{
  const session = await Booking.startSession();
  session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate({},{
            status: PAYMENT_STATUS.PAID,
        }, { session })

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                {status: BOOKING_STATUS.COMPLETE},
                { new: true, runValidators: true, session }
            )
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment")

        await session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment Completed successfully" }
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }

}   

const failPayment = async (req: Request, res: Response)=>{

}       

const cancelPayment = async (req: Request, res: Response)=>{

}   

export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment
}