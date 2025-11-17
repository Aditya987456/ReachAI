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
    const ImprovedTitles: ImprovedTitle[] = data.ImprovedTitles || [];

    logger.info("send-email-with-titles triggered", { jobId, email });

    if (!jobId) throw new Error("Missing jobId");
    if (!email) throw new Error("Missing email");
    if (!channelName) throw new Error("Missing channelName");
    if (!Array.isArray(ImprovedTitles) || ImprovedTitles.length === 0)
      throw new Error("ImprovedTitles empty");

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

    if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
    if (!RESEND_FROM_EMAIL) throw new Error("Missing RESEND_FROM_EMAIL");

    const jobData = await state.get("jobs", jobId);

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

    const htmlBody = GenerateEmailHTML(channelName, ImprovedTitles);
    const textBody = GenerateEmailTEXT(channelName, ImprovedTitles);

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
  } catch (err: any) {
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

export function GenerateEmailTEXT(channelName: string, titles: ImprovedTitle[]) {
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

  text += `Upgrade for ₹89: Full SEO descriptions, tags, and keyword strategy.\n`;
  text += `https://reachai.app/upgrade\n\n`;
  text += `ReachAI — Smarter YouTube Growth\n`;
  return text;
}

/* ---------------- HTML Email (Version A, YouTube Red) ---------------- */

export function GenerateEmailHTML(channelName: string, titles: ImprovedTitle[]) {
  const ytRed = "#FF0000";

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
        All this for just <strong>₹89</strong>.
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;">
        <a href="https://reachai.app/upgrade"
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
            <!--    https://reachai.app-->
            <!--  </td>-->
            <!--</tr>-->
            
            <!-- FOOTER -->
<tr>
  <td style="font-size:13px; color:#777; padding-top:24px; text-align:center; line-height:1.6;">
    Keep creating,<br>
    <strong style="color:#333;">ReachAI — Smarter YouTube Growth</strong><br>
    <a href="https://reachai.app" style="color:#ff0000; text-decoration:none;">https://reachai.app</a>
  </td>
</tr>


          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
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
