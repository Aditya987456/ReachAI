//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-5: fetch the AI titles, description, tags, hashtages



export const config= {
    name:"fetch-AI-optimized metadata",
    type:'event',
    subscribes:["paidUser.trendVid.success"],
    emits:["paidUser.AImetadata.success", "paidUser.AImetadata.error"],
    flows: ['Paid User workflow']
}


export const handler = async (eventData:any , { emit, logger, state }:any)=>{

    let PaidJobId:string | undefined
    let email:string | undefined

    try {

        const data = eventData || {}

        PaidJobId= data.PaidJobId
        email = data.email
        const channelId = data.channelId
        const channelName = data.channelName
        const TrendingVideos = data.TrendingVideos


        logger.info('Fetching AI optimized titles --> ', {
            PaidJobId,
            channelId
        })

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY
        if(!OPENAI_API_KEY){
            throw new Error("Openai api key not configured")
        }

        const PaidJobData = await state.get('PaidJobs', PaidJobId)

//------using from the state
        const UserVideos = PaidJobData.videos
        if (!UserVideos) {
            throw new Error("No user videos found in state or event payload");
            }
        const niche1 = PaidJobData.niches[0]
        const niche2 = PaidJobData.niches[1]
        const reasonNiche = PaidJobData.reason


    //list of videos of user with titles and description from the channel
        // const userVideosList = UserVideos
        // .map((v: any, idx: number) =>
        //     `${idx + 1}. "${v.title}"\n   "${v.description}"`)
        // .join("\n");




    //updating the status
        await state.set('PaidJobs', PaidJobId, {
            ...PaidJobData,
            status:'fetching AI optimized titles'
        })




//****** prompt for fetching Optimized AI titles...
//           const TitlePrompt = `

// You are a YouTube SEO, Metadata, and Growth Expert.
// CHANNEL INFO:
// Name: ${channelName}
// Detected Niches: ${niche1} and ${niche2}
// Why this niche: ${reasonNiche}

// ---

// FIRST, carefully study the *current trending videos* in this niche.
// For each trending video, analyze:
// - Title structure
// - Description format
// - Keywords used
// - Emotional tone
// - Hooks
// - Hashtag style (if any)

// TRENDING VIDEOS (Title + Description):
// ${TrendingVideos.map(
//   (v: any, idx: number) =>
//     `${idx + 1}. TITLE: ${v.title}\n   DESCRIPTION: ${v.description}`
// ).join("\n\n")}

// ---

// NEXT, study the creator’s recent videos to understand:
// - Tone
// - Topic pattern
// - Existing keywords
// - Audience expectation

// CREATOR VIDEOS (Title + Description):
// ${UserVideos.map(
//   (v: any, idx: number) =>
//     `${idx + 1}. TITLE: ${v.title}\n   DESCRIPTION: ${v.description}`
// ).join("\n\n")}

// ---

// # YOUR TASK  
// For EACH creator video, produce **complete YouTube metadata**:

// ### 1. Two optimized titles  
// - Trend-driven  
// - SEO-boosted  
// - Emotional + keyword-rich  
// - CTR-focused   

// ### 2. One optimized description  
// - 250-300 lines  
// - Rich in niche keywords  
// - Natural language  
// - Inspired by trending video structures  

// ### 3. SEO TAGS (for YouTube tags field)  
// - 15–20 strong tags  
// - High search intent  
// - Niche-specific  
// - No generic tags like “viral” or “trending”  

// ### 4. HASHTAGS (for YouTube description or Shorts)  
// Generate 15-20 hashtags based on:
// - Topic  
// - Niche  
// - SEO keywords  
// - Trend relevance  
// - Comparable to those used in trending videos  

// Ensure a mix of:
// - Broad hashtags (#youtubegrowth)
// - Niche hashtags (#fitnessmotivation)
// - Topic-specific hashtags (#aiyoutubetools)
  
// No irrelevant or overly broad hashtags (#love, #fun, etc.)

// ### 5. One-line “why it works” explanation  
// Keep it brief (1–2 sentences).

// ---

// # RETURN THIS STRICTLY IN JSON FORMAT:

// {
//   "videos": [
//     {
//       "original_title": "...",
//       "original_description": "...",
//       "optimized_title_1": "...",
//       "optimized_title_2": "...",
//       "optimized_description": "...",
//       "tags": ["...", "..."],
//       "hashtags": ["#", "#"],
//       "why": "..."
//     }
//   ]
// }

// (DO NOT add anything outside this JSON object)

//     `;


const TitlePrompt=`
You are a YouTube SEO, Metadata, and Growth Specialist with deep knowledge of:
- High-CTR title structures  
- SEO-rich description writing  
- Niche-based keyword optimization  
- Trending hooks and viewer retention psychology  
- YouTube’s ranking algorithm and metadata scoring  

────────────────────────────────────────────

CHANNEL INFORMATION:
Name: ${channelName}
Detected Niches: ${niche1}, ${niche2}
Why this niche: ${reasonNiche}

────────────────────────────────────────────

STEP 1 — Analyze TRENDING VIDEOS in this niche  
Study their:
- Title structure  
- Emotional triggers  
- Keyword style  
- Description flow  
- Hashtag patterns  
- Call-to-action style  

TRENDING VIDEOS (Title + Description):
${TrendingVideos.map(
  (v: any, idx: number) =>
`${idx + 1}. TITLE: ${v.title}
   DESCRIPTION: ${v.description}`
).join("\n\n")}

────────────────────────────────────────────

STEP 2 — Study CREATOR'S Recent Videos  
Understand:
- Tone & voice  
- Level of expertise  
- Keyword consistency  
- Audience expectations  

CREATOR VIDEOS (Title + Description):
${UserVideos.map(
  (v: any, idx: number) =>
`${idx + 1}. TITLE: ${v.title}
   DESCRIPTION: ${v.description}`
).join("\n\n")}

────────────────────────────────────────────

YOUR TASK  
For EACH creator video, generate COMPLETE PREMIUM METADATA:

━━━━━━━━━━  
1) OPTIMIZED TITLES (2 versions)  
Rules:
- Add **only ONE emoji** (either at start OR end)  
- Max length: **60 characters**  
- High CTR emotional framing  
- Keyword-rich (trend-aligned)  
- Natural human tone  
- Avoid clickbait  
━━━━━━━━━━

2) OPTIMIZED DESCRIPTION (250–300 WORDS, not lines)  
Structure requirements:
- Hook sentence  
- Context of video  
- Detailed value breakdown  
- SEO keywords embedded naturally  
- No fluff  
- 1–2 CTA lines  
- Formatting safe for email + YouTube (no special characters breaking HTML)  

Avoid:
- Writing like AI  
- Repeating content  
- Keyword stuffing  
━━━━━━━━━━

3) SEO TAGS (15–20 tags)  
Rules:
- High-intent search keywords  
- All lowercase except proper nouns  
- No duplicates  
- No generic terms (“viral”, “trending”, “funny”)  
━━━━━━━━━━

4) HASHTAGS (15–20 hashtags)  
Rules:
- Mix of broad + niche + topic-specific  
- Based on trending keywords  
- No irrelevant hashtags  
- Format: "#keyword"  
━━━━━━━━━━

5) WHY THIS WORKS  
A short 1–2 sentence explanation of the psychology + SEO behind your titles.  

────────────────────────────────────────────

RETURN RESULT STRICTLY IN THIS JSON FORMAT ONLY:

{
  "videos": [
    {
      "original_title": "...",
      "original_description": "...",
      "optimized_title_1": "...",
      "optimized_title_2": "...",
      "optimized_description": "...",
      "tags": ["...", "..."],
      "hashtags": ["...", "..."],
      "why": "..."
    }
  ]
}

DO NOT output code block formatting.  
DO NOT add commentary, tips, or explanations outside this JSON.  
Return ONLY valid JSON — no trailing commas, no markdown fences.
`





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
                            content: "You are a YouTube SEO and engagement expert who helps creators write better video metadata",
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


    //extracting all metadata from the response.

    const ImprovedMetadataData:any = parsed.videos.map( (metadata:any, idx:number)=>({
       
        original_title:metadata.original_title,
        original_description:metadata.original_description,
        optimized_title_1: metadata.optimized_title_1 ,
        optimized_title_2: metadata.optimized_title_2,
        optimized_description: metadata.optimized_description,
        tags: metadata.tags,
        hashtags: metadata.hashtags,
        why: metadata.why,
        url:UserVideos[idx].url

    }))

    logger.info('AI optitmized full metadata generated successfully', {
        PaidJobId,
        count:ImprovedMetadataData.length
    })


    await state.set('PaidJobs', PaidJobId, {

    ...PaidJobData,
      status: "Titles ready",
      ImprovedMetadataData
    });

    await emit({
      topic: "paidUser.AImetadata.success",
      data: {
        PaidJobId,
        email,
        channelName,
        channelId,
        ImprovedMetadataData,
      },
      
    });


// state = backend storage → “keep everything safe for later.”

// emit = visible output → “show/send only the important part now.”







     




    } catch (error:any) {
        logger.error('Error in fetching the AI optimized titles ', { error:error.message})

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
            topic:"paidUser.AImetadata.error",
            data:{
                PaidJobId,
                email,
                error:'failed to fetch the AI optimized titles.Please try again'
            }
        })
        
    }

}