//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-4: fetch the trending video of the niche



export const config= {
    name:"fetch-trending-videos",
    type:'event',
    subscribes:["paidUser.Nichefetched.success"],
    emits:["paidUser.trendVid.success", "paidUser.trendVid.error"],
    flows: ['Paid User workflow']
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

    try {

        const data = eventData || {}

        PaidJobId= data.PaidJobId
        email = data.email
        const channelId = data.channelId
        const channelName = data.channelName
        const niche = data.niches[0]    //first niche we are taking here.
        

        logger.info(`Fetching trending videos of the given niche:${niche} -->`, {
            PaidJobId,
            channelId,
            channelNiche:niche
        })

        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
        if(!YOUTUBE_API_KEY){
            throw new Error("youtube api key not configured")
        }

        const PaidJobData = await state.get('PaidJobs', PaidJobId)
        const region = PaidJobData?.region || "IN";

    //------using from the state
        const UserVideos = PaidJobData.videos
        if (!UserVideos) {
            throw new Error("No user videos found in state or event payload");
            }

    //now setting the everything for the job : jobId the data is {---}
        await state.set('PaidJobs', PaidJobId, {
            ...PaidJobData,
            status:'fetching trending videos of the niche.'
        })




        const searchURL =`https://www.googleapis.com/youtube/v3/search?part=snippet&q=
                        ${encodeURIComponent(niche)}&type=video&maxResults=10&order=viewCount&regionCode=${region}&key=${YOUTUBE_API_KEY}`;


        const Response = await fetch(searchURL)
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

        }else{
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
        logger.error('Error in fetching trending videos ', { error:error.message})

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
            topic:"paidUser.trendVid.error",
            data:{
                PaidJobId,
                email,
                error:'failed to fetch trending videos.Please try again'
            }
        })
        
    }


}