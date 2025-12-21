
export const config= {
    name:"PaidJob-send-email final metadata ",
    type:'event',
    subscribes:["paidUser.AImetadata.success"],
    emits:["PaidUser.Email-Send.success", "PaidUser.Email-Send.error"],
    flows: ['Paid User workflow']
}


type ImprovedMetadataData = {

    // original: string;
    // improved1: string;
    // improved2: string;
    // description: string;
    // tags: string[];
    // hashtags:string[];

    // Why?: string;
    // url?: string;
    // thumbnail?: string;


    original_title:string;
    original_description:string;
    optimized_title_1: string;
    optimized_title_2: string;
    optimized_description: string;
    tags: string[];
    hashtags: string[];
    why?: string;
    url?: string;
    thumbnail?: string;

}




export const handler = async (eventData:any , { emit, logger, state }:any)=>{

    let PaidJobId:string | undefined
    let email:string | undefined

      try {
        const data = eventData || {};
    
        PaidJobId = data.PaidJobId;
        email = data.email;
        const channelName: string = data.channelName;
        const channelId: string = data.channelId;
        // const ImprovedMetadataData: ImprovedMetadataData[] = data.ImprovedMetadataData || [];
    
        logger.info("send-email-with-full metadata triggered", { PaidJobId, email });
    
        if (!PaidJobId) throw new Error("Missing jobId");
        if (!email) throw new Error("Missing email");
        if (!channelId) throw new Error("Missing channelId");
        if (!channelName) throw new Error("Missing channelName");
        // if (!ImprovedMetadataData?.length)
        //   throw new Error("ImprovedMetadataData empty");
    
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
    
        if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
        if (!RESEND_FROM_EMAIL) throw new Error("Missing RESEND_FROM_EMAIL");
    
    
        // Get video data from previous steps
        const PaidJobData = await state.get("PaidJobs", PaidJobId);
    
        if (PaidJobData?.emailSent === true) {
          logger.info("Email already sent — skipping", { PaidJobId });
          return;
        }






        const ImprovedMetadataData: ImprovedMetadataData[] = PaidJobData?.ImprovedMetadataData || [];

        if (!ImprovedMetadataData.length) {
          throw new Error("No ImprovedMetadataData found in state");
        }

        if (ImprovedMetadataData.length !== PaidJobData.videos.length) {
          throw new Error(
            `Email metadata mismatch: expected ${PaidJobData.videos.length}, got ${ImprovedMetadataData.length}`
          );
        }





    
        const videoList = PaidJobData?.videos || [];
    

        // Merge thumbnails + url of video from video list of user into ImprovedMetadata
        const MetadataWithThumb = ImprovedMetadataData.map((items, i) => ({
          ...items,
          thumbnail: videoList[i]?.thumbnail || null,
          url: videoList[i]?.url || items.url
        }));



    

    
      // prevent double send  ---->
        if (PaidJobData?.emailSent === true) {
          logger.info("Email already sent — skipping", { PaidJobId });
          return;
        }

    
    
    
    
    
      //   await state.set("PaidJobs", PaidJobId, {
      //   ...(PaidJobData || {}),
      //   status: "completed",
      //   email,
      //   emailSent: true,
      //   emailSentAt: new Date().toISOString(),
      // });

    
    

        // Generate email
        const htmlBody = GenerateEmailHTMLPaid(
          channelName,
          MetadataWithThumb,     //isme sab hai url, thumb pura.
          channelId,
          email
        );
    
        const textBody = GenerateEmailTEXT(
          channelName,
          MetadataWithThumb,
          channelId,
          email
        );
    
    
    
    
    
    

    
    
    
    
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Idempotency-Key": `paidjob-email-${PaidJobId}`,
          },
          body: JSON.stringify({
            from: RESEND_FROM_EMAIL,
            to: [email],
            subject: `Your Optimized metadata for ${channelName}`,
            html: htmlBody,
            text: textBody,
          }),
        });
    
        if (!res.ok) throw new Error("Resend API failed");
    
        const resJson = await res.json();
        const emailId = resJson?.id;
    



      await state.set("PaidJobs", PaidJobId, {
        ...(PaidJobData || {}),
        status: "completed",
        emailSent: true,
        emailSentAt: new Date().toISOString(),
        emailId,
        completedAt: new Date().toISOString(),
      });






        
        // await state.set("PaidJobs", PaidJobId, {
        //   ...(PaidJobData || {}),
        //   status: "completed",
        //   emailId,
        //   completedAt: new Date().toISOString(),
        // });
    
        await emit({
          topic: "PaidUser.Email-Send.success",
          data: { PaidJobId, email, emailId },
        });
    

      } 
      catch (err: any) {
        logger.error("Email send failed paiduser", { error: err.message });
    
        if (PaidJobId) {
          const PaidJobData = await state.get("PaidJobs", PaidJobId);
          await state.set("PaidJobs", PaidJobId, {
            ...(PaidJobData || {}),
            status: "failed",
            error: err.message,
          });
        }
    
        await emit({
          topic: "PaidUser.Email-Send.error",
          data: { PaidJobId, email, error: err.message },
        });
      }


}





/* -------------------------------------------------------------------
-------------------- TEXT FALLBACK -----------------------------------
---------------------------------------------------------------------*/
export function GenerateEmailTEXT(
  channelName: string,
  MetadataWithThumb: ImprovedMetadataData[],
  channelId: string,
  email: string
) {
  let text = `Your Optimized metadata for your youtube channel ${channelName}\n\n`;
  MetadataWithThumb.forEach((t, i) => {
    text += `Video ${i + 1}\n`;
    text += `Original: ${t.original_title}\n`;
    text += `Improved title 1: ${t.optimized_title_1}\n`;
    text += `Improved title 2: ${t.optimized_title_2}\n`;
    text += `Description : ${t.original_description}\n`;
    text += `Tags : ${t.tags}\n`;
    text += `Hashtags : ${t.hashtags}\n`;
    if (t.why) text += `Why: ${t.why}\n`;
    if (t.url) text += `Watch: ${t.url}\n`;
    text += `\n--------------------------\n\n`;
  });

  text += `\nReachAI — Smarter YouTube Growth\n`;
  return text;
}









/* -------------------------------------------------------------------
-------------------- HTML DESIGN -----------------------------------
---------------------------------------------------------------------*/


/* ---------------- HTML Email (Paid Version — Full Premium Metadata) ---------------- */

export function GenerateEmailHTMLPaid(
  channelName: string,
  MetadataWithThumb: ImprovedMetadataData[],
  channelId: string,
  email: string
) {

  return `<!DOCTYPE html>

<html>
<head>
<meta charset="utf-8"/>
<style>
  table { border-collapse: collapse; }
  img { display:block; outline:none; text-decoration:none; }
  body {
    margin:0;
    padding:0;
    font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;
    background:#ffffff;
  }
</style>
</head>

<body>

<!-- FULL BACKGROUND -->
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
<tr>
<td align="center">

<!-- 650px CONTAINER -->
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:650px;margin:auto;">

<!-- =================================== HEADER START =================================== -->
<tr>
  <td style="padding:24px 16px 10px 16px;">
    <table width="100%">
      <tr>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:20px;font-weight:700;color:#111;"> Hey Creator </td>
            <td style="font-size:18px; padding-left:4px">👋 </td>
          </tr>
        </table>
      </tr>
    </table>
  </td>
</tr>

<tr>
  <td style="padding:0 16px 14px 16px;">
    <table width="100%">
      <tr>



<table cellpadding="0" cellspacing="0" width="100%">
  <tr>
    <td
      style="
        font-size:14px;
        color:#555;
        line-height:20px;
        vertical-align:middle;
        font-family: Arial, Helvetica, sans-serif;
      "
    >
      Your complete AI-powered SEO metadata bundle for your YouTube channel
      <strong style="color:#111;">
        ${escapeHtmlWithEmoji(channelName)}
      </strong>
      is ready! 
    </td>
    
  </tr>
</table>

<table cellpadding="0" cellspacing="0" width="100%">
  <tr>
    <td
      style="
        font-size:14px;
        color:#555;
        line-height:20px;
        font-family: Arial, Helvetica, sans-serif;
      "
    >
      Each video includes optimized titles, descriptions, tags, hashtags, and strategic insights.
    </td>
  </tr>
</table>




        










      </tr>
    </table>
  </td>
</tr>
<!-- =================================== HEADER END =================================== -->

<!-- =================================== SECTION TITLE =================================== -->
<tr>
  <td style="padding:0 8px;">
    <table width="100%">
      <tr>
        <td style="font-size:16px; font-weight:700; color:#111; border-left:4px solid #ff0000; padding:12px 0 12px 12px;">
          Complete SEO Metadata Bundle
          <span style="color:#666; font-weight:400; margin-left:8px; font-size:13px;">
            (${MetadataWithThumb.length} videos)
          </span>
        </td>
      </tr>
    </table>
  </td>
</tr>
<!-- ========================================================================= -->

${MetadataWithThumb.map((t, i) => {


const id = extractYoutubeId(t.url);
const thumb = id
  ? `https://i.ytimg.com/vi/${id}/sddefault.jpg` 
  : escapeAttr(t.thumbnail || "");

return `

<!-- ==================== FULL PREMIUM VIDEO CARD ==================== -->
<tr>
<td style="padding:12px 8px;">
  <table width="100%" cellpadding="0" cellspacing="0" 
    style="border:1px solid #e5e7eb;border-radius:10px;border-collapse:separate;border-spacing:0;overflow:hidden;">
    
    <!-- CARD HEADER -->
    <tr>
      <td style="background:#f9fafb;padding:14px 16px;border-bottom:1px solid #e5e7eb;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:14px; padding-right:4px">🎬 </td>
            <td style="font-size:14px;font-weight:700;color:#111;"> Video ${i+1} </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:16px;background:#ffffff;">

        <!-- THUMBNAIL -->
        ${thumb ? `
        <table width="100%" style="margin-bottom:16px;">
          <tr>
            <td align="center">
              <img src="${thumb}" width="100%"
              style="max-width:618px;height:auto;border-radius:8px;">
            </td>
          </tr>
        </table>
        ` : ""}

        <!-- ORIGINAL TITLE -->
        <table width="100%">
          <tr><td style="font-size:12px;text-transform:uppercase;font-weight:700;color:#6b7280;">
            Original Title
          </td></tr>
          <tr><td style="padding-top:4px;font-size:14px;color:#111;">
            ${escapeHtmlWithEmoji(t.original_title)}
          </td></tr>
        </table>

        <table width="100%"><tr><td height="14"></td></tr></table>

        <!-- OPTIMIZED TITLES -->
        <table width="100%">
          <tr><td style="font-size:12px;text-transform:uppercase;font-weight:700;color:#d00000;">
            Optimized Titles
          </td></tr>
          
          <tr>
            <td style="padding-top:6px;">
              <table width="100%" style="background:#fffafa; border-radius:4px;">
                <tr><td style="padding:10px;font-size:13px;color:#111;">
                  <span style="font-weight:700;color:#d00000;">1:</span> 
                  ${escapeHtmlWithEmoji(t.optimized_title_1 )}
                </td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-top:6px;">
              <table width="100%" style="background:#fffafa; border-radius:4px;">
                <tr><td style="padding:10px;font-size:13px;color:#111;">
                  <span style="font-weight:700;color:#d00000;">2:</span>  
                  ${escapeHtmlWithEmoji(t.optimized_title_2)}
                </td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table width="100%"><tr><td height="14"></td></tr></table>

        <!-- SEO DESCRIPTION -->
        <table width="100%">
          <tr><td style="font-size:12px;text-transform:uppercase;font-weight:700;color:#d00000;">
            SEO Description
          </td></tr>
          <tr>
            <td style="padding-top:6px;">
              <table width="100%"
                style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;
                       border-collapse:separate;border-spacing:0;overflow:hidden;">
                <tr><td style="padding:12px; font-size:13px; color:#444;line-height:1.5;">
                  ${escapeHtmlWithEmoji(t.optimized_description || "Description not available")}
                </td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table width="100%"><tr><td height="14"></td></tr></table>

        <!-- TAGS -->
        <table width="100%">
          <tr><td style="font-size:12px;text-transform:uppercase;font-weight:700;color:#d00000;">
            Tags
          </td></tr>
          <tr>
            <td style="padding-top:6px;">
              <table width="100%"
                style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;
                       border-collapse:separate;border-spacing:0;overflow:hidden;">
                <tr><td style="padding:10px;font-size:13px;color:#444;">
                  ${(t.tags || []).join(", ")}
                </td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table width="100%"><tr><td height="10"></td></tr></table>

        <!-- HASHTAGS -->
        <table width="100%">
          <tr><td style="font-size:12px;text-transform:uppercase;font-weight:700;color:#d00000;">
            Hashtags
          </td></tr>
          <tr>
            <td style="padding-top:6px;">
              <table width="100%"
                style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;
                       border-collapse:separate;border-spacing:0;overflow:hidden;">
                <tr><td style="padding:10px;font-size:13px;color:#444;">
                  ${(t.hashtags || []).join(" ")}
                </td></tr>
              </table>
            </td>
          </tr>
        </table>

        ${t.why ? `
        <table width="100%"><tr><td height="14"></td></tr></table>

        <!-- WHY THIS WORKS -->
        <table width="100%" 
          style="background:#fffbeb; border-collapse:separate;border-spacing:0;overflow:hidden;">
          <tr>
            <td style="padding:10px;font-size:13px;color:#784f03;">
              <span style="font-size:12px;font-weight:700;text-transform:uppercase;color:#92400e;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:12px; padding-right:4px">💡</td>
                    <td style="font-size:12px; color:#92400e;">Why This Works</td>
                  </tr>
                </table>
              </span><br>
              ${escapeHtmlWithEmoji(t.why)}
            </td>
          </tr>
        </table>
        ` : ""}

      </td>
    </tr>
  </table>
</td>
</tr>
`;

}).join("")}



<!-- =================================== THANK YOU SECTION =================================== -->








<!-- =================================== SUGGESTIONS SECTION =================================== -->
<tr>
  <td style="padding:20px 8px;">
    <table width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid #e5e7eb;border-radius:10px;border-collapse:separate;border-spacing:0;overflow:hidden;">
      
      <!-- Header -->
      <tr>
        <td style="background:#f9fafb;padding:16px;border-bottom:1px solid #e5e7eb;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:16px;font-weight:700;color:#111;">Have Suggestions or Feedback?</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding:20px;background:#ffffff;">
          <table width="100%">
            <tr>
              <td style="font-size:14px;color:#444;line-height:1.6;padding-bottom:12px;">
               Your feedback helps us build features that matter most to creators like you.
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#444;line-height:1.6;padding-bottom:16px;">
                <strong style="color:#111;">Share your thoughts about:</strong>
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%">
                  <tr>
                    <td style="padding:4px 0;">
                      <table>
                        <tr>
                          <td width="18" style="color:#d00000;font-size:14px;">•</td>
                          <td style="font-size:13px;color:#444;">Quality of the generated metadata</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">
                      <table>
                        <tr>
                          <td width="18" style="color:#d00000;font-size:14px;">•</td>
                          <td style="font-size:13px;color:#444;">Features you'd like to see next</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">
                      <table>
                        <tr>
                          <td width="18" style="color:#d00000;font-size:14px;">•</td>
                          <td style="font-size:13px;color:#444;">Your overall experience with ReachAI</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">
                      <table>
                        <tr>
                          <td width="18" style="color:#d00000;font-size:14px;">•</td>
                          <td style="font-size:13px;color:#444;">Any <strong style="color:#d00000">bugs or issues</strong> you encountered</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding-top:16px;text-align:center;">
                <a href="https://reachaiapp.online/contact"
                   style="
                     background:#d00000;
                     color:#ffffff;
                     padding:12px 24px;
                     display:inline-block;
                     font-size:14px;
                     font-weight:600;
                     text-decoration:none;
                     border-radius:6px;
                   ">
                  Send Us Your Feedback
                </a>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- FOOTER -->
<tr>
  <td style="text-align:center;color:#777;font-size:12px;padding:18px;">
    Keep creating,<br>
    <strong style="color:#111;">ReachAI — Smarter YouTube Growth</strong><br>
    <a href="https://reachaiapp.online" style="color:#d00000;text-decoration:none;">
      ReachAI
    </a>
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








function extractYoutubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
}

function escapeHtmlWithEmoji(str: string = "") {
  if (!str) return "";

  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/([\p{Extended_Pictographic}\p{Emoji_Component}\u200d]+)/gu, (emoji) => {
      return `<span style="display:inline-block;line-height:1.2;vertical-align:middle;font-size:16px;">${emoji}</span>`;
    });
}

function escapeAttr(str?: string) {
  if (!str) return "";
  return String(str)
    .replace(/"/g,"%22")
    .replace(/\n/g,"");
}






