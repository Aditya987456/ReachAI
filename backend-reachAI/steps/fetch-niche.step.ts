//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-5: fetch the niche of the user's channel using latest fetched 5 videos.


export const config= {
    name:"fetch-niche",
    type:'event',
    subscribes:["yt.videos.fetched"],
    emits:["yt.niche.fetched", "yt.niche.error"],
    // flows:['yt-videos-flows-analysis']
    flows: ['optimized-youtube-reach']
}




export const handler = async (eventData:any , { emit, logger, state }:any)=>{

    let jobId:string | undefined
    let email:string | undefined

    try {

        const data = eventData || {}

        jobId= data.jobId
        email = data.email
        const channelId = data.channelId
        const channelName = data.channelName
        const videos = data.videos


        logger.info('Resolving youtube channel niche --> ', {
            jobId,
            channelId,
            VideosCount:videos.length
        })

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY
        if(!OPENAI_API_KEY){
            throw new Error("Openai api key not configured")
        }

        const jobData = await state.get('jobs', jobId)
        


//------using from the state
const UserVideos = jobData.videos
if (!UserVideos) {
throw new Error("No user videos found in state or event payload");
}

        //now setting the everything for the job : jobId the data is {---}
        await state.set('jobs', jobId, {
            ...jobData,
            status:'analyzing_niche'
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
            ${videos
            .map(
                (v:any) => `• Title: ${v.title}
            Description: ${v.description}`
            )
            .join("\n\n")}
            `;



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
            throw new Error(`Openai API error : ${errorData.error?.message} || 'unknown ai error `)
        }

    //after successfullly finding the niche...
        const result = await response.json()
        const aiMessage = result.choices?.[0]?.message?.content || "{}";
        const parsed = JSON.parse(aiMessage);


    await state.set('jobs', jobId, {
    //   jobId,
    //   channelName,
    //   email,
    ...jobData,
      status: "niche detected",
      niches: parsed.niches,
      reason: parsed.reason,
    });

    await emit({
      topic: "yt.niche.fetched",
      data: {
        jobId,
        email,
        channelName,
        channelId,
        niches: parsed.niches,
        reason: parsed.reason,
      },
      
    });


// state = backend storage → “keep everything safe for later.”

// emit = visible output → “show/send only the important part now.”







     




    } catch (error:any) {
        logger.error('Error in fetching Niche of the channel ', { error:error.message})

        if(!jobId  ||  !email){
            logger.error("Cannot send error notification - missing jobId or email")
            return
        }

        const jobData = await state.get('jobs', jobId)

        await state.set('jobs', jobId,{
            ...jobData,
            status:'failed',
            error:error.message
        })

        
        await emit({
            topic:"yt.niche.error",
            data:{
                jobId,
                email,
                error:'failed to fetch channel niche.Please try again'
            }
        })
        
    }

}
