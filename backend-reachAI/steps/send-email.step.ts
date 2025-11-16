//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-8: Sending email using Resend with AI optimized titles.


export const config= {
    name:"send-email-with-titles",
    type:'event',
    subscribes:["yt.AI-Title.fetched"],
    emits:["yt.titles.Email-Send", "yt.titles.Email-Send.error"],
    flows: ['optimized-youtube-reach']
}








export const handler = async (eventData:any , { emit, logger, state }:any)=>{

    let jobId:string | undefined
    let email:string | undefined
    // let channelName:string | undefined

    try {

        const data = eventData || {}

        jobId= data.jobId
        email = data.email
        const channelName = data.channelName
        const channelId = data.channelId
        const ImprovedTitles = data.ImprovedTitles


        logger.info('Sending email with optimized titles --> ', {
            jobId,
            channelId
        })

        const RESEND_API_KEY = process.env.RESEND_API_KEY
        const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL
        if(!RESEND_API_KEY){
            throw new Error("Resend api key not configured")
        }

         const jobData = await state.get('jobs', jobId)

    //now setting the everything for the job : jobId the data is {---}
        await state.set('jobs', jobId, {
            ...jobData,
            status:'Sending email with optimized titles'
        })

        const emailText = GenerateEmailText(channelName, ImprovedTitles )

        const response = await fetch('https://api.resend.com/emails', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from:RESEND_FROM_EMAIL,
                to:[ email],
                subject:`New titles for ${channelName}`,
                text:emailText
            }),
        })


        // if there is error in sending titles on email...
        if(!response.ok){
            const errorData = await response.json()
            throw new Error(`Resend API error : ${errorData.error?.message} || 'unknown Email error `)
        }

        const emailResult = await response.json()

        logger.info('Email send successfully', {
            jobId,
            emailId:emailResult.id
        })




    await state.set('jobs', jobId, {

    ...jobData,
      status: "completed",
      emailId:emailResult.id,
      CompletedAt:new Date().toISOString()
    });

    await emit({
      topic: "yt.titles.Email-Send",
      data: {
        jobId,
        email,
        // channelName,
        // channelId,
        // ImprovedTitles,
        emailId:emailResult.id,
      },
      
    });




    } catch (error:any) {
        logger.error('Error in sending email with optimized titles ', { error:error.message})

        if(!jobId){
            logger.error("Cannot send error notification - missing jobId")
            return
        }

        const jobData = await state.get('jobs', jobId)

        await state.set('jobs', jobId,{
            ...jobData,
            status:'failed',
            error:error.message
        })

        //optional may no need to emit this.
        await emit({
            topic:"yt.titles.Email-Send.error",
            data:{
                jobId,
                email,
                error:'failed to send the email with AI optimized titles.Please try again'
            }
        })
        
    }
}



//method to generate the email text.

function GenerateEmailText(
  channelName: string,
  titles: any[]
) {
  let intro = `Hey Creator 👋,

Your optimized YouTube titles for **${channelName}** are ready!

These titles were generated using:
• Your latest uploads  
• Detected niche  
• Trending videos  
• YouTube SEO rules  
• Click-through psychology  

Use these to improve clicks, ranking, and reach. 🚀

------------------------------------------
✨ AI-Optimized Titles
------------------------------------------
`;

  let list = "";

  titles.forEach((t: any, i: number) => {
    list += `
${i + 1}. Original: 
"${t.original}"

   → Improved Title 1:
     "${t.improved1}"

   → Improved Title 2:
     "${t.improved2}"

   🎯 Why this works:
     ${t.Why}

   🔗 Video Link:
     ${t.url}

-------------------------------------------------------
`;
  });

  let footer = `
Keep growing 🚀  
ReachAI — Smarter YouTube Growth  
https://reachai.app
`;

  return intro + list + footer;
}
