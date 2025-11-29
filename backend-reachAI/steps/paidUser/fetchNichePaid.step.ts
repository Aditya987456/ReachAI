//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-4: fetch the niche of the channel



export const config= {
    name:"Fetch-Niche",
    type:'event',
    subscribes:["paidUser.videosfetched.success"],
    emits:["paidUser.Nichefetched.success", "paidUser.Nichefetched.error"],
    flows: ['Paid User workflow']
}



export const handler = async (eventData:any , { emit, logger, state }:any)=>{

    let PaidJobId:string | undefined
    let email:string | undefined
    


    try {

        const data = eventData || {};

        PaidJobId = data.PaidJobId
        email = data.email
        const channelName = data.channelName
        const channelId = data.channelId
        const UserVideos = data.videos

        logger.info('Resolving youtube channel niche --> ', {
            PaidJobId,
            channelId,
            VideosCount:UserVideos.length
        })

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY
        if(!OPENAI_API_KEY){
            throw new Error("Openai api key not configured")
        }

        const PaidJobData = await state.get('PaidJobs', PaidJobId)

// //------using from the state we can also fetch the videos of the user
// const UserVideos = jobData.videos

        if (!UserVideos) {
        throw new Error("No user videos found in state or event payload");
        }


        //now setting the status before starting fetching niche.
        await state.set('PaidJobs', PaidJobId, {
            ...PaidJobData,
            status:'fetching niche of the channel.'
        })

             //prompt for analyzing the niche.
        const userPrompt = `
            You are an expert in YouTube content analysis.

            You will receive a list of recent video titles and descriptions from a single YouTube channel.

            Your task:
            - Identify the 1–2 most relevant overall *niches* that represent the entire channel's content.
            - Do NOT describe each video individually.
            - Focus on the main consistent theme across the videos.

            Respond ONLY in this JSON format:
            {
            "niches": ["<niche1>", "<optional_niche2>"],
            "reason": "<short summary of 10 words max>"
            }

            Here are the videos:
            ${UserVideos
            .map(
                (v:any) => `• Title: ${v.title}
            Description: ${v.description}`
            )
            .join("\n\n")}
            `;


        //calling to openai for fetching the niche.
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions',
            {
                method:'POST',
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`

                },
                
                body: JSON.stringify({
                    "model": "openai/gpt-4o-mini",
                    messages: [
                        {
                            role:'system',
                            content: "You are a YouTube channel analysis assistant.",
                        },

                        {
                            role:'user',
                            content:userPrompt

                        }
                    ],
                    temperature:0.7,
                    response_format:{type: 'json_object'}
                })
            }
        )


        // if there is error in finding the niche...
        if(!response.ok){
            const errorData = await response.json()
            throw new Error(`Openai API error : ${errorData.error?.message} || 'unknown ai error - fetching niche`)
        }

    //after successfullly finding the niche...
        const result = await response.json()
        const aiMessage = result.choices?.[0]?.message?.content || "{}";     //we have to extract data from ai like this because ai provides like this
        const parsed = JSON.parse(aiMessage);


    await state.set('PaidJobs', PaidJobId, {
    //   jobId,
    //   channelName,
    //   email,
    ...PaidJobData,
      status: "niche detected",
      niches: parsed.niches,     //2 -niches
      reason: parsed.reason,
    });

    await emit({
      topic: "paidUser.Nichefetched.success",
      data: {
        PaidJobId,
        email,
        channelName,
        channelId,
        niches: parsed.niches,
        reason: parsed.reason,
      },
      
    });

    } catch (error:any) {
        logger.error('Error in fetching Niche of the channel ', { error:error.message})

        if(!PaidJobId  ||  !email){
            logger.error("Cannot send error notification - missing jobId or email")
            return
        }

        const PaidJobData = await state.get('PaidJobs', PaidJobId)

        await state.set('PaidJobs', PaidJobId,{
            ...PaidJobData,
            status:'failed',
            error:error.message
        })

        await emit({
            topic:"paidUser.Nichefetched.error",
            data:{
                PaidJobId,
                email,
                error:'failed to fetch channel niche.Please try again'
            }
        })
        
    }
}