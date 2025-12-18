import { ApiRouteConfig } from "motia";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";


export const config:ApiRouteConfig = {
    name:"PaidUser-CreateOrder",
    type:"api",
    path:"/api/payment/create-order",
    method:"POST",
    emits:[],
    flows: ['Paid User workflow']
}






export const handler = async (req:any , {logger, state }:any)=>{
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
        logger.info('Received request paid user -- ', { body: req.body})


        //checking data giving is correct type or not -- simple TS.
        const { channelId, email }=req.body ;

        //check if empty fields.
        if(!channelId  ||  !email){
          return {
             status:400,
             body:{
                error:"Missing required fields : channelId , email",
            }
          }
        }




    //-----------------------------------------------------------------

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })

        const receipt = `reachai_${channelId}_${Date.now()}`.slice(0, 35);;



        //creating jobId----> for motia state...
        const PaidJobId = uuidv4();


        //###### creating razorpay order
        const order = await razorpay.orders.create({
        amount: 99 * 100,
        currency: "INR",
        receipt,
        notes: {
            email,
            channelId,
            service: 'youtube_metadata_full',
            PaidJobId                 //sending PaidJobId so we can use in webhook also ....
            }
        })


         //need to check - is order created or not?
        if (!order || !order.id) {
        return {
          status: 400,
          body: {
            success: false,
            error: "Order creation failed: No order ID returned",
            debug: order
          }
        };
      }



        logger.info("Order created--------:", { order });

       


        

        //set the information in this job.-- abhi jo request ua uska ek jobId ban gaya.
        await state.set(`PaidJobs`, PaidJobId , {

            orderId: order.id,
            receipt,
            amount:99,

          //data of the job
          PaidJobId,
          channelId,
          email,
          status:"order_created",
          CreatedAt: new Date().toISOString()
        })



    return {
      status: 200, 
      body: {
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID, 
    PaidJobId,     //very imp ye ham de rahe hai so also use in next things.
  }                 
    };




    }
    catch (error: any) {

    logger.error("PaidUser-CreateOrder error", {error});

    return {
      status: 500,
      body: { error: "Internal server error" }
    };
  }
}