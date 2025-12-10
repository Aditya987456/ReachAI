
"use client";
import { useJobStatus } from "@/hooks/JobStatus";
import { useEffect, useState } from "react";
import { toast } from "sonner";




const STATUS_MAP = {
  resolving_channel: "Connecting to your YouTube channel…",
  fetching_videos: "Fetching your latest videos…",
   analyzing_niche: "Analyzing your niche, audience, and content patterns…",
   fetching_trending: "Discovering trending topics in your niche…",
  generating_titles: "Generating SEO-optimized video titles…",
  sending_email: "Sending results to your inbox…",
   completed: "Your optimized titles are ready! Check your email",
  failed: "Something went wrong. Please try again ",
};







export default function HeroForm() {
  const [email, setEmail] = useState<string>("");
  const [channelId, setChannelId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  //## ye dono yaha hi define kar rahe hai so that we can update from handle form because we are keeping status logic outside the handleform function.
  const [ jobId, setJobId ] = useState<string | undefined>(undefined)
  const [ toastId, setToastId ] = useState<any>(null)


const resetJobState = () => {
  setJobId(undefined);   // stops polling
  setToastId(null);      // removes stale toast reference
};

  


  //--------------#### updating the toast according to the polling updates whenever status change -
  const status = useJobStatus(jobId)

    useEffect( ()=>{

      if(!status  || !toastId){
        return;
      }

      if(status === "completed"){
        toast.success(STATUS_MAP[status], { id: toastId,  description: undefined })
        setLoading(false)
        return
      }


      if(status === "failed"){
        toast.error(STATUS_MAP[status], { 
          id: toastId,
          description: undefined
         })
        setLoading(false)
        return
      }


      //############ i used this before very very important and helpful in this situations...
      if (STATUS_MAP[status as keyof typeof STATUS_MAP]) {
    // For in-progress states - NO description
      toast.loading(STATUS_MAP[status as keyof typeof STATUS_MAP], { 
        id: toastId,
        description: undefined  // Remove description for updates
      });
      }


    }, [status, toastId] )

  





  const HandleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();     //prevent the form nature on submiting.
resetJobState();
    if (loading){
      toast.error("Already started generating... please wait");
      return 
    } 

    if (!channelId.trim() || !email.trim()){
      toast.error("Please fill all the fields.");
      return
    }
      
  //if everything ok matlab - start the loading in button like loader...
    setLoading(true);

  //job started saving in local storage.
    localStorage.setItem("reachAI_runs", "yes");


  //-##  here starting the backend request to also check is duplicate job or not
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: channelId, email }),
      });

      const data = await res.json();
      const jobId = data.jobId

    //#####-------- Handle Spam from backend every 3 minutes (429) 
      if (res.status === 429) {
        toast.error(`Please wait ${data.waitSeconds} seconds`, {
          description: "Limit: 1 request per 3 minutes.",
        });
        setLoading(false);
        return;
      }
    // any other error---
      if (!res.ok) {
        toast.error(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }






    //if no duplication --> means new job created in backend.
      //###defining id here so in next toast msg i will update this.
      // Create initial toast
      // const t = toast.loading("Generating your optimized titles…", {
      //   description: "This may take around 40–50 seconds.",
      // });


      // 1. Clear OLD toast instantly to prevent flicker/overlap
    if (toastId) {
      toast.dismiss(toastId);
      // We don't need setToastId(null) here, as we immediately set the new ID next.
    }


    // 2. Create the NEW initial toast immediately
    const t = toast.loading("Generating your optimized titles…", {
      description: "This may take around 40–50 seconds.",
    });


    // 3. Set the new IDs. This simultaneously:
    //    a) Updates the toast reference for the useEffect block (setToastId)
    //    b) Starts the polling for the new job (setJobId)
    setToastId(t);   
    setJobId(jobId);







    // //--------------now fake notification starts-----------------
    //      //after 2.5s
    //   setTimeout(() => toast.loading("Checking channel details…", { id: t }), 2500);
    //   setTimeout(() => toast.loading("Fetching trending videos…", { id: t }), 5000);
    //   setTimeout(() => toast.success("Your titles will arrive shortly. Check inbox or Promotions.", { id: t }), 8000);

    //   setTimeout(() => {
    //     setLoading(false);
    //     localStorage.removeItem("reachAI_runs");
    //   }, 9000);




    } catch {
      toast.error("Something went wrong. Try again.");
      setLoading(false);
    }
  };






  return (
    <div
      className="
      relative w-full 
      max-w-md sm:max-w-lg md:max-w-2xl  mx-auto

      /* on lg+ width increase */
      lg:max-w-3xl  
      "
    >
      {/* glow */}
      <div className="absolute inset-0 -z-10 blur-xl bg-gradient-to-br from-red-200/40 via-pink-200/40 to-purple-200/40 rounded-3xl"></div>

      {/* --- input form here ---- */}
      <form
        onSubmit={HandleForm}
        className="
        bg-white/80 backdrop-blur-2xl border border-white/40 shadow-xl 
        rounded-2xl p-6 sm:p-8 space-y-6
        "
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center tracking-tight">
          Generate Free <span className="text-red-600">AI Titles</span>
        </h2>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-200 rounded-full">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
              100% FREE — No Signup
            </span>
          </div>
        </div>

        {/* yt channel handle */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            YouTube Channel Handle
          </label>

          <input
            type="text"
            placeholder="@yourchannelhandle"
            className="
            w-full border rounded-xl px-5 py-3 text-sm sm:text-base 
            bg-white/80 backdrop-blur
            border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 
            outline-none
            "
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            disabled={loading}
          />

          <p className="sm:text-xs text-[10px] text-gray-400 pt-2">
            💡 Example — <b>@MrBeast</b>, <b>@freecodecamp</b>, <b>@viviandivine</b>
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Email Address
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            className="
            w-full border rounded-xl px-5 py-3 text-sm sm:text-base 
            bg-white/80 backdrop-blur
            border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 
            outline-none
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* form submit button */}
        <button
          type="submit"
          className={`
            w-full bg-red-600 hover:bg-red-700 text-white font-semibold 
            text-lg py-3 rounded-xl shadow-lg shadow-red-400/30 
            transition-all active:scale-[0.97]
            ${loading ? "opacity-70 cursor-not-allowed" : ""}
          `}
          disabled={loading}
        >
          {loading ? "⏳ Generating…" : "✨ Generate Titles"}
        </button>

        <p className="text-center text-xs text-gray-500">Secure • Private • Instant titles</p>
      </form>


    </div>
  );
}


