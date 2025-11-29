
export const config= {
    name:"email final metadata ",
    type:'event',
    subscribes:["paidUser.AImetadata.success"],
    emits:[],
    // flows: ["youtube-channel-resolving"]
     flows: ['Paid User workflow']
}



export const handler = async (eventData:any , { emit, logger, state }:any)=>{
}