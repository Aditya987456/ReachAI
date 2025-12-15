//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-4: fetch the niche of the channel



export const config= {
    name:"Fetch-Niche",
    type:'event',
    subscribes:["paidUser.videosfetched.success"],
    emits:["paidUser.Nichefetched.success", "paidUser.Nichefetched.error"],
    flows: ['Paid User workflow'],
    infrastructure: {
        handler: { 
            timeout: 30  // yt not respond give up after 30s
        },
        queue: { 
            maxRetries: 3,  // try 3 times if failed
            visibilityTimeout: 60  // wait 60s then again try
        }
    }
}



export const handler = async (eventData:any , { emit, logger, state }:any)=>{

    let PaidJobId:string | undefined
    let email:string | undefined
    const MAX_RETRIES = 4;
    const RETRY_KEY = "fetchNiche";


    try {

        const data = eventData || {};

        PaidJobId = data.PaidJobId
        email = data.email
        const channelName = data.channelName
        const channelId = data.channelId
        const UserVideos = data.videos


        if (!PaidJobId || !email || UserVideos.length === 0) {
           throw new Error("Missing required event data");
        }


        const PaidJobData = await state.get('PaidJobs', PaidJobId)
        if(!PaidJobData) throw new Error("PaidJob not found");


        

        logger.info('Resolving youtube channel niche --> ', {
            PaidJobId,
            channelId,
            VideosCount:UserVideos.length
        })

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY
        if(!OPENAI_API_KEY){
            throw new Error("Openai api key not configured")
        }

        


// //------using from the state we can also fetch the videos of the user
// const UserVideos = jobData.videos

        // if (!UserVideos) {
        // throw new Error("No user videos found in state or event payload");
        // }




        //######## ----- checking niche before again retrying ------ ##########
        if(PaidJobData.nicheFetched === true){
            logger.info("Niche already detected, next event-", {
                PaidJobId
            })

            await emit({
                topic: "paidUser.Nichefetched.success",
                data: {
                    PaidJobId,
                    email,
                    channelId,
                    channelName,
                    niches:PaidJobData.niches,
                    reason:PaidJobData.reason
                }
            })

            return;
        }





        //now setting the status before starting fetching niche.
        await state.set('PaidJobs', PaidJobId, {
            ...PaidJobData,
            status:'fetching_niche'
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
      status: "niche_detected",
      nicheFetched:true,
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
        logger.error('Error in fetching Niche of the channel ', { error:error.message, PaidJobId})

        if(!PaidJobId  ||  !email){
            logger.error("Cannot send error notification - missing PaidJobId or email")
            throw error;
        }


        try {


            const PaidJobData = await state.get('PaidJobs', PaidJobId)
            const attempt = (PaidJobData?.retry?.[RETRY_KEY]??0)+1

            await state.set('PaidJobs', PaidJobId,{
                ...PaidJobData,
                status:'retrying',
                lastError:error.message,
                retry: {
                    ...PaidJobData?.retry,
                    [RETRY_KEY]: attempt
                } 
            });


            if(attempt >= MAX_RETRIES){
                await emit({
                topic:"paidUser.Nichefetched.error",
                data:{
                    PaidJobId,
                    email,
                    error: error.message,
                    attemptCount: attempt
                    }
                })
                return;
            }

            throw error;   //retry...
            
        } catch (stateError: any) {
            logger.error("State failure during niche retry", {
                stateError: stateError.message,
                PaidJobId
            });

            if (email) {
                await emit({
                topic: "paidUser.Nichefetched.error",
                data: {
                    PaidJobId,
                    email,
                    error: error.message,
                    reasonError: "state_unavailable"
                }
                });
                return;
            }

            throw error;
    }

        
    }
}


