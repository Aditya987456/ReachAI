// //  ---  this is the event 

// import { EventConfig, Logger } from "motia";

// //step-8: Sending email using Resend with AI optimized titles.


// export const config= {
//     name:"send-email-with-titles",
//     type:'event',
//     subscribes:["yt.AI-Title.fetched"],
//     emits:["yt.titles.Email-Send", "yt.titles.Email-Send.error"],
//     flows: ['optimized-youtube-reach']
// }








// export const handler = async (eventData:any , { emit, logger, state }:any)=>{

//     let jobId:string | undefined
//     let email:string | undefined
//     // let channelName:string | undefined

//     try {

//         const data = eventData || {}

//         jobId= data.jobId
//         email = data.email
//         const channelName = data.channelName
//         const channelId = data.channelId
//         const ImprovedTitles = data.ImprovedTitles


//         logger.info('Sending email with optimized titles --> ', {
//             jobId,
//             channelId
//         })

//         const RESEND_API_KEY = process.env.RESEND_API_KEY
//         const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL
//         if(!RESEND_API_KEY){
//             throw new Error("Resend api key not configured")
//         }

//          const jobData = await state.get('jobs', jobId)

//     //now setting the everything for the job : jobId the data is {---}
//         await state.set('jobs', jobId, {
//             ...jobData,
//             status:'Sending email with optimized titles'
//         })

//         const emailText = GenerateEmailHTML(channelName, ImprovedTitles )

//         const response = await fetch('https://api.resend.com/emails', {
//             method:'POST',
//             headers:{
//                 'Content-Type':'application/json',
//                 'Authorization':`Bearer ${RESEND_API_KEY}`
//             },
//             body: JSON.stringify({
//                 from:RESEND_FROM_EMAIL,
//                 to:[ email],
//                 subject:`New titles for ${channelName}`,
//                 html: htmlBody,
//                 text: textBody
//             }),
//         })


//         // if there is error in sending titles on email...
//         if(!response.ok){
//             const errorData = await response.json()
//             throw new Error(`Resend API error : ${errorData.error?.message} || 'unknown Email error `)
//         }

//         const emailResult = await response.json()

//         logger.info('Email send successfully', {
//             jobId,
//             emailId:emailResult.id
//         })




//     await state.set('jobs', jobId, {

//     ...jobData,
//       status: "completed",
//       emailId:emailResult.id,
//       CompletedAt:new Date().toISOString()
//     });

//     await emit({
//       topic: "yt.titles.Email-Send",
//       data: {
//         jobId,
//         email,
//         // channelName,
//         // channelId,
//         // ImprovedTitles,
//         emailId:emailResult.id,
//       },
      
//     });




//     } catch (error:any) {
//         logger.error('Error in sending email with optimized titles ', { error:error.message})

//         if(!jobId){
//             logger.error("Cannot send error notification - missing jobId")
//             return
//         }

//         const jobData = await state.get('jobs', jobId)

//         await state.set('jobs', jobId,{
//             ...jobData,
//             status:'failed',
//             error:error.message
//         })

//         //optional may no need to emit this.
//         await emit({
//             topic:"yt.titles.Email-Send.error",
//             data:{
//                 jobId,
//                 email,
//                 error:'failed to send the email with AI optimized titles.Please try again'
//             }
//         })
        
//     }
// }



// //method to generate the email text.

// export function GenerateEmailTEXT(channelName: string, titles: any[]) {
//   let text = `Your Optimized YouTube Titles for ${channelName}\n\n`;

//   titles.forEach((t, i) => {
//     text += `
// ${i + 1}.
// Original:
// ${t.original}

// Optimized 1: ${t.improved1}
// Optimized 2: ${t.improved2}

// Why: ${t.Why}
// URL: ${t.url}

// --------------------------
// `;
//   });

//   text += `
// Upgrade for full SEO metadata (₹89):
// https://reachai.app/upgrade

// Keep creating,
// ReachAI — Smarter YouTube Growth
// https://reachai.app
// `;

//   return text;
// }



// export function GenerateEmailHTML(channelName: string, titles: any[]) {
//   let html = `
// <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8; padding:20px; font-family:Arial, sans-serif;">
//   <tr>
//     <td align="center">
//       <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:25px;">
        
//         <tr>
//           <td style="font-size:20px; font-weight:bold; color:#333333;">
//             🚀 Your Optimized YouTube Titles Are Ready!
//           </td>
//         </tr>

//         <tr><td style="height:10px;"></td></tr>

//         <tr>
//           <td style="font-size:15px; color:#444444; line-height:1.6;">
//             Hey Creator 👋,<br><br>
//             Your AI-curated, trend-driven, SEO-ready titles for <b>${channelName}</b> are ready to boost your reach!
//           </td>
//         </tr>

//         <tr><td style="height:15px;"></td></tr>

//         <tr>
//           <td style="font-size:14px; color:#444444; font-weight:bold;">
//             These titles were crafted using:
//           </td>
//         </tr>

//         <tr>
//           <td>
//             <ul style="font-size:14px; color:#555555; padding-left:20px; margin-top:5px;">
//               <li>Your latest uploads</li>
//               <li>Smart niche analysis</li>
//               <li>Current trending videos</li>
//               <li>Proven YouTube SEO patterns & CTR psychology</li>
//             </ul>
//           </td>
//         </tr>

//         <tr><td style="height:20px;"></td></tr>

//         <tr>
//           <td style="font-size:16px; font-weight:bold; color:#d00000; border-bottom:1px solid #eee; padding-bottom:8px;">
//             ✨ Optimized Titles
//           </td>
//         </tr>
//   `;

//   titles.forEach((t: any, i: number) => {
//     html += `
//       <tr><td style="height:10px;"></td></tr>
//       <tr>
//         <td style="font-size:14px; color:#333333;">
//           <b>${i + 1}. Original:</b><br>
//           "${t.original}"
//           <br><br>
          
//           <b>→ Optimized Title 1:</b><br>
//           "${t.improved1}"
//           <br><br>

//           <b>→ Optimized Title 2:</b><br>
//           "${t.improved2}"
//           <br><br>

//           <b>🎯 Why it works:</b> ${t.Why}
//           <br><br>

//           <a href="${t.url}" style="color:#d00000; font-weight:bold; text-decoration:none;">
//             🔗 Watch here
//           </a>

//           <br><br>
//           <hr style="border:0; border-top:1px solid #eee;">
//         </td>
//       </tr>
//     `;
//   });

//   html += `
//         <tr><td style="height:25px;"></td></tr>

//         <tr>
//           <td style="font-size:15px; font-weight:bold; color:#333;">
//             🚀 Want the Full SEO Advantage?
//           </td>
//         </tr>

//         <tr><td style="height:10px;"></td></tr>

//         <tr>
//           <td style="font-size:14px; color:#555555; line-height:1.5;">
//             Unlock complete metadata for all your videos:
//             <ul style="padding-left:20px; color:#555;">
//               <li>SEO-rich descriptions</li>
//               <li>High-impact tags & hashtags</li>
//               <li>Keyword strategy tailored to your niche</li>
//             </ul>
//             All this for just <b>₹89</b>.
//           </td>
//         </tr>

//         <tr><td style="height:15px;"></td></tr>

//         <tr>
//           <td align="center">
//             <a href="https://reachai.app/upgrade" style="
//               display:inline-block;
//               padding:14px 28px;
//               background:#ff0000;
//               color:#ffffff;
//               text-decoration:none;
//               font-size:16px;
//               font-weight:bold;
//               border-radius:6px;
//             ">
//               👉 Upgrade Now — Unlock Full SEO Power
//             </a>
//           </td>
//         </tr>

//         <tr><td style="height:25px;"></td></tr>

//         <tr>
//           <td style="font-size:14px; color:#777; text-align:center;">
//             Keep creating,<br>
//             <b>ReachAI — Smarter YouTube Growth</b><br>
//             <a href="https://reachai.app" style="color:#d00000; text-decoration:none;">https://reachai.app</a>
//           </td>
//         </tr>

//       </table>
//     </td>
//   </tr>
// </table>
// `;

//   return html;
// }



























// --- this is the event
import { EventConfig, Logger } from "motia";

/**
 * Step-8: Send email using Resend with AI optimized titles.
 */

export const config = {
  name: "send-email-with-titles",
  type: "event",
  subscribes: ["yt.AI-Title.fetched"],
  emits: ["yt.titles.Email-Send", "yt.titles.Email-Send.error"],
  flows: ["optimized-youtube-reach"],
};

type ImprovedTitle = {
  original: string;
  improved1: string;
  improved2: string;
  Why?: string;
  url?: string;
};

export const handler = async (
  eventData: any,
  { emit, logger, state }: { emit: any; logger: Logger; state: any }
) => {
  let jobId: string | undefined;
  let email: string | undefined;

  try {
    const data = eventData || {};

    jobId = data.jobId;
    email = data.email;
    const channelName: string = data.channelName;
    const channelId:string = data.channelId
    const ImprovedTitles: ImprovedTitle[] = data.ImprovedTitles || [];

    logger.info("send-email-with-titles triggered", { jobId, email });

    if (!jobId) throw new Error("Missing jobId");
    if (!email) throw new Error("Missing email");
    if (!channelId) throw new Error("Missing channelId");
    if (!channelName) throw new Error("Missing channelName");
    if (!Array.isArray(ImprovedTitles) || ImprovedTitles.length === 0)
      throw new Error("ImprovedTitles empty");

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

    if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
    if (!RESEND_FROM_EMAIL) throw new Error("Missing RESEND_FROM_EMAIL");

    const jobData = await state.get("jobs", jobId);

    //const channelId = jobData.

    if (jobData?.emailId && jobData?.status === "completed") {
      logger.info("Email already sent — skipping.");
      await emit({
        topic: "yt.titles.Email-Send",
        data: { jobId, email, emailId: jobData.emailId, alreadySent: true },
      });
      return;
    }

    await state.set("jobs", jobId, {
      ...(jobData || {}),
      status: "sending_email",
      updatedAt: new Date().toISOString(),
    });

    const htmlBody = GenerateEmailHTML(channelName, ImprovedTitles, channelId, email);
    const textBody = GenerateEmailTEXT(channelName, ImprovedTitles, channelId, email);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [email],
        subject: `Your Optimized Titles for ${channelName}`,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!res.ok) throw new Error("Resend API failed");

    const resJson = await res.json();
    const emailId = resJson?.id;

    await state.set("jobs", jobId, {
      ...(jobData || {}),
      status: "completed",
      emailId,
      completedAt: new Date().toISOString(),
    });

    await emit({
      topic: "yt.titles.Email-Send",
      data: { jobId, email, emailId },
    });
  
  }
   catch (err: any) {
    logger.error("Email send failed", { error: err.message });

    if (jobId) {
      const jobData = await state.get("jobs", jobId);
      await state.set("jobs", jobId, {
        ...(jobData || {}),
        status: "failed",
        error: err.message,
      });
    }

    await emit({
      topic: "yt.titles.Email-Send.error",
      data: { jobId, email, error: err.message },
    });
  }
};

/* ---------------- Text fallback ---------------- */

export function GenerateEmailTEXT(channelName: string, titles: ImprovedTitle[], channelId:string, email:string) {
  let text = `Your Optimized YouTube Titles for ${channelName}\n\n`;
  titles.forEach((t, i) => {
    text += `Video ${i + 1}\n`;
    text += `Original: ${t.original}\n`;
    text += `Improved 1: ${t.improved1}\n`;
    text += `Improved 2: ${t.improved2}\n`;
    if (t.Why) text += `Why: ${t.Why}\n`;
    if (t.url) text += `Watch: ${t.url}\n`;
    text += `\n--------------------------\n\n`;
  });

  text += `Upgrade for ₹99: Full SEO descriptions, tags, and keyword strategy.\n`;
  text += `${process.env.FRONTEND_URL}/pay/${channelId}?email=${email}`;
  text += `ReachAI — Smarter YouTube Growth\n`;
  return text;
}

/* ---------------- HTML Email (Version A, YouTube Red) ---------------- */

export function GenerateEmailHTML(channelName: string, titles: ImprovedTitle[],channelId:string, email:string) {
  const ytRed = "#FF0000";
const urlCTA = `${process.env.FRONTEND_URL}/pay/${channelId}?email=${email}`;



return `
<!DOCTYPE html>
<html>
  <body style=" margin:0; padding:0; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:10px;">

            <!-- HEADER -->
           

            <tr>
              <td style="font-size:15px; color:#333; line-height:1.5; padding-bottom:15px;">
                <strong style="font-size:18px;">Hey Creator 👋,</strong><br>
                Your AI-powered, trend-driven, SEO-optimized titles for 
                <strong>${escapeHtml(channelName)}</strong> are here!
              </td>
            </tr>

            <!-- WHY IT WORKS -->
            <tr>
              <td style="font-size:14px; padding-bottom:20px; color:#444;">
                These were created using:
                <ul style="padding-left:18px; margin:8px 0;">
                  <li>Your latest uploads</li>
                  <li>Trending videos in your niche</li>
                  <li>CTR & SEO title psychology</li>
                  <!--<li>Real-time niche analysis</li>-->
                </ul>
              </td>
            </tr>

            <!-- TITLES SECTION -->
            <tr>
              <td style="font-size:20px; font-weight:700; color:#000000; padding-bottom:12px;">
                ✨ Optimized Titles
              </td>
            </tr>

          ${titles
  .map(
    (t, i) => `
    <!-- Video Block Wrapper -->
    <tr>
      <td style="padding-bottom:16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee; border-radius:8px; padding:0; background:#fff;">
          <tr>
            <td style="padding:12px 16px;">

              <!-- Video header -->
              <div style="font-size:15px; font-weight:600; color:#333; margin-bottom:6px;">
                Video ${i + 1} • 
                <a href="${escapeAttr(t.url)}" style="color:#ff0000; text-decoration:none;">Watch now →</a>
              </div>

              <!-- Original -->
              <div style="font-size:14px; color:#555; margin-bottom:6px;">
                <strong>Original:</strong> "${escapeHtml(t.original)}"
              </div>

              <!-- Improved 1 -->
              <div style="font-size:14px; color:#555; margin-bottom:6px;">
                <strong>Improved 1:</strong> "${escapeHtml(t.improved1)}"
              </div>

              <!-- Improved 2 -->
              <div style="font-size:14px; color:#555; margin-bottom:6px;">
                <strong>Improved 2:</strong> "${escapeHtml(t.improved2)}"
              </div>

              ${
                t.Why
                  ? `
              <div style="font-size:13px; color:#666; margin-top:10px;">
                <strong>Why it works:</strong> ${escapeHtml(t.Why)}
              </div>`
                  : ""
              }

            </td>
          </tr>
        </table>
      </td>
    </tr>`
  )
  .join("")}

              
              
              <!-- CTA -->
<tr>
  <td style="padding-top:30px;">
    <div style="
      border: 1px solid #ddd;
      border-radius: 12px;
      padding: 24px;
      background-color: #f9f9f9;
      font-family: Arial, sans-serif;
    ">
      <!-- Title -->
      <div style="font-size:16px; font-weight:bold; color:#111; margin-bottom:16px;">
        🚀 Unlock Complete Metadata for Your Latest 10 Videos
      </div>

      <!-- Bullet Points -->
      <ul style="padding-left:20px; margin:0 0 16px 0; color:#333; font-size:14px;">
        <li>SEO-rich descriptions</li>
        <li>Tags + Hashtags</li>
        <li>Keyword strategy tailored for your niche</li>
      </ul>

      <!-- Price -->
      <div style="font-size:14px; color:#333; text-align:center; margin-bottom:20px;">
        All this for just <strong>₹99</strong>.
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;">
        <a href="${urlCTA}"
          style="
            display:inline-block;
            background-color:#ff0000;
            color:#fff;
            padding:14px 28px;
            border-radius:8px;
            text-decoration:none;
            font-size:16px;
            font-weight:bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor:pointer;
          ">
          🔥 Upgrade & Boost SEO
        </a>
      </div>
    </div>
  </td>
</tr>


            <!-- FOOTER -->
            <!--<tr>-->
            <!--  <td style="font-size:13px; color:#777; padding-top:20px;">-->
            <!--    Keep creating,<br>-->
            <!--    <strong>ReachAI — Smarter YouTube Growth</strong><br>-->
            <!--    https://reachaiapp.vercel.app-->
            <!--  </td>-->
            <!--</tr>-->
            
            <!-- FOOTER -->
<tr>
  <td style="font-size:13px; color:#777; padding-top:24px; text-align:center; line-height:1.6;">
    Keep creating,<br>
    <strong style="color:#333;">ReachAI — Smarter YouTube Growth</strong><br>
    <a href="https://crateral-beastlier-kurtis.ngrok-free.dev/" style="color:#ff0000; text-decoration:none;">reachaiapp</a>
  </td>
</tr>


          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;







// return `<!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>ReachAI Email Preview</title>
//   </head>
//   <body style="margin:0; padding:0; background:#fafafa; font-family: Inter, Arial, sans-serif;">

//     <table width="100%" cellpadding="0" cellspacing="0">
//       <tr>
//         <td align="center">

//           <!-- MAIN CONTAINER -->
//           <table width="100%" cellpadding="0" cellspacing="0" style="max-width:650px; background:white; padding:28px; margin-top:20px; border-radius:14px; box-shadow:0 5px 20px rgba(0,0,0,0.08);">

//             <!-- HEADER -->
//             <tr>
//               <td style="padding-bottom:20px; text-align:center;">
//                 <!-- Accented Header Title (RED) -->
//                 <div style="font-size:24px; color:#111; font-weight:700; padding-bottom:8px; display:inline-block; border-bottom:3px solid #FF2D2D; line-height:1.2;">
//                   🚀 Your SEO-Optimized Titles Are Ready!
//                 </div>
//               </td>
//             </tr>

//             <tr>
//               <td style="font-size:16px; color:#333; line-height:1.6; padding-bottom:25px; text-align:center;">
//                 Hey Creator, <br>
//                 Your AI-powered, trend-driven, SEO-optimized titles for  
//                 <strong style="color:#000;">TechExplorer Daily</strong> are here!
//               </td>
//             </tr>

//             <!-- WHY SECTION -->
//             <tr>
//               <td style="font-size:15px; padding:16px; background:#fff8f8; border-radius:10px; color:#444; line-height:1.5; border:1px solid #ffebeb;">
//                 These titles are optimized using:
//                 <ul style="margin:10px 0 0 20px; padding:0;">
//                   <li>Your latest uploads</li>
//                   <li>Trending videos in your niche</li>
//                   <li>CTR & SEO title psychology</li>
//                 </ul>
//               </td>
//             </tr>

//             <!-- TITLES SECTION -->
//             <tr>
//               <td style="font-size:22px; font-weight:700; color:#000; padding:30px 0 15px;">
//                 ✨ Optimized Titles
//               </td>
//             </tr>

//             <!-- MOCK ITEM 1 - STACKABLE CARD -->
//             <tr>
//               <td style="padding-bottom:25px;">
//                 <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px; border:1px solid #e0e0e0; background:white; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
//                   <tr>
//                     <td style="padding:20px;">
                      
//                       <!--[if mso | IE]>
//                       <table align="left" border="0" cellpadding="0" cellspacing="0" width="600">
//                       <tr>
//                       <td align="left" valign="top" width="180">
//                       <![endif]-->

//                       <!-- LEFT COLUMN: THUMBNAIL WRAPPER -->
//                       <div style="display:inline-block; width:100%; max-width:180px; vertical-align:top;">
//                         <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;">
//                           <tr>
//                             <td style="padding-bottom:10px;">
//                               <a href="#" style="display:block; text-decoration:none;">
//                                 <img src="https://placehold.co/180x101/ffcccc/b00000?text=Video+%E2%96%B6" 
//                                      alt="Watch Video" 
//                                      width="180" height="101"
//                                      style="width:100%; max-width:180px; height:auto; border-radius:8px; display:block; border:0;">
//                               </a>
//                             </td>
//                           </tr>
//                         </table>
//                       </div>

//                       <!--[if mso | IE]>
//                       </td>
//                       <td align="left" valign="top" width="420" style="padding-left: 20px;">
//                       <![endif]-->

//                       <!-- RIGHT COLUMN: TEXT CONTENT WRAPPER -->
//                       <div style="display:inline-block; width:100%; max-width:420px; vertical-align:top; padding-left:15px;">
//                         <table width="100%" cellpadding="0" cellspacing="0">
//                           <tr>
//                             <td>
//                               <div style="font-size:16px; font-weight:600; color:#111; margin-bottom:6px; margin-top: -5px;">
//                                 Video 1 • 
//                                 <a href="#" 
//                                    style="color:#E53935; text-decoration:none; font-weight:600;">
//                                   View →  
//                                 </a>
//                               </div>

//                               <div style="font-size:14px; color:#555; margin-bottom:4px;">
//                                 <strong>Original:</strong> “Reviewing the new Camera”
//                               </div>

//                               <div style="font-size:14px; color:#555; margin-bottom:4px;">
//                                 <strong>Improved 1:</strong> “Is This Camera Worth The Hype? Honest Review”
//                               </div>

//                               <div style="font-size:14px; color:#555; margin-bottom:12px;">
//                                 <strong>Improved 2:</strong> “Stop! Don't Buy a Camera Until You See This”
//                               </div>
                              
//                               <div style="font-size:13px; color:#666; background:#fef0f0; padding:10px; border-radius:8px; border:1px solid #ffe0e0;">
//                                 <strong>Why it works:</strong> Creates immediate curiosity and addresses potential buyer's remorse, increasing click-through rate.
//                               </div>
//                             </td>
//                           </tr>
//                         </table>
//                       </div>

//                       <!--[if mso | IE]>
//                       </td>
//                       </tr>
//                       </table>
//                       <![endif]-->

//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>

//             <!-- MOCK ITEM 2 - STACKABLE CARD -->
//             <tr>
//               <td style="padding-bottom:25px;">
//                 <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px; border:1px solid #e0e0e0; background:white; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
//                   <tr>
//                     <td style="padding:20px;">
                      
//                       <!--[if mso | IE]>
//                       <table align="left" border="0" cellpadding="0" cellspacing="0" width="600">
//                       <tr>
//                       <td align="left" valign="top" width="180">
//                       <![endif]-->

//                       <!-- LEFT COLUMN: THUMBNAIL WRAPPER -->
//                       <div style="display:inline-block; width:100%; max-width:180px; vertical-align:top;">
//                         <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;">
//                           <tr>
//                             <td style="padding-bottom:10px;">
//                               <a href="#" style="display:block; text-decoration:none;">
//                                 <img src="https://placehold.co/180x101/ffcccc/b00000?text=Video+%E2%96%B6" 
//                                      alt="Watch Video" 
//                                      width="180" height="101"
//                                      style="width:100%; max-width:180px; height:auto; border-radius:8px; display:block; border:0;">
//                               </a>
//                             </td>
//                           </tr>
//                         </table>
//                       </div>

//                       <!--[if mso | IE]>
//                       </td>
//                       <td align="left" valign="top" width="420" style="padding-left: 20px;">
//                       <![endif]-->

//                       <!-- RIGHT COLUMN: TEXT CONTENT WRAPPER -->
//                       <div style="display:inline-block; width:100%; max-width:420px; vertical-align:top; padding-left:15px;">
//                         <table width="100%" cellpadding="0" cellspacing="0">
//                           <tr>
//                             <td>
//                               <div style="font-size:16px; font-weight:600; color:#111; margin-bottom:6px; margin-top: -5px;">
//                                 Video 2 • 
//                                 <a href="#" 
//                                    style="color:#E53935; text-decoration:none; font-weight:600;">
//                                   View →  
//                                 </a>
//                               </div>

//                               <div style="font-size:14px; color:#555; margin-bottom:4px;">
//                                 <strong>Original:</strong> “My Trip to Japan Vlog”
//                               </div>

//                               <div style="font-size:14px; color:#555; margin-bottom:4px;">
//                                 <strong>Improved 1:</strong> “I Moved to Japan... Here is the Truth”
//                               </div>

//                               <div style="font-size:14px; color:#555; margin-bottom:12px;">
//                                 <strong>Improved 2:</strong> “10 Things I Wish I Knew Before Visiting Japan”
//                               </div>
                              
//                               <div style="font-size:13px; color:#666; background:#fef0f0; padding:10px; border-radius:8px; border:1px solid #ffe0e0;">
//                                 <strong>Why it works:</strong> Focuses on insider knowledge and personal transformation, which performs well in travel niches.
//                               </div>
//                             </td>
//                           </tr>
//                         </table>
//                       </div>

//                       <!--[if mso | IE]>
//                       </td>
//                       </tr>
//                       </table>
//                       <![endif]-->

//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>

//             <!-- CTA SECTION -->
//             <tr>
//               <td style="padding-top:35px;">
//                 <div style="background:#fff4f4; border:1px solid #ffcccc; padding:28px; border-radius:14px; box-shadow:0 4px 18px rgba(255,0,0,0.1); text-align:center;">

//                   <div style="font-size:18px; font-weight:bold; color:#B00000; margin-bottom:12px;">
//                     🚀 Unlock Full Metadata for All 10 Videos
//                   </div>

//                   <ul style="font-size:14px; color:#444; text-align:left; max-width:300px; margin:0 auto 18px;">
//                     <li>SEO-rich descriptions</li>
//                     <li>Tags + Hashtags</li>
//                     <li>Niche-targeted keyword strategy</li>
//                     <li>Better ranking + more clicks</li>
//                   </ul>

//                   <div style="font-size:15px; margin-bottom:18px; color:#333;">
//                     Everything for just <strong style="color:#D00000;">₹99</strong>.
//                   </div>

//                   <a href="#"
//                     style="
//                       display:inline-block;
//                       background:#FF2D2D;
//                       color:#fff;
//                       padding:16px 32px;
//                       border-radius:10px;
//                       text-decoration:none;
//                       font-size:17px;
//                       font-weight:700;
//                       box-shadow:0 6px 16px rgba(255,0,0,0.25);
//                     ">
//                     🔥 Upgrade & Boost Your Channel
//                   </a>

//                 </div>
//               </td>
//             </tr>

//             <!-- FOOTER -->
//             <tr>
//               <td style="font-size:12px; color:#777; padding-top:32px; text-align:center;">
//                 Keep creating <br>
//                 <strong style="color:#333;">ReachAI — Smarter YouTube Growth</strong><br>
//                 <a href="https://crateral-beastlier-kurtis.ngrok-free.dev/" style="color:#E53935; text-decoration:none;">reachaiapp</a>
//               </td>
//             </tr>

//           </table>
//         </td>
//       </tr>
//     </table>

//   </body>
// </html>s`;


}

/* -------- Escape helpers -------- */

function escapeHtml(str?: string) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str?: string) {
  if (!str) return "";
  return String(str).replace(/"/g, "%22").replace(/\n/g, "");
}
