//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-5: fetch the niche of the user's channel using latest fetched 5 videos.


export const config= {
    name:"fetch-niche",
    type:'event',
    subscribes:["yt.videos.filtered"],
    emits:["yt.niche.fetched", "yt.niche.error"]
}