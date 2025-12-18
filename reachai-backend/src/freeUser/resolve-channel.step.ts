//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-2: converts yt handler or name to channelID using youtube data api.
//need to learn youtube api data.

/*------------------------------------------------------
When going from API → Step, use subscribes.
When going from Step → Step, use listensOn.
*/

export const config= {
    name:"ResolveChannel",
    type:'event',
    subscribes:["yt.submit"],
    emits:["yt.channel.resolved", "yt.channel.error"],
    // flows: ["youtube-channel-resolving"]
    flows: ['optimized-youtube-reach']
}



export const handler = async (eventData:any , { emit, logger, state }:any)=>{

    let jobId:string | undefined
    let email:string | undefined

    try {

        const data = eventData || {}

        jobId= data.jobId
        email = data.email
        // const channel = data.channel

//even if user forgot to add @ then we will add that.
        let input = data.channel.trim()

        if (!input.startsWith("@")) {
            input = "@" + input
        }

        const channel = input





        logger.info('Resolving youtube channel----', {
            jobId, channel
        })

        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
        if(!YOUTUBE_API_KEY){
            throw new Error("Youtube api key not configured")
        }

        
        const jobData = await state.get('jobs', jobId)
        logger.info('------------from prev even data from state --------:', jobData.region)


        //now setting the everything for the job : jobId the data is {---}
        await state.set('jobs',jobId, {
            ...jobData,
            status:'resolving_channel'
        })



//######## here we extracting the channel id by using channel handle of the user.
        let channelId:string | null = null
        let channelName:string =""

        if(channel.startsWith('@')){
            const handle = channel.substring(1)
            const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet
            &type=channel&q=${encodeURIComponent(handle)}&key=${YOUTUBE_API_KEY}`

        
            const searchResponse = await fetch(searchURL)
            const searchData = await searchResponse.json()     //read about this like what are the things it returns

            if( searchData.items  &&  searchData.items.length >0){
                channelId = searchData.items[0].snippet.channelId
                channelName = searchData.items[0].snippet.title
            }

        }else{
            //if without using '@'
           const searchURL = `https://www.googleapis.com/youtube/v3/search?
           part=snippet&type=channel&q=${encodeURIComponent(channel)}&key=${YOUTUBE_API_KEY}`


            const searchResponse = await fetch(searchURL)
            const searchData = await searchResponse.json() 

             if( searchData.items  &&  searchData.items.length >0){
                channelId = searchData.items[0].snippet.channelId
                channelName = searchData.items[0].snippet.title
            }

        }


        //if we not able to grap channel id ---- mark as failed
        if(!channelId){
            logger.error('Channel not found', {channel})

            await state.set('jobs', jobId,{
                ...jobData,
                status:'failed',
                error:'channel not found'
            });

            await emit({
            topic:'yt.channel.error',
            data:{
                jobId,
                email
            }
        });

        return
        }


        //after resolving channel id --> working good
        // logger.info('after resolvinf channel. channel Id is ----', {
        //     channelId
        // })

        //emit data--> successfully resolved.
        await emit({
            topic:'yt.channel.resolved',
            data:{
                jobId,
                channelId,
                channelName,
                email
            }
        })

        return

        
    } catch (error:any) {
        logger.error('Error in resolving channel', { error:error.message})

        if(!jobId  ||  !email){
            logger.error("Cannot send error notification - missing jobId or email")
            return
        }

        const jobData = await state.get('jobs', jobId,)

        //set the status of the job to failed.
        await state.set('jobs', jobId,{
            ...jobData,
            status:'failed',
            error:error.message
        })

        await emit({
            topic:"yt.channel.error",
            data:{
                jobId,
                email,
                error:'failed to resolve channel. Please try again'
            }
        })
        
    }
}

