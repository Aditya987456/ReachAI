//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-6: fetch the trending videos of that niche


export const config= {
    name:"fetch-trending-videos",
    type:'event',
    subscribes:["yt.niche.fetched"],
    emits:["yt.trendingVideos.fetched", "yt.trendingVideos.error"]
}


export const handler = async (eventData:any , { emit, logger, state }:any)=>{

    let jobId:string | undefined
    let email:string | undefined

    try {

        const data = eventData || {}

        jobId= data.jobId
        email = data.email
        const channelId = data.channelId
        // const channelName = data.channelName
        const niches = data.niches

        logger.info('Fetching trending videos of the given niche -->', {
            jobId,
            channelId,
            channelNiche:niches
        })

        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
        if(!YOUTUBE_API_KEY){
            throw new Error("youtube api key not configured")
        }

        const jobData = await state.get(`job:${jobId}`)

        //now setting the everything for the job : jobId the data is {---}
        await state.set(`job:${jobId}`, {
            ...jobData,
            status:'fetching trending videos of this niche.'
        })


    }catch{

    }
}