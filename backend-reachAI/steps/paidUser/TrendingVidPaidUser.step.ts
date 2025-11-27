
export const config= {
    name:"FetchVideos",
    type:'event',
    subscribes:["paidUser.payment.success"],
    emits:[],
    // flows: ["youtube-channel-resolving"]
     flows: ['Paid User workflow']
}



export const handler = async (eventData:any , { emit, logger, state }:any)=>{
}