import { ApiRouteConfig } from "motia";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";
import crypto from 'crypto'


export const config:ApiRouteConfig = {
    name:"PaidUser-VerifyPayment",
    type:"api",
    path:"/api/payment/verify",
    method:"POST",
    emits:["paidUser.payment.success"],
    flows: ['Paid User workflow']
}




// interface SubmitRequest {
//     channel : string
//     email: string
// }



export const handler = async (req:any , {emit, logger, state }:any)=>{
    try {

        if(!req.body){
            return {
             status:400,
             body:{
                error:"Bad request",
            }
          }
        }


    //--firstly we printing what we are receiving.
        logger.info('Veryfying the payment ------------------ ')

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, PaidJobId } = req.body;

     //missing field check-
      if ( !razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !PaidJobId)
          {
            return {
              status: 400,
              body: { error: "Missing required fields" },
            };
          }

    
    //  Verify signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(sign)
    .digest("hex");

    const isValid = expectedSign === razorpay_signature;

  //updating job status of motia state.
    const job = await state.get("PaidJobs", PaidJobId);
    logger.info("Retrieved job from state", { job });

    await state.set("PaidJobs", PaidJobId, {
    ...job,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    status: isValid ? "payment_verified" : "payment_failed",
    verifiedAt: new Date().toISOString(),
    });

    logger.info("Signature check*****", { expectedSign, razorpay_signature, isValid });






    if (!isValid) {
      logger.info("Payment signature invalid ", { PaidJobId });

      return {
        status: 400,
        body: { success: false, error: "Invalid payment signature" }
      };
    }

    logger.info("Payment verified successfully------- ", { PaidJobId });


    //emit for next event aftewr successs payment.
    await emit({
      topic: "paidUser.payment.success",
      data: { PaidJobId }
    });

    return {
      status: 200,
      body: { success: true }
    };



    }
    catch (error: any) {
     logger.error("Verify payment error", { msg: error.message });
        return {
        status: 500,
        body: { error: "Internal server error" },
        };
  }
}