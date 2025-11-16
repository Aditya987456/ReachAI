import { ApiRouteConfig } from "motia";
import { v4 as uuidv4 } from "uuid";

/*
Every route needs its own config because that’s how Motia registers it in the internal routing table (instead of using app.get() or app.post() manually like Express).
*/

//### Accept channel name and email to start the workflow.
export const config:ApiRouteConfig = {
    name:"SubmitChannel",
    type:"api",
    path:"/submit",
    method:"POST",
    emits: ["yt.submit"],
    flows: ['optimized-youtube-reach']
}


interface SubmitRequest {
    channel : string
    email: string
}


//###  This is your actual business logic — the equivalent of Express’s req, res => {...} function.

/*

// Define the route configuration for Motia
export const config = {
  // 👇 A unique name for this API route (Motia identifies it by this name)
  name: 'CreateUser',

  // 👇 This tells Motia that this file defines an API route
  type: 'api',

  // 👇 The endpoint path that the frontend or another service will call
  path: '/user',

  // 👇 The HTTP method for this route
  method: 'POST',

  // 👇 Optional: automatically emit this event after successful execution
  emit: 'UserCreated',
}

// 👇 The function that runs whenever someone calls POST /user
export const handler = async (req, { emit, logger, state }) => {
  // 🧾 `req` = HTTP request (includes body, headers, etc.)
  const user = req.body  // Extract user data sent from the frontend

  // 🧠 `state` = key-value store that persists during the flow or current request chain
  // You can save temporary info here to access later in the same flow
  state.set('currentUser', user.name) // Save data in Motia’s state memory

  // 🧩 `logger` = built-in logging tool
  // Logs appear in your console or Motia dashboard for debugging
  logger.info('Received request to create user', { user }) // Log request details

  // 🧨 Conditional manual emit example
  if (user.isAdmin) {
    await emit('AdminUserCreated', user)
    logger.info('Admin user created event emitted', { user })
  }

  // 🧩 You can even read data from the state again later
  const currentUserName = state.get('currentUser')
  logger.debug('Current user in state', { currentUserName })

  // ✅ Return HTTP response
  // This goes back to the frontend
  // Motia also auto-emits "UserCreated" (as defined in config)
  return {
    status: 201,
    body: {
      message: `User ${currentUserName} created successfully!`,
      user,
    },
  }
}


-----------------------------------------------------------------------------------

So yes, there are two ways:

inside the handler → manual

inside config → automatic

-------------------------------------------------------------------------------------

Use const → for local variables

Use state → for shared data between steps or events

*/


export const handler = async (req:any , { emit, logger, state }:any)=>{
    try {

      

      //--firstly we printing what we are receiving.
        logger.info('Received submition request', { body: req.body})


        //checking data giving is correct type or not -- simple TS.
        const { channel, email }=req.body as SubmitRequest;

        //check if empty fields.
        if(!channel  ||  !email){
          return {
             status:400,
             body:{
                error:"Missing required fields : channel , email",
            }

          }
        }

        //validate the email using regex or Zod....????
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
          return {
            status:400,
            body:{
              error:"Invalid email formate",
            }
          }
        }


        //---detecting the region of the user.
        const region = "IN"  //currently its india but will update this.



        //creating jobId
        const jobId = uuidv4();

        //set the information in this job.-- abhi jo request ua uska ek jobId ban gaya.
        await state.set(`jobs`, jobId , {
          //data of the job
          jobId,
          channel,
          email,
          region,
          status:"queued",
          CreatedAt: new Date().toISOString()
        })






        logger.info('-------------Job created ------------ ', {jobId, email, channel})



        //like pub sub model -- like broadcast the info to other step or particular steps
        //i think we don't need here again if we already defined in config it automatically trigger here no manual need.
        await emit({
          topic:"yt.submit",
          //data that we providong to broadcast after emit --> to another event.
          data:{
            jobId,
            channel,
            email
          }
        })

      return{
        status:200,
        body:{
          success:true,
          jobId,
          message:"Your request has been queued. You will get an email soon with improved suggestions for your youtube videos"
        }
      }
        
        
    } catch (error:any) {
        logger.error("Error in submission handler", {error:error.message});
        return {
            status:500,
            body:{
                error:"Internal server error",
            }
        }   
    }
}