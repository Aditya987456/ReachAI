//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-6: fetch the trending videos of that niche


export const config= {
    name:"fetch-trending-videos",
    type:'event',
    subscribes:["yt.niche.fetched"],
    emits:["yt.trendingVideos.fetched", "yt.trendingVideos.error"]
}




interface Video{
    videoId: string
    title:string
    //description:string
    //tags:string
    //url:string
    //publishedAt:string
    channelTitle:string
    //thumbnail:string
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
        const niche = data.niches[0]    //first niche we are taking here.
        

        logger.info(`Fetching trending videos of the given niche:${niche} -->`, {
            jobId,
            channelId,
            channelNiche:niche
        })

        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
        if(!YOUTUBE_API_KEY){
            throw new Error("youtube api key not configured")
        }

        const jobData = await state.get(`job:${jobId}`)
        const region = jobData.region

    //now setting the everything for the job : jobId the data is {---}
        await state.set(`job:${jobId}`, {
            ...jobData,
            status:'fetching trending videos of the niche.'
        })




        const searchURL =`https://www.googleapis.com/youtube/v3/search?part=snippet&q=
                        ${encodeURIComponent(niche)}&type=video&maxResults=10&order=viewCount&regionCode=${region}&key=${YOUTUBE_API_KEY}`;


        const Response = await fetch(searchURL)
        const YtTrendingVideos = await Response.json()    
        

        if(!YtTrendingVideos.items || YtTrendingVideos.items.length === 0){
            logger.warn('No Trending videos found for this niche', {
                jobId,
                channelId
            })

            //updating that videos not able to gets fetched
            await state.set(`job:${jobId}`,{
                ...jobData,
                status:'failed',
                error:'No Trending videos found'
            })

            await emit({
                topic:'yt.trendingVideos.error',
                data: {
                    jobId,
                    email,
                    error:'No Trending videos found for this niche'
                }
            })
            return;

        }else{
            //--means response is there like trending videos gets fetched.
            const TrendigVideos:Video[] = YtTrendingVideos.items.map( (items:any)=>({

                videoId:items.id.videoId,
                title:items.snippet.title,
                channelTitle:items.snippet.channelTitle,
                // thumbnail:items.snippet.thumbnails.default.url

            }));

            logger.info(' Trending videos fetched successfully', {
                jobId,
                videoCount:TrendigVideos.length
            })

            //updating the status of the job
            await state.set(`job:${jobId}`,{
                ...jobData,
                status:'Trending video fetched',
                TrendigVideos      //setting trending videos for next event to use in prompt
            })

            await emit({
                topic:"yt.trendingVideos.fetched",
                  data: {
                    jobId,
                    TrendigVideos
                } 
            })

  










        } 
    } catch (error:any) {
        logger.error('Error in fetching trending videos ', { error:error.message})

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
            topic:"yt.trendingVideos.error",
            data:{
                jobId,
                email,
                error:'failed to fetch trending videos.Please try again'
            }
        })
        
    }
}