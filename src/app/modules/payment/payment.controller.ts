import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { PaymentService } from "./payment.service.js";
import { envVars } from "../../config/env.js";


const successPayment = catchAsync(async (req: Request, res: Response)=>{
   const query = req.query;
   const result = await PaymentService.successPayment(query as Record<string, srting>);

   if(result.success){
    res.redirect(envVars.SSL.SSL_SUCCESS_FRONTEND_URL)
   }
})

const failPayment = catchAsync(async (req: Request, res: Response)=>{

})

const cancelPayment = catchAsync(async (req: Request, res: Response)=>{

})

export const PaymentController = {
    successPayment,
    failPayment,
    cancelPayment
}