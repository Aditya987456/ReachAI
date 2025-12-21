//  ---  this is the event 

//import { EventConfig, Logger } from "motia";

// for notify that error caught





export const config = {

  name: "PaidUser-ErrorHandler",
  type: "event",
  subscribes: [
    "paidUser.videosfetched.error",
    "paidUser.Nichefetched.error",
    "paidUser.trendVid.error",
    "paidUser.AImetadata.error",
    "PaidUser.Email-Send.error"
  ],
  flows: ["Paid User workflow"],
  emits:[]
};



export const handler = async ( eventData: any, { logger, emit, state }: any ) => {

    let PaidJobId: string | undefined
    let email: string | undefined


    try {

        const data = eventData || {}

        PaidJobId= data.PaidJobId
        email = data.email
        const channelName = data.channelName
        // const channelId = data.channelId
         const error = data.error


//   if (!PaidJobId || !email) {
//     logger.error("Error handler missing jobId/email", eventData);
//     return;
//   }

  logger.error("Paid workflow failed permanently", {
    PaidJobId,
    error,
  });





        const RESEND_API_KEY = process.env.RESEND_API_KEY
        const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL
        if(!RESEND_API_KEY){
            throw new Error("Resend api key not configured")
        }


const emailText = `
        Sorry! There is an issue while processing your request for your channel ${channelName}, Something went wrong during processing.
        But if your payment was successful then contact us we will help you as soon as possible.
        Contact support: https://reachaiapp.online/contact
        Please include your Payment ID and this Job ID when contacting support:
        ${PaidJobId}
            `.trim()
    
  


        const response = await fetch('https://api.resend.com/emails', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from:RESEND_FROM_EMAIL,
                to:[ email],
                subject:`Request failed for youtube metadata optimization for channel ${channelName}`,
                text:emailText
            }),
        })


        // if there is error in sending msg error on email...
        if(!response.ok){
            const errorData = await response.json()
            throw new Error(`Resend API error : ${errorData.error?.message} || 'unknown Email error `)
        }

        const emailResult = await response.json()






  // Mark job as permanently failed
  const PaidJobData = await state.get("PaidJobs", PaidJobId);

  if (PaidJobData) {
    await state.set("PaidJobs", PaidJobId, {
      ...PaidJobData,
      status: "failed_permanently",
      finalError: PaidJobData.lastError || "Unknown error",
      failedAt: new Date().toISOString()
    });
  }

  // Send email--
//   await emit({
//     topic: "paidUser.final.notification",
//     data: {
//       email,
//       PaidJobId
//     }
//   });



        
    } catch (error) {
        logger.error('failed to send error notification')
        
    }
  







};
