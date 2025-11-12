//  ---  this is the event 

import { EventConfig, Logger } from "motia";

//step-6: fetch the trending videos of that niche


export const config= {
    name:"fetch-trending-videos",
    type:'event',
    subscribes:["yt.niche.fetched"],
    emits:["yt.trendingVideos.fetched", "yt.trendingVideos.error"]
}