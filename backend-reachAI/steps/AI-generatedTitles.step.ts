//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-7: fetch the AI optimized titles using OpenAI api.


export const config= {
    name:"fetch-optimized-titles",
    type:'event',
    subscribes:["yt.trendingVideos.fetched"],
    emits:["yt.AI-Title.fetched", "yt.AI-Title.error"],
    // flows:['AI-titles-generating']
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
        // const videos = data.videos
        const TrendingVideos = data.TrendingVideos


        logger.info('Fetching AI optimized titles --> ', {
            jobId,
            channelId
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
        const niche1 = jobData.niches[0]
        const niche2 = jobData.niches[1]
        const reasonNiche = jobData.reason

        const userVideosList = UserVideos
        .slice(0, 5) //  take only the first 5 videos
        .map((v:any, idx:number) => `${idx+1}. "${v.title}"`)
        .join("\n");

        




        //now setting the everything for the job : jobId the data is {---}
        await state.set('jobs', jobId, {
            ...jobData,
            status:'fetching AI optimized titles'
        })












//****** prompt for fetching Optimized AI titles...
          const TitlePrompt = `
You are a YouTube SEO + Title Expert.

CHANNEL INFO:
Name: ${channelName}
Detected Niches: ${niche1} and ${niche2}
Why this niche: ${reasonNiche}

FIRST, study the *current trending videos* in this niche to understand trending formats, keywords, and tone.
${TrendingVideos
  .map(
    (v: any, idx: number) =>
      `${idx + 1}. ${v.title} (by ${v.channelTitle})`
  )
  .join("\n")}

---

CREATOR’S LATEST VIDEOS (for tone and style):
${userVideosList}

---

 **YOUR TASK**
For EACH user video title:

1. Suggest **2 optimized, trendy, SEO-boosted YouTube titles**  
2. Titles must be based on:  
   - The detected niche  
   - The trending videos style  
3. Titles must be short, punchy, clickable, emotional & keyword-rich  
4. After the titles → briefly explain **WHY these titles will perform better in 1-2 sentences only**  

Return the output in JSON formate:
    {
        "titles": [
                {
                    "original": "...",
                    "improved1": "...",
                    "improved2": "...",
                    "Why" : "..."
                }
            ]
    }



(DO NOT add anything else outside this format)
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
                            content: "You are a YouTube SEO and engagement expert who helps creators write better video titles",
                        },

                        {
                            role:'user',
                            content:TitlePrompt
                        }
                    ],
                    temperature:0.7,
                    response_format:{type: 'json_object'}
                })
            }
        )

    // if there is error in finding the AI optimized titles...
        if(!response.ok){
            const errorData = await response.json()
            throw new Error(`Openai API error : ${errorData.error?.message} || 'unknown ai error `)
        }

    //after successfullly finding the optimized titles...
        const result = await response.json()
        const aiMessage = result.choices?.[0]?.message?.content || "{}";
        const parsed = JSON.parse(aiMessage);    //$$$### again because content field from openai is always a string.


    //extracting titles from the response.

    const ImprovedTitles:any = parsed.titles.map( (title:any, idx:number)=>({
        original:title.original,
        improved1:title.improved1,
        improved2:title.improved2,
        Why:title.Why,
        url:UserVideos[idx].url
    }))

    logger.info('AI optitmized titles generated successfully', {
        jobId,
        count:ImprovedTitles.length
    })


    await state.set('jobs', jobId, {

    ...jobData,
      status: "Titles ready",
      ImprovedTitles
    });

    await emit({
      topic: "yt.AI-Title.fetched",
      data: {
        jobId,
        email,
        channelName,
        channelId,
        ImprovedTitles,
      },
      
    });


// state = backend storage → “keep everything safe for later.”

// emit = visible output → “show/send only the important part now.”







     




    } catch (error:any) {
        logger.error('Error in fetching the AI optimized titles ', { error:error.message})

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
            topic:"yt.AI-Title.error",
            data:{
                jobId,
                email,
                error:'failed to fetch the AI optimized titles.Please try again'
            }
        })
        
    }

}
