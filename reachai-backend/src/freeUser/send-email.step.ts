
//-----------------------------------------------------------------------------------------------------------

// --- Event: Send Email With Optimized Titles ----
import { EventConfig, Logger } from "motia";

/**
 * Step-8: Send email using Resend with AI optimized titles + thumbnails
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
  thumbnail?: string; // <— ADDED,
  premium_metadata?: {
    description: string;
    tags: string[];
    hashtags: string[];
    Why_premium:string
  };
};

export const handler = async (eventData: any, { emit, logger, state }: { emit: any; logger: Logger; state: any }) => {
  let jobId: string | undefined;
  let email: string | undefined;

  try {
    const data = eventData || {};

    jobId = data.jobId;
    email = data.email;
    const channelName: string = data.channelName;
    const channelId: string = data.channelId;
    const ImprovedTitles: ImprovedTitle[] = data.ImprovedTitles || [];

    logger.info("send-email-with-titles triggered", { jobId, email });

    if (!jobId) throw new Error("Missing jobId");
    if (!email) throw new Error("Missing email");
    if (!channelId) throw new Error("Missing channelId");
    if (!channelName) throw new Error("Missing channelName");
    if (!ImprovedTitles?.length)
      throw new Error("ImprovedTitles empty");

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

    if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
    if (!RESEND_FROM_EMAIL) throw new Error("Missing RESEND_FROM_EMAIL");


    // Get video data from previous steps
    const jobData = await state.get("jobs", jobId);











    /**
     * jobData.videos MUST BE AN ARRAY LIKE:
     * [
     *   { thumbnail: "...", url: "...", title: "...", ...},
     * ]
     */
    const videoList = jobData?.videos || [];

    // Merge thumbnails + url of video from video list of user into ImprovedTitles
    const titlesWithThumb = ImprovedTitles.map((t, i) => ({
      ...t,
      thumbnail: videoList[i]?.thumbnail || null,
      url: videoList[i]?.url || t.url
    }));

















    // prevent double send-->
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


    // Generate email
    const htmlBody = GenerateEmailHTML(
      channelName,
      titlesWithThumb,     //isme sab hai url, thumb pura.
      channelId,
      email
    );

    const textBody = GenerateEmailTEXT(
      channelName,
      titlesWithThumb,
      channelId,
      email
    );























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
































/* -------------------------------------------------------------------
-------------------- TEXT FALLBACK -----------------------------------
---------------------------------------------------------------------*/
export function GenerateEmailTEXT(
  channelName: string,
  titles: ImprovedTitle[],
  channelId: string,
  email: string
) {
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

  text += `Unlock full metadata for ₹99:\n`;
  text += `${process.env.FRONTEND_URL}/pay/${channelId}?email=${email}`;
  text += `\nReachAI — Smarter YouTube Growth\n`;
  return text;
}




























/* ---------------- HTML Email (Version B — Premium UI) ---------------- */

export function GenerateEmailHTML(
  channelName: string,
  titles: ImprovedTitle[],
  channelId: string,
  email: string
) {

  const premium = titles[0].premium_metadata;
  const premiumId = extractYoutubeId(titles[0].url);
  
  const premiumThumb = premiumId
    ? `https://i.ytimg.com/vi/${premiumId}/maxresdefault.jpg`
    : escapeAttr(titles[0].thumbnail || "");


  const urlCTA = `${process.env.FRONTEND_URL}/pay/${channelId}?email=${email}`;

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
        <td style="font-size:14px;color:#555;line-height:1.6;">
          Your AI-powered, trend-driven & SEO-optimized titles for
          <strong style="color:#111;">${escapeHtmlWithEmoji(channelName)}</strong>
are ready.
          <br>
          These are generated using real-time niche performance,
          CTR psychology, and keyword signals from your recent uploads.
          <br>
        </td>
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
          Optimized Titles
          <span style="color:#666; font-weight:400; margin-left:8px; font-size:13px;">
            (${titles.length} videos)
          </span>
        </td>
      </tr>
    </table>
  </td>
</tr>
<!-- ========================================================================= -->


${titles.map((t, i) => {

const id = extractYoutubeId(t.url);
const thumb = id
  ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  : escapeAttr(t.thumbnail || "");

return `


<!-- ==================== VIDEO CARD ==================== -->

<tr>
<td style="padding:12px 8px;">
  <table width="100%" cellpadding="0" cellspacing="0" 
    style="border:1px solid #e5e7eb;border-radius:10px;border-collapse:separate;border-spacing:0;overflow:hidden;">
    <tr>
      <td style="padding:12px;border-radius:10px;">

      <!-- CARD HEADER -->
      <table width="100%">
        <tr>

        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:14px; padding-right:4px">🎬 </td>
            <td style="font-size:14px;font-weight:700;color:#111;"> Video ${i+1} </td>
          </tr>
        </table>

          <td align="right">
            <a href="${urlCTA}"
               style="font-size:12px;color:#d00000;text-decoration:none;font-weight:600;">
              Unlock Full Metadata →
            </a>
          </td>
        </tr>
      </table>


      <!-- THUMBNAIL -->
      ${
        thumb ? `
      <table width="100%" style="margin-top:10px;">
        <tr>
          <td align="center">
            <img src="${thumb}" width="100%"
            style="max-width:620px;height:auto;border-radius:10px;">
          </td>
        </tr>
      </table>
      ` : ""
      }


      <!-- ORIGINAL TITLE -->
      <table width="100%" style="margin-top:14px;">
        <tr>
          <td style="font-size:14px;font-weight:700;text-transform:uppercase;color:#444;">
            Original Title
          </td>
        </tr>
        <tr>
          <td style="font-size:14px;color:#222;padding-top:4px;">
            ${escapeHtmlWithEmoji(t.original)}
          </td>
        </tr>
      </table>


      <!-- OPTIMIZED TITLES -->
      <table width="100%" style="margin-top:14px;">
        <tr>
          <td style="font-size:14px;font-weight:700;text-transform:uppercase;color:#d00000;">
            Optimized Titles
          </td>
        </tr>

        <tr><td height="6"></td></tr>

        <tr>
          <td style="background:#fffdf0;border-radius:6px;padding:10px;font-size:14px;color:#333;">
            <span style="font-weight:700;color:#ff0000;">1:</span>
            ${escapeHtmlWithEmoji(t.improved1)}
          </td>
        </tr>

        <tr><td height="8"></td></tr>

        <tr>
          <td style="background:#fffdf0;border-radius:6px;padding:10px;font-size:14px;color:#333;">
            <span style="font-weight:700;color:#ff0000;">2:</span>
            ${escapeHtmlWithEmoji(t.improved2)}
          </td>
        </tr>
      </table>


      ${
        t.Why ? `
      <!-- WHY THIS WORKS -->
      <table width="100%" style="margin-top:14px;">
        <tr>
          <td style="background:#fff4cd;padding:12px;border-radius:6px;">
            <table width="100%">
              <tr>
                <td style="font-size:10px;text-transform:uppercase;color:#9a5000;font-weight:700;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:12px; padding-right:4px">💡</td>
                      <td style="font-size:12px; color:#92400e;">Why This Works</td>
                    </tr>
                </table>

                </td>
              </tr>
              <tr>
                <td style="padding-top:4px;font-size:13px;color:#7a3c07;line-height:1.45;">
                  ${escapeHtmlWithEmoji(t.Why)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      ` : ""
      }

      </td>
    </tr>
  </table>
</td>
</tr>
`;

}).join("")}



























<!-- ===================================================================== -->
<!-- ==================== FULL PREMIUM METADATA PREVIEW ================== -->
<!-- ===================================================================== -->
<tr>
<td style="padding:20px 6px;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="border:1px solid #e5e7eb;border-radius:10px;border-collapse:separate;border-spacing:0;overflow:hidden;">

    <!-- TOP HERO -->
    <tr>
      <td style="background:#111;border-radius:10px 10px 0 0;padding:16px;text-align:center;">
        <table width="100%">
         
        <tr>
            <td align="center" style="font-size:18px; font-weight:700; color:#ffffff;">
                <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:18px; ">🔓</td>
                      <td style="font-size:18px;font-weight:700;color:#ffffff; padding-right:4px; "> Unlock Complete SEO Data </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style="padding-top:4px;font-size:12px;color:#bfbfbf;">
              Titles • Descriptions • Tags • Hashtags
            </td>
        </tr>

        </table>
      </td>
    </tr>

<!-- SAMPLE BLOCK -->
<tr>
  <td style="padding:8px;border-radius:0 0 10px 10px;">

    <!-- HD THUMBNAIL -->
    <table width="100%">
      <tr>
        <td align="center">
          <img src="${premiumThumb}"
               width="100%" style="max-width:634px;border-radius:8px;">
        </td>
      </tr>
    </table>

    <!-- SAMPLE DETAILS -->
    <table width="100%" cellpadding="0" cellspacing="0"
           style="margin-top:16px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">


      <!-- SAMPLE HEADER -->
      <tr>
       
      
      
      
      
      <td style="background:#f9fafb;padding:14px 16px;border-bottom:1px solid #e5e7eb;">
          <span style="font-size:14px;font-weight:700;color:#111;">
            Video 1 Example:
          </span>
        </td>



      </tr>


      <!-- BODY -->
      <tr>
        <td style="padding:16px;background:#ffffff;">


          <!-- ORIGINAL TITLE -->
          <table width="100%">
            <tr><td style="font-size:12px;text-transform:uppercase;font-weight:700;color:#6b7280;">
              Original Title
            </td></tr>
            <tr><td style="padding-top:4px;font-size:14px;color:#111;">
              ${escapeHtmlWithEmoji(titles[0].original)}
            </td></tr>
          </table>

          <table width="100%"><tr><td height="14"></td></tr></table>


          <!-- OPTIMIZED TITLES -->
          <table width="100%">
            <tr><td style="font-size:12px;text-transform:uppercase;font-weight:700;color:#d00000;">
              Optimized Titles
            </td></tr>

          <table width="100%" 
            style="background:#fffafa; border-radius:4px;
                  border-collapse:separate;border-spacing:0;overflow:hidden;">
            <tr>
              <td style="padding:8px;font-size:13px;color:#111;">
               <span style="font-weight:700;color:#d00000;">1:</span> 
              ${escapeHtmlWithEmoji(titles[0].improved1)}
              </td>
            </tr>
          </table>



          







            <tr>
              <td style="padding-top:6px;">
                <table width="100%" style="background:#fffafa; border-radius:4px;">
                  <tr><td style="padding:10px;font-size:13px;color:#111;">
                   <span style="font-weight:700;color:#d00000;">2:</span>  
                  ${escapeHtmlWithEmoji(titles[0].improved2)}
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
         ${premium?.description || "Error in loading description now."}

        </td></tr>
      </table>
    </td>
  </tr>
</table>



          <!-- TAGS -->
          <table width="100%" style="margin-top:14px;">
  <tr><td style="font-size:12px;text-transform:uppercase;font-weight:700;color:#d00000;">
    Tags
  </td></tr>
  <tr>
    <td style="padding-top:6px;">
      <table width="100%"
        style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;
               border-collapse:separate;border-spacing:0;overflow:hidden;">
        <tr><td style="padding:10px;font-size:13px;color:#444;">
          ${(premium?.tags || []).join(", ")}
        </td></tr>
      </table>
    </td>
  </tr>
</table>



          <!-- HASHTAGS -->
          <table width="100%" style="margin-top:10px;">
  <tr><td style="font-size:12px;text-transform:uppercase;font-weight:700;color:#d00000;">
    Hashtags
  </td></tr>
  <tr>
    <td style="padding-top:6px;">
      <table width="100%"
        style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;
               border-collapse:separate;border-spacing:0;overflow:hidden;">
        <tr><td style="padding:10px;font-size:13px;color:#444;">
           ${(premium?.hashtags || []).join(" ")}
        </td></tr>
      </table>
    </td>
  </tr>
</table>



          <!-- WHY THIS WORKS -->
          <table width="100%" 
  style="margin-top:14px;background:#fffbeb;
         border-collapse:separate;border-spacing:0;overflow:hidden;">
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
      ${premium?.Why_premium || 'Emotional hook, clear value, beginner-friendly language, and SEO keywords. '}
      
    </td>
  </tr>
</table>


        </td>
      </tr>
    </table>

  </td>
</tr>

      </td>
    </tr>


    <!-- FEATURES -->
    <tr>
      <td style="padding:16px;">
        <table width="100%">
          <tr><td style="font-size:14px;font-weight:700;color:#111;">
            Full Metadata Bundle (  <strong style="color:#ff0000;">10 Latest Videos</strong>)
          </td></tr>

          ${[
            "2 optimized titles per video(20 titles)",
            "200+ word SEO-enhanced descriptions",
            "AI-researched tags",
            "Trending hashtags from your niche",
            "CTR psychology insights to increase clicks"
          ].map(item=>`
          <tr>
            <td style="padding-top:6px;">
              <table>
                <tr>
                  <td width="18" style="color:#d00000;font-size:14px;">✔</td>
                  <td style="font-size:13px;color:#444;">${item}</td>
                </tr>
              </table>
            </td>
          </tr>`).join("")}
        </table>
      </td>
    </tr>


    <!-- CTA -->
<!-- CTA -->
<tr>
  <td style="background:#111;padding:30px;text-align:center;border-radius:0 0 10px 10px;">
    <table width="100%">

      <!-- Offer Note will add this later - v2-->
      <tr>
       
      </tr>

      <!-- Price -->
      <tr>
        <td style="padding:10px 0;">
          <span style="text-decoration:line-through;color:#6b7280;font-size:16px;">₹199</span>
          <span style="color:#ffffff;font-size:32px;font-weight:800;padding-left:6px;">₹99</span>
        </td>
      </tr>

      <!-- 10 Video Line -->
      <tr>
        <td style="font-size:12px;color:#d1d5db;padding-bottom:8px;">
          Full metadata bundle for your latest <strong style="color:#ff0000;">10 videos</strong>
        </td>
      </tr>

      <!-- Responsive CTA Button -->
      <tr>
        <td>
          <a href="${urlCTA}"
             style="
               background:#d00000;
               color:#ffffff;
               padding:14px 0;
               display:block;
               width:100%;
               max-width:260px;
               margin:0 auto;
               font-size:16px;
               font-weight:700;
               text-decoration:none;
               border-radius:8px;
             ">
            Unlock Full Metadata Now →
          </a>
        </td>
      </tr>

      <!-- Guarantee Text will add this later in V2-->
      <tr>
      </tr>

    </table>
  </td>
</tr>


<!-- FOOTER -->
<tr>
<td style="text-align:center;color:#777;font-size:12px;padding:18px;">
  Keep creating,<br>
  <strong style="color:#111;"><a href="https://reachaiapp.vercel.app" style="color:#d00000;text-decoration:none;">
    ReachAI
  </a> — Smarter YouTube Growth</strong><br>
  <br>
  <span style="color:#555;">Have suggestions or any questions?</span><br> <a href="https://reachaiapp.online/contact" style="color:#d00000;text-decoration:none;"> Contact us </a>
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


/* ---------- Escape Helpers (DO NOT CHANGE) ---------- */

function escapeHtml(str: string = "") {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

/**
 * Escape HTML AND convert emojis to numeric entities so they render safely
 * in email clients (Gmail, Outlook, etc.) without breaking lines weirdly.
 */






function escapeHtmlWithEmoji(str: string = "") {
  if (!str) return "";

  // Just escape HTML entities, keep emojis as-is with proper styling
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




// ---------------------------


















