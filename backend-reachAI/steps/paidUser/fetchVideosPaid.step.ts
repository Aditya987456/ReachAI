//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-3: fetch the latest 10 videos using channelId.



export const config= {
    name:"FetchLatest-10-videos",
    type:'event',
    subscribes:["paidUser.payment.success"],
    emits:["paidUser.videosfetched.success", "paidUser.videosfetched.error"],
    flows: ['Paid User workflow']
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
    // let channelId: string | undefined


    try {

        const data = eventData || {};
        PaidJobId=data.PaidJobId

    //here only for extract the channelid and email
        const PaidJobData1 = await state.get('PaidJobs', PaidJobId)

        const channelId = PaidJobData1.channelId
        email = PaidJobData1.email

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

         const PaidJobData = await state.get('PaidJobs', PaidJobId)


        //now setting the status like fetching videos
        await state.set('PaidJobs', PaidJobId, {
            ...PaidJobData,
            status:'fetching videos.'
        })

        const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet
            &channelId=${channelId}&order=date&type=video&maxResults=10&key=${YOUTUBE_API_KEY}`

        const Response = await fetch(searchURL)
        const ytResponseData = await Response.json()     //read about this like what are the things it returns
        
    //if error in fetching vid
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
            return;

        }else{

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
        logger.error('Error in fetching videos ', { error:error.message})

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
            topic:"paidUser.videosfetched.error",
            data:{
                PaidJobId,
                email,
                error:'failed to fetch videos.Please try again'
            }
        })
        
    }

}
