import { Schema, model } from "mongoose";
import  {IPayment} from "./payment.interface";
import { PAYMENT_STATUS } from "./payment.interface";

const paymentSchema = new Schema<IPayment>({
    booking: {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        unique: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.UNPAID
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentGatewayData:{
        type: Schema.Types.Mixed
    },
    invoiceUrl : {
        type: String
    }

},{
    timestamps: true
})

export const Booking = model<IBooking>("Booking", bookingSchema)