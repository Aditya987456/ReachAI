import { ApiRouteConfig } from "motia";
import crypto from "crypto";

export const config: ApiRouteConfig = {
  name: "RazorpayWebhook",
  type: "api",
  path: "/api/payment/webhook",
  method: "POST",
  emits:["paidUser.payment.success"],
  flows: ["Paid User workflow"],
};

export const handler = async (req: any, { state, logger, emit }: any) => {
  try {

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return { status: 400, body: { error: "Missing signature" } };
    }


//## If you we not stringify → signature verification failed.---> convert in json string.
    const bodyString = JSON.stringify(req.body);

    //## step- 1: Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret!)
      .update(bodyString)
      .digest("hex");

    if (expectedSignature !== signature) {
      logger.error("Webhook signature mismatch", {
        expectedSignature,
        signature,
      });

      return {
        status: 400,
        body: { error: "Invalid webhook signature" },
      };
    }

    logger.info("Webhook signature verified");

    // ## step-2 : Extract Payment Data
    const event = req.body.event;
    const payment = req.body.payload?.payment?.entity;

    if (!payment) {
      return { status: 400, body: { error: "Invalid payload" } };
    }

    const orderId = payment.order_id;
    const paymentId = payment.id;
    const paymentStatus = payment.status; // "captured", "failed"
    const PaidJobId = payment.notes?.PaidJobId    //we are sending when creating the order...

   

    if (!PaidJobId) {
      logger.error("Webhook: PaidJobId missing in payment.notes", {
        paymentId,
        notes: payment.notes,
      });

      // Return 200 so Razorpay doesn't spam retries--####
      return {
        status: 200,
        body: { success: true, message: "PaidJobId missing in notes, skipping." },
      };
    }




    logger.info("Webhook received payment details", {
      event,
      orderId,
      paymentId,
      paymentStatus,
      PaidJobId
    });

    // We only care about successful payments----- return ho jao agar payment capture nahi hua then
    if (event !== "payment.captured") {
      return { status: 200, body: { success: true } };
    }





    // ## step-3 : find the motia job state using motia PaidJobId
    const paidJobData = await state.get(`PaidJobs`, PaidJobId);



    // ## step-4 : find -- Is paidjob is there?
    if (!paidJobData) {
    logger.error("Webhook: No job found for PaidJobId", { PaidJobId });

    return { status: 200, body: { success: true, message: "Job not found, skipping." } };
  }


  // ## step-5: check is already verified by /verify route to avoid multiple email.
    if (paidJobData.status === "payment_verified") {
      logger.info("Webhook: Payment already verified earlier", { paidJobData });
    return { status: 200, body: { success: true } };
  }




//---------------iske niche ja rahe hai matlab /verify route nahi verify kar paya---------

//### STEP 6: this is where if not updated by verify route then webhook do that. Update job status in Motia state
  await state.set("PaidJobs", PaidJobId, {
  ...paidJobData,
  razorpay_order_id: orderId,
  razorpay_payment_id: paymentId,
  status: "payment_verified",
  verifiedAt: new Date().toISOString(),
  verifiedByWebhook: true,
});




  logger.info("Webhook: Job updated to payment_verified", {
    PaidJobId,
    orderId,
    paymentId,
  });




// step-7: Emit paidUser.payment.success ----> (just like /verify)
  await emit({
    topic: "paidUser.payment.success",
    data: { PaidJobId },
  });

  logger.info("Webhook: Event emitted successfully", { PaidJobId });
    return { status: 200, body: { success: true } };


  } catch (error: any) {
    logger.error("Webhook error", { message: error.message });
    return {
      status: 500,
      body: { error: "Server error in webhook" },
    };
  }
};
