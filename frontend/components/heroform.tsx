
"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function HeroForm() {
  const [email, setEmail] = useState<string>("");
  const [channelId, setChannelId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const HandleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();     //prevent the form nature on submiting.

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
       const t = toast.loading('Started generating titles')

    //--------------now fake notification starts-----------------
         //after 2.5s
      setTimeout(() => toast.loading("Checking channel details…", { id: t }), 2500);
      setTimeout(() => toast.loading("Fetching trending videos…", { id: t }), 5000);
      setTimeout(() => toast.success("Your titles will arrive shortly. Check inbox or Promotions.", { id: t }), 8000);

      setTimeout(() => {
        setLoading(false);
        localStorage.removeItem("reachAI_runs");
      }, 9000);

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


