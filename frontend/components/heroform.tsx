// "use client"


// import { useState } from "react"
// import { toast } from "sonner"



// export default function HeroForm(){

//     const [ email, setEmail ]=useState<string>('')
//     const [ channelId, setChannelId ]=useState<string>('')
//     const [ loading, setLoading ]=useState<boolean>(false)

//     const HandleForm = async (e: React.FormEvent<HTMLFormElement>)=>{

//         e.preventDefault()   //prevent the form nature on submiting.

//         if (loading) {
//             toast.error("Already started generating... please wait")
//             return;
//         }

//         if(!channelId.trim() || !email.trim()){
//             toast.error("Please fill all the fields.")
//             return
//         }


      

//     //if everything ok matlab - start the loading in button like loader...
//         setLoading(true)

//     //job started saving in local storage.
//         localStorage.setItem('reachAI_runs', 'yes')


//      //-##  here starting the backend request to also check is duplicate job or not
//         try {
//            const res =  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/submit`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ channel:channelId, email }),
//         });

//         const data = await res.json()

//        //#####-------- Handle Spam from backend every 3 minutes (429) 
//             if (res.status === 429) {
//                 // User submitted too recently
//                 const waitSeconds = data.waitSeconds;
                
//                 toast.error(`Please wait ${waitSeconds} seconds before trying again`, {
//                     description: "Avoid spam by generating titles every 3 minutes with same emailID"
//                 });
                
//                 setLoading(false);
//                 return;
//             }

//             // Other error
//             if (!res.ok) {
//                 toast.error(data.error || "Something went wrong.");
//                 setLoading(false);
//                 return;
//             }

//       //if no duplication --> means new job created in backend.
//          //###defining id here so in next toast msg i will update this.
//         const ToastID = toast.loading('Started generating titles')


//     //--------------now fake notification starts
//         //after 2.5s
//         setTimeout(() => {
//             toast.loading("Checking channel details...", { id:ToastID});
//             }, 2500);

//         //after 5s
//         setTimeout(() => {
//             toast.loading("Fetching trending videos...", { id:ToastID });
//             }, 5000);

//         //after 8s    
//         setTimeout(() => {
//             toast.success("Titles will arrive in your email shortly!", { id:ToastID });
//             }, 8000);


//     // Allow for new request after -12 seconds
//         setTimeout(() => {
//         setLoading(false);
//         localStorage.removeItem("reachAI_runs");
//         }, 12000);
//        }
//      catch (err) {
//             toast.error("Something went wrong. Try again.");
//             setLoading(false)
//         }




//     }

//     return(
//         <div className="lg:col-span-5 flex justify-center lg:justify-end">
//           <div className="relative w-full max-w-md">
//             {/* Shadow */}
//             <div className="absolute inset-0 rounded-2xl -z-10 translate-x-4 translate-y-4 bg-black/40 shadow-[0_10px_25px_rgba(0,0,0,0.3)]"></div>

//             <form onSubmit={HandleForm}
//                 className="bg-white shadow-xl border rounded-2xl p-7 space-y-5">
//               <h2 className="text-xl sm:text-2xl font-bold leading-snug text-center">
//                 Generate Free <span className="text-red-600">AI-Powered</span> Titles Now!
//               </h2>
//               <p className="text-center text-gray-500 text-sm sm:text-base ">
//                 100% free. No Signup, No Signin required.<br />
//                 Free titles sent to your email.
//               </p>

//               {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-full">
//                 <span className="relative flex h-1 w-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
//                 </span>
//                 <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
//                   100% Free • No Signup • No Login 
//                 </span>
//               </div> */}

//               <input
//                 type="text"
//                 placeholder="Enter YouTube channel handle starts with '@'"
//                 className="w-full border rounded-xl px-5 py-3 text-sm sm:text-base focus:outline focus:outline-red-600"
//                 value={channelId}
//                 onChange={(e) => setChannelId(e.target.value)}
//                 disabled={loading}
//               />

//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full border rounded-xl px-5 py-3 text-sm sm:text-base focus:outline focus:outline-red-600"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={loading}
//               />

//               <button
//                 type="submit"
//                 className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-base sm:text-lg py-3 rounded-xl flex justify-center gap-2 ${
//                 loading ? "opacity-70 cursor-not-allowed" : ""}`}
//                 disabled={loading}
//               >
//                 {loading ? "⏳ Working..." : "✨ Generate Titles"}
//               </button>
//             </form>
//           </div>
//         </div>
//     )
// }



"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function HeroForm() {
  const [email, setEmail] = useState("");
  const [channelId, setChannelId] = useState("");
  const [loading, setLoading] = useState(false);

  const HandleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return toast.error("Already generating... please wait");
    if (!channelId.trim() || !email.trim()) return toast.error("Please fill all the fields.");

    setLoading(true);
    localStorage.setItem("reachAI_runs", "yes");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: channelId, email }),
      });

      const data = await res.json();

      if (res.status === 429) {
        toast.error(`Please wait ${data.waitSeconds} seconds`, {
          description: "Limit: 1 request per 3 minutes.",
        });
        setLoading(false);
        return;
      }

      if (!res.ok) {
        toast.error(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      const ToastID = toast.loading("Started generating titles");

      setTimeout(() => toast.loading("Checking channel details…", { id: ToastID }), 1500);
      setTimeout(() => toast.loading("Fetching trending videos…", { id: ToastID }), 3500);
      setTimeout(
        () => toast.success("Titles will arrive in your email shortly!", { id: ToastID }),
        6000
      );

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
    <div className="lg:col-span-5 flex justify-center lg:justify-end w-full sm:px-0">
      <div className="relative w-full max-w-md">

        {/* Glow Background */}
        <div className="absolute inset-0 -z-10 blur-xl bg-gradient-to-br from-red-200/40 via-pink-200/40 to-purple-200/40 rounded-3xl"></div>

        {/* Main Card */}
        <form
          onSubmit={HandleForm}
          className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-xl 
          rounded-2xl p-6 sm:p-8 space-y-6 transition-all"
        >
          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-center tracking-tight">
            Generate Free  
            <span className="text-red-600 mr-1"> AI Titles</span>  
            For Your YouTube Videos
          </h2>

          {/* Centered Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-200 rounded-full">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                100% FREE — No Signup
              </span>
            </div>
          </div>

          {/* INPUT — YOUTUBE HANDLE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              YouTube Channel Handle
            </label>

            <input
              type="text"
              placeholder="@yourchannelhandle"
              className="w-full border rounded-xl px-5 py-3 text-sm sm:text-base 
                bg-white/80 backdrop-blur
                border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 
                transition-all outline-none"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              disabled={loading}
            />

            {/* Example ALWAYS visible */}
            <p className="sm:text-xs text-[10px] text-gray-400 pt-2">
              💡Example - <b>@MrBeast</b>, <b>@freecodecamp</b>, <b>@viviandivine</b>
            </p>
          </div>

          {/* INPUT — EMAIL */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border rounded-xl px-5 py-3 text-sm sm:text-base 
                bg-white/80 backdrop-blur
                border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 
                transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className={`w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] 
            text-white font-semibold text-lg py-3 rounded-xl
            shadow-lg shadow-red-400/30 transition-all 
            ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "⏳ Generating…" : "✨ Generate Titles"}
          </button>

          {/* Footer small trust text */}
          <p className="text-center text-xs text-gray-500 -mt-2">
             Secure • Private • Instant titles
          </p>
        </form>
      </div>
    </div>
  );
}
