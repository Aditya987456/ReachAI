//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-4: filter the videos from the fetched videos of the user in shorts , long total should be at max 6


export const config= {
    name:"filter-videos",
    type:'event',
    subscribes:["yt.videos.fetched"],
    emits:["yt.videos.filtered", "yt.niche.error"]
}