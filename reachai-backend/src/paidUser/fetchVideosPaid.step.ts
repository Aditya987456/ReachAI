//  ---  this is an event 



//step-3: fetch the latest 10 videos using channelId.


import { EventConfig, Logger } from "motia";


export const config  = {
    name:"PaidJob-FetchLatest-10-videos",
    type:'event',
    subscribes:["paidUser.payment.success"],
    emits:["paidUser.videosfetched.success", "paidUser.videosfetched.error"],
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
    url:string
    publishedAt:string
    thumbnail:string
}



export const handler = async (eventData:any , { emit, logger, state }:any)=>{

    let PaidJobId:string | undefined
    let email:string | undefined
    let channelId: string | undefined
    const MAX_RETRIES = 3;


    try {

        const data = eventData || {};
        PaidJobId=data.PaidJobId






    //here only for extract the channelId and email and checking already vid fetched? --therefore writing PaidJobData1.
        const PaidJobData = await state.get('PaidJobs', PaidJobId)
        if (!PaidJobData) {
          throw new Error("PaidJob not found")
}





        channelId = PaidJobData.channelId
        email = PaidJobData.email


    //############## Before fetching videos check is it already fetched?  ############
        if (PaidJobData.videosFetched === true) {
            logger.info("Videos already fetched, forwarding workflow", { PaidJobId })

            await emit({
                topic: "paidUser.videosfetched.success",

                data: {
                PaidJobId,
                email,
                channelId,
                videos: PaidJobData.videos
                }
            })

        return
        }


        //all details are here now starting fetching videos
        logger.info('fetching videos starting -----', {
            PaidJobId,
            email,
            channelId
        })

        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
        if(!YOUTUBE_API_KEY){
            throw new Error("Youtube api key not configured")
        }

        

        //now setting the status like fetching videos
        await state.set('PaidJobs', PaidJobId, {
            ...PaidJobData,
            status:'fetching videos.'
        })

        const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet
            &channelId=${channelId}&order=date&type=video&maxResults=10&key=${YOUTUBE_API_KEY}`

        const Response = await fetch(searchURL)
        

       //---- check youtube response status--- 
        if (!Response.ok) {
            // YouTube API returned error (rate limit, server down, etc.)
            throw new Error(`YouTube API failed with status ${Response.status}`)    //## throw matlab retry karo event is not completed yet...
        }


        const ytResponseData = await Response.json()     //read about this like what are the things it returns
        
    //## if error in fetched videos-- like no videos is there to fetch.
        if(!ytResponseData.items || ytResponseData.items.length === 0){
            logger.warn('No videos found for the channel', {
                PaidJobId,
                channelId
            })

            //updating status that videos not able to gets fetched
            await state.set('PaidJobs', PaidJobId,{
                ...PaidJobData,
                status:'failed',
                error:'No videos found'
            })

            await emit({
                topic:'paidUser.videosfetched.error',
                data: {
                    PaidJobId,
                    email,
                    channelId,
                    error:'No videos found for this channel'
                }
            })

            return;    //videos is not there man so no need to go in next event...

        }
        else{

        //#### this is the name of the channel.
           const channelName = ytResponseData.items[0]?.snippet?.channelTitle || "Unknown Channel";


        //means response is there from the lastest 10 videos of the channel.
            const videos:Video[] = ytResponseData.items.map( (items:any)=>({
                videoId:items.id.videoId,
                description: items.snippet.description ,
                title:items.snippet.title,
                url:`https://www.youtube.com/watch?v=${items.id.videoId}`,
                publishedAt:items.snippet.publishedAt,
                thumbnail:items.snippet.thumbnails.default.url
            }));

            

            logger.info('videos fetched successfully', {
                PaidJobId,
                channelName,
                videoCount:videos.length
            })

            //updating the status of the job
            await state.set('PaidJobs', PaidJobId,{
                ...PaidJobData,
                channelName,
                status:'video fetched',
                videosFetched: true,
                videos:videos
            })


            await emit({
                topic:"paidUser.videosfetched.success",
                data:{
                    PaidJobId,
                    channelName,
                    videos,
                    email,
                    channelId

                }
            })
        }




        
    }  catch (error:any) {

        logger.error('Error in fetching 10 latest videos ', {
             error:error.message,
             PaidJobId
            })


        if(!PaidJobId  ||  !email){
            logger.error("Cannot send error notification - missing PaidJobId or email")
            throw error;  //matlab ye retry karenge...
        }

        try {

            const PaidJobData = await state.get('PaidJobs', PaidJobId)
            /*   If retryCount exists → use it
                Else → assume 0   :GPT explanation.    */

             //-------------- ##created this after resolving things dry run...-----------   
            
             const retryKey = "fetchVideos"
            const attempt = (PaidJobData.retry?.[retryKey] ?? 0) + 1

            await state.set("PaidJobs", PaidJobId, {
              ...PaidJobData,
              status: "retrying",
              lastError: error.message,
              retry: {
                ...PaidJobData.retry,
                [retryKey]: attempt
              }
            })


        //--------  checking number of retry  ----------
            if (attempt >= MAX_RETRIES) {
                await emit({
                topic: "paidUser.videosfetched.error",
                data: {
                    PaidJobId,
                    email,
                    channelId,
                    error: error.message,
                    attemptCount: attempt
                }
                })
            return // no retry just emit error and out.
            }


            throw error  //this is for retry


            
        } catch (stateError: any) {
    
      // SYSTEM FAILURE SAFETY -- **GPT suggestion**
      
      logger.error("State failure during retry handling", {
        stateError: stateError.message,
        PaidJobId
      })

      if (email) {
        await emit({
          topic: "paidUser.videosfetched.error",
          data: {
            PaidJobId,
            email,
            channelId,
            error: error.message,
            reasonError: "state_unavailable"
          }
        })
        return
      }

      // Absolute last- may again retry or after 3 retry motia silently left event
      throw error
    }



        
    }

}














