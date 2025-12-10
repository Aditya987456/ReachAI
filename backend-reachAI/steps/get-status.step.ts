import { ApiRouteConfig, Handlers } from 'motia'

 
export const config: ApiRouteConfig = {
  name: 'get-status',
  type: 'api',
  path: '/status',
  method: 'GET',
  flows: ['get-status-live'],
  emits: [],
}


export const handler = async (req:any, { emit, logger, state }:any) => {

    try {

      const jobId = req.queryParams.jobId;
        logger.info("jobId for GET", { jobId });

        if(!jobId){
            return {
                status: 400,
                body: { error: "Missing jobId" },
            };
        }

        const jobData = await state.get('jobs', jobId)

        if(!jobData){
            return {
                status: 404,
                body: { error: "Missing job data" },
            };
        }


        //if we found job data ---> since on each 2.5 sec this will get returned.
        
        return{
            status:200,
            body: {
                status: jobData.status

            }
        }
        
    } catch (error:any) {
        return{
            status:500,
            body:{
                error:"Internal server error",
                details:error.message
            }
        }
    }
 

}














































