// "use client";


// import React, { useState } from "react";


// import { useParams, useSearchParams, useRouter } from "next/navigation";

// export default function BuyMetadataPage() {

//   //taking value from url send by motia...
//   const router = useRouter()
//   const params = useParams();              // { channelId: "UC99999" }
//   const searchParams = useSearchParams();  // URLSearchParams object means query wala '?'
//   const channelId = params.channelId;
//   const email = searchParams.get("email");
//   const [ loading , setLoading ]=useState(false)




//   // //handle payment---
//   // const HandlePayment=async ()=>{
//   //   setLoading(true)

//   // //-------- #1: creating order
//   //   const res = await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`, {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify({ channelId, email }),
//   //   });


//   //   const OrderData = await res.json()
//   //   setLoading(false)    
//   //   if(!OrderData?.orderId){
//   //     alert('Order Creation failed !')
//   //     return
//   //   }


//   //   //popup razorpay details object
//   //   const options: any = {
//   //     //key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//   //     key:OrderData.keyId,
//   //     amount: OrderData.amount,
//   //     currency: OrderData.currency,
//   //     name: "ReachAI",
//   //     description: "Unlock full metadata for your YouTube channel's videos",
//   //     order_id: OrderData.orderId,
//   //     prefill: { email },

//   //     //#### use of handler because to redirect after veryfing payment.
//   //     handler: async function (response: any) {
//   //       try {

//   //           console.log("Razorpay response:", response);
//   //       //-----veryfying payments
//   //         const verifyRes = await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/verify`, {
//   //           method: "POST",
//   //           headers: { "Content-Type": "application/json" },
//   //           body: JSON.stringify({
//   //             razorpay_order_id: response.razorpay_order_id,
//   //             razorpay_payment_id: response.razorpay_payment_id,
//   //             razorpay_signature: response.razorpay_signature,
//   //             PaidJobId: OrderData.PaidJobId,    //from my side because of motia.
//   //           }),
//   //       });

//   //       const verifyData = await verifyRes.json()



//   //       //success message-------like alert something.
//   //       if (verifyData.success) router.push("/thank-you");
          
//   //       } catch (error) {
//   //         console.log(error)
//   //       }
//   //     },
//   //       theme: { color: "#0F62FE" },
//   //   };


//   //   //##### --------razorpay pop-up opening
//   //   const rzrp = new (window as any).Razorpay(options);

//   //   //if payment failed
//   //   rzrp.on("payment.failed", function (response:any) {
//   //     console.log("Payment failed:", response.error);
//   //     alert("Payment failed! No money deducted. Please try again.");
//   //   });

//   //   rzrp.open();
  
//   // }




//   //-----------------------------------------------------


//   const HandlePayment = async () => {
//     try {
//       setLoading(true);

//       // #1: Create order
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ channelId, email }),
//       });

//       const OrderData = await res.json();
//       setLoading(false);

//       if (!OrderData?.orderId) {
//         alert("Order creation failed!");
//         return;
//       }

//       // Razorpay options
//       const options: any = {
//         key: OrderData.keyId,
//         amount: OrderData.amount,
//         currency: OrderData.currency,
//         name: "ReachAI",
//         description: "Unlock full metadata for your YouTube channel's videos",
//         order_id: OrderData.orderId,
//         prefill: { email },
//         theme: { color: "#0F62FE" },

//         handler: async function (response: any) {
//           try {
//             console.log("Razorpay response:", response);

//             // #2: Verify payment
//             const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/verify`, {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 PaidJobId: OrderData.PaidJobId,
//               }),
//             });

//             if (!verifyRes.ok) {
//               alert("Verification request failed");
//               return;
//             }

//             const verifyData = await verifyRes.json();
//             console.log("Verify response:", verifyData);

//             if (verifyData.success) {
//               alert("Payment verified successfully!");
//               router.push("/thank-you");
//             } else {
//               alert("Payment verification failed!");
//             }
//           } catch (error) {
//             console.error("Verify error:", error);
//             alert("Error verifying payment");
//           } finally {
//             setLoading(false);
//           }
//         },
//       };

//       // Razorpay popup
//       const rzrp = new (window as any).Razorpay(options);

//       rzrp.on("payment.failed", function (response: any) {
//         console.error("Payment failed:", response.error);
//         alert("Payment failed! No money deducted. Please try again.");
//         setLoading(false);
//       });

//       rzrp.open();
//     } catch (err) {
//       console.error("Payment error:", err);
//       alert("Something went wrong while starting payment");
//       setLoading(false);
//     }
//   };




//   return (
//     <section className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 md:px-0">

//       {/* Main Card */}
//       <div className="max-w-4xl w-full bg-white rounded-3xl shadow-md p-8 md:p-12 flex flex-col gap-10 relative">

//         {/* Header */}
//         <div className="text-center">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
//             Unlock Metadata for Your Latest 10 Videos
//           </h1>
//           <p className="mt-2 text-gray-600 text-sm md:text-base">
//             Get AI-powered titles, descriptions, tags & hashtags — all for just <span className="text-red-600 font-semibold">₹99</span>!
//           </p>
//         </div>

//         {/* Why Buy Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
//           <div className="flex flex-col justify-center gap-3">
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">Why Buy?</h2>
//             <ul className="list-disc list-inside text-gray-700 text-sm md:text-base space-y-1">
//               <li>Save hours writing titles & tags.</li>
//               <li>Boost views with SEO-optimized metadata.</li>
//               <li>AI suggestions for trending videos.</li>
//               <li>All 10 latest videos in one click.</li>
//               <li>Less than <span className="text-red-600">₹10 per video</span>— unbeatable deal!</li>
//             </ul>
//           </div>

//           {/* Inline Metadata Illustration */}
//           <div className="flex justify-center md:justify-end">
//   <svg
//     className="w-48 h-48"
//     viewBox="0 0 200 200"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     {/* Video thumbnail */}
//     <rect
//       x="10"
//       y="10"
//       width="180"
//       height="100"
//       rx="12"
//       fill="url(#thumbGradient)"
//       stroke="#fca5a5"
//       strokeWidth="2"
//     />
//     <polygon
//       points="80,50 120,65 80,80"
//       fill="#f87171"
//       stroke="#dc2626"
//       strokeWidth="1"
//     />

//     {/* Title bars */}
//     <rect x="10" y="120" width="180" height="10" rx="3" fill="#fca5a5" />
//     <rect x="10" y="135" width="150" height="10" rx="3" fill="#fecaca" />

//     {/* Tags / Hashtags */}
//     <rect x="10" y="155" width="40" height="8" rx="4" fill="#fca5a5" />
//     <rect x="55" y="155" width="30" height="8" rx="4" fill="#fecaca" />
//     <rect x="90" y="155" width="50" height="8" rx="4" fill="#f87171" />

//     {/* Gradient definition */}
//     <defs>
//       <linearGradient id="thumbGradient" x1="0" y1="0" x2="1" y2="1">
//         <stop offset="0%" stopColor="#fef2f2" />
//         <stop offset="100%" stopColor="#fca5a5" />
//       </linearGradient>
//     </defs>
//   </svg>
// </div>

//         </div>

//         {/* Features / What You Get */}
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
//             What You Get
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm md:text-base">
//             <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition">
//               <span className="font-semibold">Titles</span>
//               <p>Click-worthy, SEO-optimized titles for 10 videos.</p>
//             </div>
//             <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition">
//               <span className="font-semibold">Descriptions</span>
//               <p>Engaging descriptions that increase watch time.</p>
//             </div>
//             <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition">
//               <span className="font-semibold">Tags</span>
//               <p>Trending tags for better discoverability.</p>
//             </div>
//             <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition">
//               <span className="font-semibold">Hashtags</span>
//               <p>Curated hashtags to maximize reach.</p>
//             </div>
//           </div>
//         </div>

//         {/* Unlock Button inside the card */}
//         <div className="text-center mt-6">
//           <button
//             className="px-8 py-4 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition text-lg"
//             onClick={HandlePayment}
//           >
//             {loading ? "Processing..." : "Unlock Full Metadata Now — ₹99"}
//           </button>
//         </div>

//         {/* Footer Note */}
//         <p className="text-gray-500 text-xs text-center mt-6">
//           Your payment covers AI service costs and supports ReachAI development.
//         </p>
//       </div>
//     </section>
//   );
// }












































































"use client"
import React, { useState } from "react";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BuyMetadataPage() {

  //taking value from url send by motia backend from email...
  const router = useRouter()
  const params = useParams();              // { channelId: "UC99999" }
  const searchParams = useSearchParams();  // URLSearchParams object means query wala '?'
  const channelId = params.channelId;
  const email = searchParams.get("email");
  const [ loading , setLoading ]=useState(false)




  //----------------------------------- handling payment -----------------------
  const HandlePayment = async () => {
    try {

      setLoading(true);
    //----- #1: creating order ------
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channelId, email }),
        }
      );

      const OrderData = await res.json();
      setLoading(false);

      if (!OrderData?.orderId) {
        toast.error("Order creation failed!");
        return;
      }

      //--- if order created successfully -- popup razorpay details object
      //razorpay option--
      const options: any = {
        key: OrderData.keyId,
        amount: OrderData.amount,
        currency: OrderData.currency,
        name: "ReachAI",
        description: "Unlock full metadata of your channel for latest 10 videos.",
        order_id: OrderData.orderId,
        prefill: { email },
        theme: { color: "#0F62FE" },

      //#### use of handler because to redirect after veryfing payment.
        handler: async function (response: any) {
          try {

             console.log("Razorpay response:", response);

            //---#2: veryfying payments---------
            const verifyRes = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  PaidJobId: OrderData.PaidJobId,  //from my side because of motia.
                }),
              }
            );


             if (!verifyRes.ok) {
              toast.error("Verification request failed");
              return;
            }

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success("Payment successful! Redirecting to thank you page...");
              router.push(`/thank-you/${response.razorpay_payment_id}`);

            } else {
              toast.error("Payment verification failed!");
            }

          } catch (error) {
            console.log(error);
            toast.error("Error verifying payment");
          }finally{
            setLoading(false)
          }
        },
      };

      
    //##### --------razorpay pop-up opening
      const rzrp = new (window as any).Razorpay(options);

      //if payment failed
      rzrp.on("payment.failed", function (response:any) {
        toast.info("Payment failed! No money deducted. Please try again.");
        console.log("Payment failed", response.error)
        setLoading(false);
      });

      rzrp.open();

    } catch (err) {
      alert("Something went wrong while starting payment");
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gray-50 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full">
        
        {/* MAIN CARD */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto">
          
          {/* DESKTOP: Two Column Layout */}
          <div className="lg:grid lg:grid-cols-5">
            
            {/* LEFT SIDE - HEADER */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-8 sm:px-8 sm:py-10 lg:py-12 lg:col-span-2 text-center lg:text-left text-white lg:flex lg:flex-col lg:justify-center">
              <div className="lg:px-6">
                {/* <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                  Limited Time Offer
                </div> */}
                <h1 className="text-xl md:text-2xl font-bold mb-2 sm:mb-3 lg:leading-tight">
                  Get Full Metadata for 10 Videos
                </h1>
                <p className="text-red-50 text-xs sm:text-base mb-4 sm:mb-6">
                  AI-optimized titles, descriptions, tags & hashtags
                </p>
                
                {/* PRICE */}
                <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <span className="text-lg sm:text-xl line-through opacity-75">₹199</span>
                  <span className="text-4xl sm:text-5xl lg:text-5xl font-bold">₹99</span>
                </div>
                {/* <p className="text-white text-sm sm:text-base lg:text-base font-medium mb-4 sm:mb-6">
                  Less than ₹10 per video
                </p> */}

                <button
  onClick={HandlePayment}
  disabled={loading}
  className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-sm lg:max-w-full mx-auto lg:mx-0 px-6 py-3 sm:px-8 sm:py-4 bg-white text-red-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
>
  {loading ? (
    "⏳ Processing..."
  ) : (
    <span className="inline-flex items-center">
      Unlock Now <span className="ml-2 align-middle leading-none">&#8594;</span>
    </span>
  )}
</button>

                
                <p className="text-red-100 text-xs  mt-3 sm:mt-4">one-time payment • No subscription • Instant access</p>
              </div>
            </div>

            {/* RIGHT SIDE - CONTENT */}
            <div className="px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-12 lg:col-span-3 lg:flex lg:flex-col lg:justify-center">
            
            {/* WHAT YOU GET */}
            <div className="mb-6 lg:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center lg:text-left">What You'll Receive</h2>
              <div className="grid gap-2 sm:gap-3">
                {[
                  { icon: "📝", text: "20 SEO-Optimized Titles", sub: "Click-worthy & algorithm-friendly" },
                  { icon: "📄", text: "10 Full Video Descriptions", sub: "Rich content tailored to your niche" },
                  { icon: "🏷️", text: "High-Ranking Tags", sub: "Keyword clusters for discovery" },
                  { icon: "#️⃣", text: "Trending Hashtags", sub: "Niche related hashtags that boost discoverability" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50/50 transition-all">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-sm sm:text-base text-gray-900">{item.text}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WHY THIS WORKS */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 rounded-2xl p-4 sm:p-5 mb-0">
              <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                <span className="text-lg">💡</span>
                Why ReachAI over free AI model?
              </h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                ReachAI studies your niche and real-time trends to generate titles and metadata that match what’s performing "right now" but free AI model gives outdated, generic SEO keywords.

              </p>
            </div>
          </div>

          </div>

          {/* COMPARISON TABLE - Full Width Below */}
          <div className="px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 border-t border-gray-100 bg-gray-50">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 text-center">Free vs Paid</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 max-w-2xl mx-auto">
              <div className="p-4 sm:p-5 lg:p-6 bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
                <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 mb-1 sm:mb-2">Free</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Limited access</p>
                <div className="space-y-1.5 text-[10px] sm:text-xs lg:text-sm text-gray-600">
                  <p>✓ 2 titles only</p>
                  <p>✓ 5 videos</p>
                  <p className="text-gray-400">✗ No descriptions</p>
                  <p className="text-gray-400">✗ No tags/hashtags</p>
                </div>
              </div>
              <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-400 relative overflow-hidden shadow-sm">
                {/* <div className="absolute top-2 right-2 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full bg-red-500 shadow">
                  BEST VALUE
                </div> */}
                <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 text-red-600">Paid (₹99)</h3>
                <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">Complete package</p>
                <div className="space-y-1.5 text-[10px] sm:text-xs lg:text-sm text-gray-700">
                  <p>✓ Full metadata</p>
                  <p>✓ 10 videos</p>
                  <p>✓ All features included</p>
                  <p className="font-semibold text-red-600">✓ Only ₹9.90/video</p>
                </div>
              </div>
            </div>


            {/* BOTTOM CTA */}
            <div className="flex justify-center">
              <button
                onClick={HandlePayment}
                disabled={loading}
                className=" w-full max-w-xl mx-auto mt-6 sm:mt-8 px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg shadow-red-400/30 hover:shadow-xl transition-all text-base sm:text-lg lg:text-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? "⏳ Processing..." : "Get Full Access — ₹99"}
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-5 sm:mt-6 text-[10px] sm:text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-green-600">✓</span> Secure Payment
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-600">✓</span> Instant Delivery
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-600">✓</span> Money Safe
              </span>
            </div>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-gray-500 text-xs text-center mt-6">
           Your payment covers AI service costs and supports ReachAI development.
        </p>
      </div>
    </section>
  );
}









