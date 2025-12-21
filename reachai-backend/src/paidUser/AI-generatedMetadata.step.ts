
import { EventConfig } from "motia";

export const config: EventConfig = {
  name: "PaidJob-fetch-AI-optimized-metadata",
  type: "event",
  subscribes: ["paidUser.trendVid.success"],
  emits: ["paidUser.AImetadata.success", "paidUser.AImetadata.error"],
  flows: ["Paid User workflow"],
  infrastructure: {
    handler: { timeout: 180 },
    queue: {
      maxRetries: 3,
      visibilityTimeout: 210,
    },
  },
};



export const handler = async ( eventData: any, { emit, logger, state }: any ) => {
  
  let PaidJobId: string | undefined;
  let email: string | undefined;

  const RETRY_KEY = "fetchAiMetadata";
  const MAX_RETRIES = 3;

  try {




    // const {
    //   PaidJobId: jobId,
    //   email: userEmail,
    //   channelId,
    //   channelName,
    //   TrendingVideos,
    // } = eventData || {};

    // PaidJobId = jobId;
    // email = userEmail;



        const data = eventData || {}

        PaidJobId= data.PaidJobId
        email = data.email
        const channelId = data.channelId
        const channelName = data.channelName
        const TrendingVideos = data.TrendingVideos





    if (!PaidJobId || !email || !channelId) {
      throw new Error("Missing required event data");
    }

    const PaidJobData = await state.get("PaidJobs", PaidJobId);
    if (!PaidJobData) {
      throw new Error("PaidJob not found");
    }

    // Prevent duplicate generation
    if (PaidJobData.AiMetadatafetched === true) {
      logger.info("AI metadata already exists", { PaidJobId });

      await emit({
        topic: "paidUser.AImetadata.success",
        data: {
          PaidJobId,
          email,
          channelId,
          channelName,
          ImprovedMetadataData: PaidJobData.ImprovedMetadataData,
        },
      });
      return;
    }



    const UserVideos = PaidJobData.videos;
    if (!Array.isArray(UserVideos) || UserVideos.length === 0) {
      throw new Error("No user videos found");
    }

    const niche1 = PaidJobData.niches?.[0] || "";
    const niche2 = PaidJobData.niches?.[1] || "";
    const reasonNiche = PaidJobData.reason || "";

    const TOTAL_VIDEO_COUNT = UserVideos.length;

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key missing");
    }

    await state.set("PaidJobs", PaidJobId, {
      ...PaidJobData,
      status: "fetching AI optimized metadata",
    });

    logger.info("Generating AI metadata", {
      PaidJobId,
      count: TOTAL_VIDEO_COUNT,
    });

    // ---------------------PROMPT -------------------------------

    const TitlePrompt = `
You are an expert YouTube SEO, Metadata, and Growth Strategist.

CHANNEL CONTEXT
Channel Name: ${channelName}
Primary Niches: ${niche1}, ${niche2}
Why this niche: ${reasonNiche}

TRENDING PATTERNS:
${TrendingVideos.slice(0, 5).map((v: any) => `• ${v.title}`).join("\n")}

CREATOR VIDEOS TO OPTIMIZE:
${UserVideos.map((v: any, i: number) => `${i + 1}. ${v.title}`).join("\n")}

CRITICAL REQUIREMENT:
- You WILL receive ${TOTAL_VIDEO_COUNT} creator video titles.
- You MUST return metadata for ALL ${TOTAL_VIDEO_COUNT} videos.
- Do NOT skip any title.
- Do NOT merge videos.
- If output would be long, compress descriptions slightly,
  but NEVER reduce the number of videos.

TASK:
For EACH video generate:
✓ 2 optimized titles (1 emoji at end, 50-60 chars each)
✓ Description: MINIMUM 170 words, naturally keyword-rich
✓ Tags: EXACTLY 15-20 high-intent SEO tags
✓ Hashtags: EXACTLY 15-20 trending niche hashtags (#format)
✓ Why: 2-3 sentence about explaining why this generated metadata works.

STRICT JSON OUTPUT ONLY:

{
  "videos": [
    {
      "original_title": "...",
      "optimized_title_1": "...",
      "optimized_title_2": "...",
      "optimized_description": "...",
      "tags": ["...", "..."],
      "hashtags": ["...", "..."],
      "why": "..."
    }
  ]
}

IMPORTANT:
- videos.length MUST equal ${TOTAL_VIDEO_COUNT}
- Output ONLY valid JSON
`;

    // ### now here - calling to AI.

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          temperature: 0.5,
          max_tokens: 6000,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a YouTube SEO expert producing high-quality metadata in strict valid JSON output.",
            },
            { role: "user", content: TitlePrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || "AI request failed");
    }

    const result = await response.json();

    const aiContent = result?.choices?.[0]?.message?.content;

    if (!aiContent?.trim().startsWith("{") || !aiContent.trim().endsWith("}")) {
      throw new Error("AI returned incomplete JSON");
    }

    const parsed = JSON.parse(aiContent);

    // ------------------- validation is 10 vid is there or not?
    if (
      !parsed.videos ||
      !Array.isArray(parsed.videos) ||
      parsed.videos.length !== TOTAL_VIDEO_COUNT
    ) {
      throw new Error(
        `AI returned ${parsed.videos?.length || 0} of ${TOTAL_VIDEO_COUNT}`
      );
    }

    const ImprovedMetadataData = parsed.videos.map(
      (meta: any, idx: number) => ({
        ...meta,
        url: UserVideos[idx]?.url,
      })
    );

    await state.set("PaidJobs", PaidJobId, {
      ...PaidJobData,
      status: "AI metadata ready",
      AiMetadatafetched: true,
      ImprovedMetadataData,
    });

    await emit({
      topic: "paidUser.AImetadata.success",
      data: {
        PaidJobId,
        email,
        channelName,
        channelId,
        ImprovedMetadataData,
      },
    });

    logger.info("AI metadata generation completed", {
      PaidJobId,
      count: ImprovedMetadataData.length,
    });
  } catch (error: any) {
    logger.error("AI metadata generation failed", {
      PaidJobId,
      error: error.message,
    });

    if (!PaidJobId || !email) return;

    const PaidJobData = await state.get("PaidJobs", PaidJobId);
    const attempt = (PaidJobData?.retry?.[RETRY_KEY] ?? 0) + 1;

    await state.set("PaidJobs", PaidJobId, {
      ...PaidJobData,
      status: "retrying",
      lastError: error.message,
      retry: {
        ...PaidJobData?.retry,
        [RETRY_KEY]: attempt,
      },
    });

    if (attempt >= MAX_RETRIES) {
      await emit({
        topic: "paidUser.AImetadata.error",
        data: {
          PaidJobId,
          email,
          error: error.message,
          attemptCount: attempt,
        },
      });
      return;
    }

    throw error;
  }
};
