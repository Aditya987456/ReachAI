//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-4: fetch the trending video of the niche



export const config= {
    name:"fetch-trending-videos",
    type:'event',
    subscribes:["paidUser.Nichefetched.success"],
    emits:["paidUser.trendVid.success", "paidUser.trendVid.error"],
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



interface Video{
    videoId: string
    title:string
    description:string
    //tags:string
    //url:string
    //publishedAt:string
    channelTitle:string
    //thumbnail:string
}





export const handler = async (eventData:any , { emit, logger, state }:any)=>{


    let PaidJobId:string | undefined
    let email:string | undefined
    const MAX_RETRIES = 4;
    const RETRY_KEY = "fetchTrendVid";

    try {

        const data = eventData || {}

        PaidJobId= data.PaidJobId
        email = data.email
        const channelId = data.channelId
        const channelName = data.channelName
        const niche = data.niches[0]    //first niche we are taking here.

        if (!PaidJobId || !niche ||!email) {
           throw new Error("Missing required event data");
        }
        
        
        const PaidJobData = await state.get('PaidJobs', PaidJobId)
        if(!PaidJobData) throw new Error("PaidJob not found");

        const region = PaidJobData?.region || "IN";


    //###########----- checking trending videos before again fetching ------ ##########
        if(PaidJobData.trendVidFetched === true){
            logger.info("Trending videos already. next-event-", {
                PaidJobId
            })

            await emit({
                topic: "paidUser.trendVid.success",
                data: {
                    PaidJobId,
                    region,
                    channelId,
                    email,
                    channelName,
                    TrendingVideos:PaidJobData.TrendingVideos
                }
            })

            return;
        }




    //------using from the state- but no need here since here we only fetching trending videos
        // const UserVideos = PaidJobData.videos
        // if (!UserVideos) {
        //     throw new Error("No user videos found in state or event payload");
        //     }





        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
        if(!YOUTUBE_API_KEY){
            throw new Error("youtube api key not configured")
        }


        logger.info(`Fetching trending videos of the given niche:${niche} -->`, {
            PaidJobId,
            channelId,
            channelNiche:niche
        })


    //now setting the everything for the job : jobId the data is {---}
        await state.set('PaidJobs', PaidJobId, {
            ...PaidJobData,
            status:'fetching trending videos of the niche.'
        })




        const searchURL =`https://www.googleapis.com/youtube/v3/search?part=snippet&q=
                        ${encodeURIComponent(niche)}&type=video&maxResults=10&order=viewCount&regionCode=${region}&key=${YOUTUBE_API_KEY}`;


        const Response = await fetch(searchURL)



        //---- check youtube response status--- 
        if (!Response.ok) {
            // YouTube API returned error (rate limit, server down, etc.)
            throw new Error(`YouTube API failed with status ${Response.status}`)    //## throw matlab retry karo event is not completed yet...
        }

        const YtTrendingVideos = await Response.json()    
        

        if(!YtTrendingVideos.items || YtTrendingVideos.items.length === 0){
            logger.warn('No Trending videos found for this niche', {
                PaidJobId,
                channelId
            })

            //updating that videos not able to gets fetched
            await state.set('PaidJobs', PaidJobId,{
                ...PaidJobData,
                status:'failed',
                error:'No Trending videos found'
            })

            await emit({
                topic:'paidUser.trendVid.error',
                data: {
                    PaidJobId,
                    email,
                    error:'No Trending videos found for this niche'
                }
            })
            return;

        }
        else{

            //--means response is there like trending videos gets fetched.
            const TrendingVideos:Video[] = YtTrendingVideos.items.map( (items:any)=>({

                videoId:items.id.videoId,
                title:items.snippet.title,
                channelTitle:items.snippet.channelTitle,
                description: items.snippet.description 
                // thumbnail:items.snippet.thumbnails.default.url

            }));

            logger.info('Trending videos fetched successfully', {
                PaidJobId,
                videoCount:TrendingVideos.length
            })

            //updating the status of the job
            await state.set('PaidJobs', PaidJobId,{
                ...PaidJobData,
                trendVidFetched:true,
                status:'Trending videos fetched',
                TrendingVideos  ,    //setting trending videos for next event to use in prompt
                region              //for checking.
            })

            await emit({
                topic:"paidUser.trendVid.success",
                  data: {
                    PaidJobId,
                    region,
                    channelId,
                    email,
                    channelName,
                    TrendingVideos,
                   
                } 
            })

   } 
    } catch (error:any) {

        logger.error('Error in fetching trending videos ', {
             error:error.message,
            PaidJobId
        })


        if(!PaidJobId  ||  !email){
            logger.error("Cannot send error notification - missing jobId or email")
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
                [RETRY_KEY]:attempt
            }
        })


        if(attempt >= MAX_RETRIES){
            await emit({
            topic:"paidUser.trendVid.error",
            data:{
                PaidJobId,
                email,
                error:`failed to fetch trending videos.Please try again--- ${error.message}`,
                attemptCount: attempt
            }
        })
            return;
        }

        
        throw error;
            
        } catch (stateError: any) {
            logger.error("State failure during TrendVideoFetch retry", {
                stateError: stateError.message,
                PaidJobId
            });

            if (email) {
                await emit({
                topic: "paidUser.trendVid.error",
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