//  ---  this is the event 

import { EventConfig, Logger } from "motia";

// for notify that error caught


export const config= {
    name:"Error-handling",
    type:'event',
    subscribes:[],

    emits:["yt.error.notified"],
    flows: ['optimized-youtube-reach']
}








export const handler = async (eventData:any , { emit, logger, state }:any)=>{

    let jobId:string | undefined
    let email:string | undefined

    // try {

    //     const data = eventData || {}

    //     jobId= data.jobId
    //     email = data.email
    //     const channelName = data.channelName
    //     const channelId = data.channelId
    //     const error = data.error


    //     logger.info('Handling error notification --> ', {
    //         jobId,
    //         email,
    //         channelId
    //     })


    //     const RESEND_API_KEY = process.env.RESEND_API_KEY
    //     const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL
    //     if(!RESEND_API_KEY){
    //         throw new Error("Resend api key not configured")
    //     }


    //     const emailText = `Sorry, We are facing issue in generating the optimized titles for your channel ${channelName}, Please try again.`
        
    //    // const jobData = await state.get('jobs', jobId)


    //     const response = await fetch('https://api.resend.com/emails', {
    //         method:'POST',
    //         headers:{
    //             'Content-Type':'application/json',
    //             'Authorization':`Bearer ${RESEND_API_KEY}`
    //         },
    //         body: JSON.stringify({
    //             from:RESEND_FROM_EMAIL,
    //             to:[ email],
    //             subject:`Request failed for youtube titles optimization for channel ${channelName}`,
    //             text:emailText
    //         }),
    //     })


    //     // if there is error in sending msg error on email...
    //     if(!response.ok){
    //         const errorData = await response.json()
    //         throw new Error(`Resend API error : ${errorData.error?.message} || 'unknown Email error `)
    //     }

    //     const emailResult = await response.json()

    //     await emit({
    //     topic: "yt.error.notified",
    //     data: {
    //         jobId,
    //         email,
    //     },
        
    //     });



    // } catch (error) {
    //     logger.error('failed to send error notification')
        
    // }

}