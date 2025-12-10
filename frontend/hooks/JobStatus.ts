// import { useEffect, useState } from "react";

// export function useJobStatus(jobId?: string | undefined) {
    
//     const [ status, setStatus ]= useState<string|null>(null)

//     useEffect( ()=>{
//         if(!jobId){
//             return;
//         }

//         const PollingInterval = setInterval( async() => {

//             try {

//                 const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/status?jobId=${jobId}`, {
//                     method:'GET'
//                 })

//                 const data =await res.json()
//                 const LiveStatus = data.status
//                 setStatus(LiveStatus)


//                 if(status === "completed"  ||  status === "failed"){
//                     clearInterval(PollingInterval)
//                 }
                
//             } catch (error:any) {
//                 console.log("Error in polling ", error)
//             }

//         }, 2500);


// //############ When a component is destroyed (unmounted), React calls the cleanup:
//         return ()=>clearInterval(PollingInterval);

//     }, [jobId] )


//     return status
// }




































import { useEffect, useState } from "react";

export function useJobStatus(jobId?: string | undefined) {
    
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) {
            return;
        }

        const PollingInterval = setInterval(async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/status?jobId=${jobId}`,
                    {
                        method: 'GET',
                        cache: 'no-store' // Prevent caching
                    }
                );

                const data = await res.json();
                const LiveStatus = data.status;
                
                setStatus(LiveStatus);

                // ✅ Check LiveStatus (the NEW value), not status (OLD value)
                if (LiveStatus === "completed" || LiveStatus === "failed") {
                    clearInterval(PollingInterval);
                }
                
            } catch (error: any) {
                console.log("Error in polling", error);
            }

        }, 2500);

        // Cleanup when component unmounts
        return () => clearInterval(PollingInterval);

    }, [jobId]);

    return status;
}
