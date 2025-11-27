"use client"


import { useState } from "react"
import { toast } from "sonner"



export default function HeroForm(){

    const [ email, setEmail ]=useState<string>('')
    const [ channelId, setChannelId ]=useState<string>('')
    const [ loading, setLoading ]=useState<boolean>(false)

    const HandleForm = async (e: React.FormEvent<HTMLFormElement>)=>{

        e.preventDefault()   //prevent the form nature on submiting.

        if (loading) {
            toast.error("Already started generating... please wait")
            return;
        }

        if(!channelId.trim() || !email.trim()){
            toast.error("Please fill all the fields.")
            return
        }


      

    //if everything ok matlab - start the loading in button like loader...
        setLoading(true)

    //job started saving in local storage.
        localStorage.setItem('reachAI_runs', 'yes')


     //-##  here starting the backend request to also check is duplicate job or not
        try {
           const res =  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channel:channelId, email }),
        });

        const data = await res.json()

       //#####-------- Handle Spam from backend every 3 minutes (429) 
            if (res.status === 429) {
                // User submitted too recently
                const waitSeconds = data.waitSeconds;
                
                toast.error(`Please wait ${waitSeconds} seconds before trying again`, {
                    description: "Avoid spam by generating titles every 3 minutes with same emailID"
                });
                
                setLoading(false);
                return;
            }

            // Other error
            if (!res.ok) {
                toast.error(data.error || "Something went wrong.");
                setLoading(false);
                return;
            }

      //if no duplication --> means new job created in backend.
         //###defining id here so in next toast msg i will update this.
        const ToastID = toast.loading('Started generating titles')


    //--------------now fake notification starts
        //after 2.5s
        setTimeout(() => {
            toast.loading("Checking channel details...", { id:ToastID});
            }, 2500);

        //after 5s
        setTimeout(() => {
            toast.loading("Fetching trending videos...", { id:ToastID });
            }, 5000);

        //after 8s    
        setTimeout(() => {
            toast.success("Titles will arrive in your email shortly!", { id:ToastID });
            }, 8000);


    // Allow for new request after -12 seconds
        setTimeout(() => {
        setLoading(false);
        localStorage.removeItem("reachAI_runs");
        }, 12000);
       }
     catch (err) {
            toast.error("Something went wrong. Try again.");
            setLoading(false)
        }




    }

    return(
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            {/* Shadow */}
            <div className="absolute inset-0 rounded-2xl -z-10 translate-x-4 translate-y-4 bg-black/40 shadow-[0_10px_25px_rgba(0,0,0,0.3)]"></div>

            <form onSubmit={HandleForm}
                className="bg-white shadow-xl border rounded-2xl p-7 space-y-5">
              <h2 className="text-xl sm:text-2xl font-bold leading-snug text-center">
                Generate Free <span className="text-red-600">AI-Powered</span> Titles Now!
              </h2>
              <p className="text-center text-gray-500 text-sm sm:text-base ">
                100% free. No Signup, No Signin required.<br />
                Free titles sent to your email.
              </p>

              <input
                type="text"
                placeholder="Enter YouTube channel handle starts with '@'"
                className="w-full border rounded-xl px-5 py-3 text-sm sm:text-base focus:outline focus:outline-red-600"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                disabled={loading}
              />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-xl px-5 py-3 text-sm sm:text-base focus:outline focus:outline-red-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <button
                type="submit"
                className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-base sm:text-lg py-3 rounded-xl flex justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? "⏳ Working..." : "✨ Generate Titles"}
              </button>
            </form>
          </div>
        </div>
    )
}