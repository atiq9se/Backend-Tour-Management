import axios from "axios"
import { envVars } from "../../config/env.js"
import type { ISSLCommerz } from "./sslCommerz.interface.js"
import httpStatus from "http-status-codes"
import AppError from "../../errorHelpers/AppError.js"


const sslPaymentInit = async (payload: ISSLCommerz) => {
    try{
        const data = {
            store_id: envVars.SSL.SSL_STORE_ID,
            store_passwd: envVars.SSL.SSL_STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url:"http://localhost:5000/api/v1/payment/success",
            fail_url:"http://localhost:5000/api/v1/payment/fail",
            cancel_url:"http://localhost:5000/api/v1/payment/cancel", 
            shipping_method: "N/A",
            product_name: "Tour",
            product_category: "Service",
            product_profile: "general",  
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.addres,
            cus_city:"dhaka",
            cus_state: "dhaka",
            cus_postcode:"1000",
            cus_country:"Bangladesh",
            cus_phone: payload.phoneNumber,
            cus_fax:"N/A",
            ship_name: "N/A",
            ship_add1 : "N/A",
            ship_add2: "N/A",
            ship_city: "dhaka",
            ship_state:"N/A",
            ship_postcode:"N/A",
            ship_country:"N/A",
            multi_card_name:"N/A",
        }
        const response = await axios({
            method: "POST",
            url: envVars.SSL.SSL_PAYMENT_API,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        return response.data;
    } catch(error: any){
        console.log("payment error Occuered", error);
        throw new AppError(httpStatus.BAD_REQUEST, error.message)
    }
}

export const SSLService = {
    sslPaymentInit
}