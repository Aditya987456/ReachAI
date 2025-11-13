//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-3: fetch the latest 5 videos from channel id.



export const config= {
    name:"FetchLatest-5-videos",
    type:'event',
    subscribes:["yt.channel.resolved"],
    emits:["yt.videos.fetched", "yt.videos.error"]
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

    let jobId:string | undefined
    let email:string | undefined

    try {

        const data = eventData || {}

        jobId= data.jobId
        email = data.email
        const channelId = data.channelId
        const channelName = data.channelName


        logger.info('Resolving youtube channel', {
            jobId,
            channelId
        })

        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
        if(!YOUTUBE_API_KEY){
            throw new Error("Youtube api key not configured")
        }

        const jobData = await state.get(`job:${jobId}`)

        //now setting the everything for the job : jobId the data is {---}
        await state.set(`job:${jobId}`, {
            ...jobData,
            status:'fetching videos.'
        })

        const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet
            &channelId=${channelId}&order=date&type=video&maxResults=10&key=${YOUTUBE_API_KEY}`

        const Response = await fetch(searchURL)
        const ytResponseData = await Response.json()     //read about this like what are the things it returns
        

        if(!ytResponseData.items || ytResponseData.items.length === 0){
            logger.warn('No videos found for the channel', {
                jobId,
                channelId
            })

            //updating that videos not able to gets fetched
            await state.set(`job:${jobId}`,{
                ...jobData,
                status:'failed',
                error:'No videos found'
            })

            await emit({
                topic:'yt.videos.error',
                data: {
                    jobId,
                    email,
                    error:'No videos found for this channel'
                }
            })
            return;

        }else{
            //means response is there from the lastest 5 videos of the channel.
            const videos:Video[] = ytResponseData.items.map( (items:any)=>({
                videoId:items.id.videoId,
                description: items.snippet.description ,
                title:items.snippet.title,
                url:`https://www.youtube.com/watch?v=${items.id.videoId}`,
                publishedAt:items.snippet.publishedAt,
                thumbnail:items.snippet.thumbnails.default.url
            }));

            logger.info('videos fetched successfully', {
                jobId,
                videoCount:videos.length
            })

            //updating the status of the job
            await state.set(`job:${jobId}`,{
                ...jobData,
                status:'video fetched',
                videos
            })

            await emit({
                topic:"yt.videos.fetched",
                data:{
                    jobId,
                    channelName,
                    videos,
                    email

                }
            })
        }




        
    }  catch (error:any) {
        logger.error('Error in fetching videos ', { error:error.message})

        if(!jobId  ||  !email){
            logger.error("Cannot send error notification - missing jobId or email")
            return
        }

        const jobData = await state.get(`job:${jobId}`)

        await state.set(`job:${jobId}`,{
            ...jobData,
            status:'failed',
            error:error.message
        })

        await emit({
            topic:"yt.videos.error",
            data:{
                jobId,
                email,
                error:'failed to fetch videos.Please try again'
            }
        })
        
    }

}
