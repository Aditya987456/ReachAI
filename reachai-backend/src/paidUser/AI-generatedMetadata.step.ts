//  ---  this is the event 

//import { EventConfig, Logger } from "motia";

//step-5: fetch the AI titles, description, tags, hashtages



// export const config= {
//     name:"PaidJob-fetch-AI-optimized metadata",
//     type:'event',
//     subscribes:["paidUser.trendVid.success"],
//     emits:["paidUser.AImetadata.success", "paidUser.AImetadata.error"],
//     flows: ['Paid User workflow'],
//     infrastructure: {
//         handler: { 
//             timeout: 240  // yt not respond give up after 30s
//         },
//         queue: { 
//             maxRetries: 3,  // try 3 times if failed
//             visibilityTimeout: 250  // wait 60s then again try
//         }
//     }
// }


// export const handler = async (eventData:any , { emit, logger, state }:any)=>{

//     let PaidJobId:string | undefined
//     let email:string | undefined
//     const MAX_RETRIES = 3;
//     const RETRY_KEY = "fetchAiMetadata";

//     try {

//         const data = eventData || {}

//         PaidJobId= data.PaidJobId
//         email = data.email
//         const channelId = data.channelId
//         const channelName = data.channelName
//         const TrendingVideos = data.TrendingVideos
        



//         if (!PaidJobId || !email  ||!channelId) {
//            throw new Error("Missing required event data");
//         }


//         const PaidJobData = await state.get('PaidJobs', PaidJobId)

//         if (!PaidJobData) {
//             throw new Error("PaidJob not found");
//         }


//     //######## ----- checking AI metadata before again generating ------ ##########
//         if(PaidJobData.AiMetadatafetched === true){
//             logger.info("AI metadata already generated, next event-", {
//                 PaidJobId
//             })

//             await emit({
//                 topic: "paidUser.AImetadata.success",
//                 data: {
//                     PaidJobId,
//                     email,
//                     channelId,
//                     channelName,
//                     ImprovedMetadataData:PaidJobData.ImprovedMetadataData,
//                 }
//             })

//             return;
//         }

        
//     //------------- using from the state---------------
//         const UserVideos = PaidJobData.videos
        // if (!Array.isArray(UserVideos) || UserVideos.length === 0) {
        //     throw new Error("No user videos found");
        //     }
//         const niche1 = PaidJobData.niches?.[0]  || "";
//         const niche2 = PaidJobData.niches?.[1]  || "";
//         const reasonNiche = PaidJobData.reason  || "";

//            const TOTAL_VIDEO_COUNT = UserVideos.length;




//         const OPENAI_API_KEY = process.env.OPENAI_API_KEY
//         if(!OPENAI_API_KEY){
//             throw new Error("Openai api key not configured")
//         }


        



//         logger.info('Generating AI optimized titles --> ', {
//             PaidJobId,
//             channelId,
//              count:TOTAL_VIDEO_COUNT,
//         })
        


//     //list of videos of user with titles and description from the channel
//         // const userVideosList = UserVideos
//         // .map((v: any, idx: number) =>
//         //     `${idx + 1}. "${v.title}"\n   "${v.description}"`)
//         // .join("\n");










//     //updating the status
//         await state.set('PaidJobs', PaidJobId, {
//             ...PaidJobData,
//             status:'fetching AI optimized titles'
//         })




// //****** prompt for fetching Optimized AI titles...
// //           const TitlePrompt = `

// // You are a YouTube SEO, Metadata, and Growth Expert.
// // CHANNEL INFO:
// // Name: ${channelName}
// // Detected Niches: ${niche1} and ${niche2}
// // Why this niche: ${reasonNiche}

// // ---

// // FIRST, carefully study the *current trending videos* in this niche.
// // For each trending video, analyze:
// // - Title structure
// // - Description format
// // - Keywords used
// // - Emotional tone
// // - Hooks
// // - Hashtag style (if any)

// // TRENDING VIDEOS (Title + Description):
// // ${TrendingVideos.map(
// //   (v: any, idx: number) =>
// //     `${idx + 1}. TITLE: ${v.title}\n   DESCRIPTION: ${v.description}`
// // ).join("\n\n")}

// // ---

// // NEXT, study the creator’s recent videos to understand:
// // - Tone
// // - Topic pattern
// // - Existing keywords
// // - Audience expectation

// // CREATOR VIDEOS (Title + Description):
// // ${UserVideos.map(
// //   (v: any, idx: number) =>
// //     `${idx + 1}. TITLE: ${v.title}\n   DESCRIPTION: ${v.description}`
// // ).join("\n\n")}

// // ---

// // # YOUR TASK  
// // For EACH creator video, produce **complete YouTube metadata**:

// // ### 1. Two optimized titles  
// // - Trend-driven  
// // - SEO-boosted  
// // - Emotional + keyword-rich  
// // - CTR-focused   

// // ### 2. One optimized description  
// // - 250-300 lines  
// // - Rich in niche keywords  
// // - Natural language  
// // - Inspired by trending video structures  

// // ### 3. SEO TAGS (for YouTube tags field)  
// // - 15–20 strong tags  
// // - High search intent  
// // - Niche-specific  
// // - No generic tags like “viral” or “trending”  

// // ### 4. HASHTAGS (for YouTube description or Shorts)  
// // Generate 15-20 hashtags based on:
// // - Topic  
// // - Niche  
// // - SEO keywords  
// // - Trend relevance  
// // - Comparable to those used in trending videos  

// // Ensure a mix of:
// // - Broad hashtags (#youtubegrowth)
// // - Niche hashtags (#fitnessmotivation)
// // - Topic-specific hashtags (#aiyoutubetools)
  
// // No irrelevant or overly broad hashtags (#love, #fun, etc.)

// // ### 5. One-line “why it works” explanation  
// // Keep it brief (1–2 sentences).

// // ---

// // # RETURN THIS STRICTLY IN JSON FORMAT:

// // {
// //   "videos": [
// //     {
// //       "original_title": "...",
// //       "original_description": "...",
// //       "optimized_title_1": "...",
// //       "optimized_title_2": "...",
// //       "optimized_description": "...",
// //       "tags": ["...", "..."],
// //       "hashtags": ["#", "#"],
// //       "why": "..."
// //     }
// //   ]
// // }

// // (DO NOT add anything outside this JSON object)

// //     `;


// const TitlePrompt=`
// You are a YouTube SEO, Metadata, and Growth Specialist with deep knowledge of:
// - High-CTR title structures  
// - SEO-rich description writing  
// - Niche-based keyword optimization  
// - Trending hooks and viewer retention psychology  
// - YouTube’s ranking algorithm and metadata scoring  

// ────────────────────────────────────────────

// CHANNEL INFORMATION:
// Name: ${channelName}
// Detected Niches: ${niche1}, ${niche2}
// Why this niche: ${reasonNiche}

// ────────────────────────────────────────────

// STEP 1 — Analyze TRENDING VIDEOS in this niche  
// Study their:
// - Title structure  
// - Emotional triggers  
// - Keyword style  
// - Description flow  
// - Hashtag patterns  
// - Call-to-action style  

// TRENDING VIDEOS (Title + Description):
// ${TrendingVideos.map(
//   (v: any, idx: number) =>
// `${idx + 1}. TITLE: ${v.title}
//    DESCRIPTION: ${v.description}`
// ).join("\n\n")}

// ────────────────────────────────────────────

// STEP 2 — Study CREATOR'S Recent Videos  
// Understand:
// - Tone & voice  
// - Level of expertise  
// - Keyword consistency  
// - Audience expectations  

// CREATOR VIDEOS (Title + Description):
// ${UserVideos.map(
//   (v: any, idx: number) =>
// `${idx + 1}. TITLE: ${v.title}
//    DESCRIPTION: ${v.description}`
// ).join("\n\n")}

// ────────────────────────────────────────────

// YOUR TASK  
// For EACH creator video, generate COMPLETE PREMIUM METADATA:

// ━━━━━━━━━━  
// 1) OPTIMIZED TITLES (2 versions)  
// Rules:
// - Add **only ONE emoji** (either at start OR end)  
// - Max length: **60 characters**  
// - High CTR emotional framing  
// - Keyword-rich (trend-aligned)  
// - Natural human tone  
// - Avoid clickbait  
// ━━━━━━━━━━

// 2) OPTIMIZED DESCRIPTION (250–300 WORDS, not lines)  
// Structure requirements:
// - Hook sentence  
// - Context of video  
// - Detailed value breakdown  
// - SEO keywords embedded naturally  
// - No fluff  
// - 1–2 CTA lines  
// - Formatting safe for email + YouTube (no special characters breaking HTML)  

// Avoid:
// - Writing like AI  
// - Repeating content  
// - Keyword stuffing  
// ━━━━━━━━━━

// 3) SEO TAGS (15–20 tags)  
// Rules:
// - High-intent search keywords  
// - All lowercase except proper nouns  
// - No duplicates  
// - No generic terms (“viral”, “trending”, “funny”)  
// ━━━━━━━━━━

// 4) HASHTAGS (15–20 hashtags)  
// Rules:
// - Mix of broad + niche + topic-specific  
// - Based on trending keywords  
// - No irrelevant hashtags  
// - Format: "#keyword"  
// ━━━━━━━━━━

// 5) WHY THIS WORKS  
// A short 1–2 sentence explanation of the psychology + SEO behind your titles.  

// ────────────────────────────────────────────

// RETURN RESULT STRICTLY IN THIS JSON FORMAT ONLY:

// {
//   "videos": [
//     {
//       "original_title": "...",
//       "original_description": "...",
//       "optimized_title_1": "...",
//       "optimized_title_2": "...",
//       "optimized_description": "...",
//       "tags": ["...", "..."],
//       "hashtags": ["...", "..."],
//       "why": "..."
//     }
//   ]
// }

// DO NOT output code block formatting.  
// DO NOT add commentary, tips, or explanations outside this JSON.  
// Return ONLY valid JSON — no trailing commas, no markdown fences.
// `





//         const response = await fetch('https://openrouter.ai/api/v1/chat/completions',
//             {
//                 method:'POST',
//                 headers:{
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${OPENAI_API_KEY}`

//                 },
                
//                 body: JSON.stringify({
//                     "model": "openai/gpt-4o-mini",
//                     messages: [
//                         {
//                             role:'system',
//                             content: "You are a YouTube SEO and engagement expert who helps creators write better video metadata",
//                         },

//                         {
//                             role:'user',
//                             content:TitlePrompt
//                         }
//                     ],
//                     temperature:0.7,
                   
//                     response_format:{type: 'json_object'}
//                 })
//             }
//         )

//     // if there is error in finding the AI optimized titles...
//         if(!response.ok){
//             const errorData = await response.json()
//             throw new Error(`Openai API error : ${errorData.error?.message} || 'unknown ai error `)
//         }



//     //after successfullly finding the optimized titles...
//         const result = await response.json()
//         const aiMessage = result.choices?.[0]?.message?.content || "{}";
//         const parsed = JSON.parse(aiMessage);    //$$$### again because content field from openai is always a string.





//         //check 10 vid is there or not?
//         if (!parsed.videos || parsed.videos.length !== UserVideos.length) {
//         logger.error('AI returned incomplete metadata', {
//             expected: UserVideos.length,
//             received: parsed.videos?.length || 0,
//             PaidJobId
//         });
        
//         throw new Error(`AI only generated ${parsed.videos?.length || 0} out of ${UserVideos.length} videos`);
//     }
















//     //extracting all metadata from the response.

//     const ImprovedMetadataData:any = parsed.videos.map( (metadata:any, idx:number)=>({
       
//         original_title:metadata.original_title,
//         original_description:metadata.original_description,
//         optimized_title_1: metadata.optimized_title_1 ,
//         optimized_title_2: metadata.optimized_title_2,
//         optimized_description: metadata.optimized_description,
//         tags: metadata.tags,
//         hashtags: metadata.hashtags,
//         why: metadata.why,
//         url:UserVideos[idx].url

//     }))

//     logger.info('AI optitmized full metadata generated successfully', {
//         PaidJobId,
//         count:ImprovedMetadataData.length
//     })


//     await state.set('PaidJobs', PaidJobId, {

//     ...PaidJobData,
//       status: "AI metadata ready",
//       AiMetadatafetched:true,
//       ImprovedMetadataData
//     });

//     await emit({
//       topic: "paidUser.AImetadata.success",
//       data: {
//         PaidJobId,
//         email,
//         channelName,
//         channelId,
//         ImprovedMetadataData,
//       },
      
//     });


// // state = backend storage → “keep everything safe for later.”

// // emit = visible output → “show/send only the important part now.”







     




//     } catch (error:any) {
//         logger.error('Error in fetching the AI optimized titles ', { error:error.message})

//         if(!PaidJobId  ||  !email){
//             logger.error("Cannot send error notification - missing jobId or email")
//             return
//         }


//         try {

//             const PaidJobData = await state.get('PaidJobs', PaidJobId)
//             const attempt = (PaidJobData?.retry?.[RETRY_KEY]??0)+1

//             await state.set('PaidJobs', PaidJobId,{
//             ...PaidJobData,
//             status:'retrying',
//             lastError:error.message,
//             retry: {
//                 ...PaidJobData?.retry,
//                 [RETRY_KEY]:attempt
//             }
//         })

//         if(attempt >= MAX_RETRIES){
//                 await emit({
//                 topic:"paidUser.AImetadata.error",
//                 data:{
//                     PaidJobId,
//                     email,
//                     error: error.message,
//                     attemptCount: attempt
//                     }
//                 })
//                 return;
//             }

        
//         throw error;
            
            
//         } catch (stateError: any) {
//             logger.error("State failure during AI metadata retry", {
//                 stateError: stateError.message,
//                 PaidJobId
//             });

//             if(email){
//                 await emit({
//                 topic:"paidUser.AImetadata.error",
//                 data:{
//                     PaidJobId,
//                     email,
//                     reasonError: "state_unavailable",
//                     error: error.message,
//                 }
//                  })
//                  return;
//             }

//             throw error;
            
//         }

        
//     }

// }













































import { EventConfig } from "motia";

export const config: EventConfig = {
  name: "PaidJob-fetch-AI-optimized-metadata",
  type: "event",
  subscribes: ["paidUser.trendVid.success"],
  emits: ["paidUser.AImetadata.success", "paidUser.AImetadata.error"],
  flows: ["Paid User workflow"],
  infrastructure: {
    handler: { timeout: 180 },
    queue: {
      maxRetries: 3,
      visibilityTimeout: 210,
    },
  },
};



export const handler = async ( eventData: any, { emit, logger, state }: any ) => {
  
  let PaidJobId: string | undefined;
  let email: string | undefined;

  const RETRY_KEY = "fetchAiMetadata";
  const MAX_RETRIES = 3;

  try {




    // const {
    //   PaidJobId: jobId,
    //   email: userEmail,
    //   channelId,
    //   channelName,
    //   TrendingVideos,
    // } = eventData || {};

    // PaidJobId = jobId;
    // email = userEmail;



        const data = eventData || {}

        PaidJobId= data.PaidJobId
        email = data.email
        const channelId = data.channelId
        const channelName = data.channelName
        const TrendingVideos = data.TrendingVideos





    if (!PaidJobId || !email || !channelId) {
      throw new Error("Missing required event data");
    }

    const PaidJobData = await state.get("PaidJobs", PaidJobId);
    if (!PaidJobData) {
      throw new Error("PaidJob not found");
    }

    // Prevent duplicate generation
    if (PaidJobData.AiMetadatafetched === true) {
      logger.info("AI metadata already exists", { PaidJobId });

      await emit({
        topic: "paidUser.AImetadata.success",
        data: {
          PaidJobId,
          email,
          channelId,
          channelName,
          ImprovedMetadataData: PaidJobData.ImprovedMetadataData,
        },
      });
      return;
    }

    const UserVideos = PaidJobData.videos;
    if (!Array.isArray(UserVideos) || UserVideos.length === 0) {
      throw new Error("No user videos found");
    }

    const niche1 = PaidJobData.niches?.[0] || "";
    const niche2 = PaidJobData.niches?.[1] || "";
    const reasonNiche = PaidJobData.reason || "";

    const TOTAL_VIDEO_COUNT = UserVideos.length;

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key missing");
    }

    await state.set("PaidJobs", PaidJobId, {
      ...PaidJobData,
      status: "fetching AI optimized metadata",
    });

    logger.info("Generating AI metadata", {
      PaidJobId,
      count: TOTAL_VIDEO_COUNT,
    });

    // ---------------------PROMPT -------------------------------

    const TitlePrompt = `
You are an expert YouTube SEO, Metadata, and Growth Strategist.

CHANNEL CONTEXT
Channel Name: ${channelName}
Primary Niches: ${niche1}, ${niche2}
Why this niche: ${reasonNiche}

TREND ANALYSIS (Titles Only)
${TrendingVideos.map((v: any) => `- ${v.title}`).join("\n")}

CREATOR VIDEO TITLES
${UserVideos.map((v: any) => `- ${v.title}`).join("\n")}

CRITICAL REQUIREMENT:
- You WILL receive ${TOTAL_VIDEO_COUNT} creator video titles.
- You MUST return metadata for ALL ${TOTAL_VIDEO_COUNT} videos.
- Do NOT skip any title.
- Do NOT merge videos.
- If output would be long, compress descriptions slightly,
  but NEVER reduce the number of videos.

TASK:
For EACH video generate:
- 2 optimized titles (1 emoji only, max 60 chars)
- 200-250 word SEO optimized description
- 20–25 SEO tags 
- 20–25 hashtags trending based on niche
- 1–2 sentence explanation why it works explanation.

STRICT JSON OUTPUT ONLY:

{
  "videos": [
    {
      "original_title": "...",
      "optimized_title_1": "...",
      "optimized_title_2": "...",
      "optimized_description": "...",
      "tags": ["...", "..."],
      "hashtags": ["...", "..."],
      "why": "..."
    }
  ]
}

IMPORTANT:
- videos.length MUST equal ${TOTAL_VIDEO_COUNT}
- Output ONLY valid JSON
`;

    // ### call to AI.

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          temperature: 0.3,
          max_tokens: 3800,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a YouTube SEO expert producing strict JSON output.",
            },
            { role: "user", content: TitlePrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || "AI request failed");
    }

    const result = await response.json();

    const aiContent = result?.choices?.[0]?.message?.content;

    if (!aiContent?.trim().startsWith("{") || !aiContent.trim().endsWith("}")) {
      throw new Error("AI returned incomplete JSON");
    }

    const parsed = JSON.parse(aiContent);

    // ------------------- validation is 10 vid is there or not?
    if (
      !parsed.videos ||
      !Array.isArray(parsed.videos) ||
      parsed.videos.length !== TOTAL_VIDEO_COUNT
    ) {
      throw new Error(
        `AI returned ${parsed.videos?.length || 0} of ${TOTAL_VIDEO_COUNT}`
      );
    }

    const ImprovedMetadataData = parsed.videos.map(
      (meta: any, idx: number) => ({
        ...meta,
        url: UserVideos[idx]?.url,
      })
    );

    await state.set("PaidJobs", PaidJobId, {
      ...PaidJobData,
      status: "AI metadata ready",
      AiMetadatafetched: true,
      ImprovedMetadataData,
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

    logger.info("AI metadata generation completed", {
      PaidJobId,
      count: ImprovedMetadataData.length,
    });
  } catch (error: any) {
    logger.error("AI metadata generation failed", {
      PaidJobId,
      error: error.message,
    });

    if (!PaidJobId || !email) return;

    const PaidJobData = await state.get("PaidJobs", PaidJobId);
    const attempt = (PaidJobData?.retry?.[RETRY_KEY] ?? 0) + 1;

    await state.set("PaidJobs", PaidJobId, {
      ...PaidJobData,
      status: "retrying",
      lastError: error.message,
      retry: {
        ...PaidJobData?.retry,
        [RETRY_KEY]: attempt,
      },
    });

    if (attempt >= MAX_RETRIES) {
      await emit({
        topic: "paidUser.AImetadata.error",
        data: {
          PaidJobId,
          email,
          error: error.message,
          attemptCount: attempt,
        },
      });
      return;
    }

    throw error;
  }
};
