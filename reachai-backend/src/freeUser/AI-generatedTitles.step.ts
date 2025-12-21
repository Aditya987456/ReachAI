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

        const first5videos = UserVideos.slice(0,5); //  take only the first 5 videos

        const niche1 = jobData.niches[0]
        const niche2 = jobData.niches[1]
        const reasonNiche = jobData.reason


        const userVideosList = first5videos
        .map((v:any, idx:number) => `${idx+1}. "${v.title}"`)
        .join("\n");

        




        //now setting the everything for the job : jobId the data is {---}
        await state.set('jobs', jobId, {
            ...jobData,
            status:'generating_titles'
        })













// const TitlePrompt = `
// You are a YouTube SEO strategist and Title Optimization expert.

// CHANNEL INFO:
// Name: ${channelName}
// Detected Niches: ${niche1} and ${niche2}
// Why this niche was detected: ${reasonNiche}

// FIRST analyze the *currently trending videos* in these niches. Learn their:
// - Title formats
// - Emotional hooks
// - Keywords
// - Style & pacing
// - Click triggers

// Trending videos reference:
// ${TrendingVideos.map((v: any, idx: number) => `${idx + 1}. ${v.title} (by ${v.channelTitle})`).join("\n")}

// ---

// CREATOR’S LATEST VIDEOS (understand tone, voice, and audience expectation):
// ${userVideosList}

// ---

// ### YOUR MAIN TASK
// For **each user video title provided**:

// 1. Generate **2 optimized, highly clickable, SEO-rich titles**
// 2. Every title must follow these rules:
//    - Short, punchy, emotional, keyword-focused
//    - Inspired by niche + trending videos
//    - Must use **ONLY ONE emoji**, placed either at the end or at start of the title
// 3. After the titles, write a short **1–2 sentence explanation** of why they will perform better.

// ---

// ### SPECIAL TASK FOR VIDEO #1 (Paid Bundle Preview)
// In addition to the above, also generate:

// - **Description (200–250 words)** — engaging, keyword-rich, retention-focused, not less than 150 words.
// - **10–15 Tags** — comma separated, not less than 10-15 
// - **10–15 Hashtags** — sharp, relevant, viral-friendly, title related, not less than 10-15
// - ** WHY THIS WORKS ** - A short 1-2 sentence explanation why these titles works or better. 

// ---


// ### OUTPUT FORMAT (VERY IMPORTANT)
// Return ONLY a valid JSON in this structure:

// {
//   "titles": [
//     {
//       "original": "...",
//       "improved1": "...",
//       "improved2": "...",
//       "why": "1–2 sentence explanation",
//       "premium_metadata": {
//           "description": "...",       // ONLY for video #1, otherwise empty or null
//           "tags": ["tag1", "tag2", "..."],          // ONLY for video #1, otherwise empty or null
//           "hashtags": ["#tag1", "#tag2", "..."]    // ONLY for video #1, otherwise empty or null
//           "Why_premium": "2-3 sentence explanation"  // ONLY for video #1, otherwise empty or null
//       }
//     }
//   ]
// }

// (DO NOT include anything outside the JSON.)
// `;



        const TitlePrompt = `
You are a YouTube SEO strategist and Title Optimization expert.

CHANNEL INFO:
Name: ${channelName}
Detected Niches: ${niche1} and ${niche2}
Why this niche was detected: ${reasonNiche}

FIRST analyze the *currently trending videos* in these niches. Learn their:
- Title formats
- Emotional hooks
- Keywords
- Style & pacing
- Click triggers

Trending videos reference:
${TrendingVideos.map((v: any, idx: number) => `${idx + 1}. ${v.title} (by ${v.channelTitle})`).join("\n")}

---

CREATOR'S 5 LATEST VIDEOS (understand tone, voice, and audience expectation):
${userVideosList}

---

### YOUR MAIN TASK
For **EXACTLY THESE 5 VIDEOS ONLY** (NO MORE, NO LESS):

1. Generate **2 optimized, highly clickable, SEO-rich titles** for EACH video
2. Every title must follow these rules:
   - Short, punchy, emotional, keyword-focused
   - Inspired by niche + trending videos
   - Must use **ONLY ONE emoji**, placed either at the end of the title
3. After the titles, write a short **1–2 sentence explanation** of why they will perform better.

---

### SPECIAL TASK FOR VIDEO #1 ONLY (Paid Bundle Preview)
For the FIRST video only, also generate:

- **Description (200–250 words)** — engaging, keyword-rich, retention-focused, not less than 150 words.
- **10–15 Tags** — comma separated, EXACTLY 10-15 high-intent SEO tags
- **10–15 Hashtags** — sharp, relevant, viral-friendly, title related, EXACTLY 10-15 high-intent SEO hastags
- **WHY THIS WORKS** - A short 2-3 sentence explanation why these titles and metadata work better. 

---

### OUTPUT FORMAT (CRITICAL - MUST RETURN EXACTLY 5 OBJECTS)
Return ONLY a valid JSON with EXACTLY 5 title objects in this structure:

{
  "titles": [
    {
      "original": "...",
      "improved1": "...",
      "improved2": "...",
      "why": "1–2 sentence explanation",
      "premium_metadata": {
          "description": "...",                    // ONLY for video #1
          "tags": ["tag1", "tag2", "..."],         // ONLY for video #1
          "hashtags": ["#tag1", "#tag2", "..."],   // ONLY for video #1
          "Why_premium": "2-3 sentence explanation" // ONLY for video #1
      }
    },
    {
      "original": "...",
      "improved1": "...",
      "improved2": "...",
      "why": "1–2 sentence explanation",
      "premium_metadata": null  // Videos 2-5 should have null here
    },
    // ... exactly 3 more objects (total 5)
  ]
}

IMPORTANT: 
- Return EXACTLY 5 title objects, one for each video
- Only video #1 should have premium_metadata filled
- Videos 2-5 should have premium_metadata: null
- Do NOT include anything outside the JSON.
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



    //##### validation but if someone has not 5 videos then?
        if (!parsed.titles || parsed.titles.length !== 5) {
            logger.warn('AI returned wrong number of titles, adjusting...', { 
                received: parsed.titles?.length 
            });
            
            // Adjust to exactly 5
            if (parsed.titles) {
                parsed.titles = parsed.titles.slice(0, 5);
            }
            
            // If still not 5, throw error
            if (parsed.titles.length < 5  && first5videos.length === 5) {
                throw new Error(`AI must return exactly 5 titles, got ${parsed.titles?.length}`);
            }
        }








    //extracting titles from the response.

    const ImprovedTitles:any = parsed.titles.map( (title:any, idx:number)=>({
        original:title.original,
        improved1:title.improved1,
        improved2:title.improved2,
        Why:title.why,
        url:first5videos[idx].url,
        thumbnail: first5videos[idx].thumbnail,
        premium_metadata: title.premium_metadata
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
