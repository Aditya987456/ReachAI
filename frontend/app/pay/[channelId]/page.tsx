"use client";


import React, { useState } from "react";


import { useParams, useSearchParams, useRouter } from "next/navigation";

export default function BuyMetadataPage() {

  //taking value from url send by motia...
  const router = useRouter()
  const params = useParams();              // { channelId: "UC99999" }
  const searchParams = useSearchParams();  // URLSearchParams object means query wala '?'
  const channelId = params.channelId;
  const email = searchParams.get("email");
  const [ loading , setLoading ]=useState(false)




  // //handle payment---
  // const HandlePayment=async ()=>{
  //   setLoading(true)

  // //-------- #1: creating order
  //   const res = await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ channelId, email }),
  //   });


  //   const OrderData = await res.json()
  //   setLoading(false)    
  //   if(!OrderData?.orderId){
  //     alert('Order Creation failed !')
  //     return
  //   }


  //   //popup razorpay details object
  //   const options: any = {
  //     //key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //     key:OrderData.keyId,
  //     amount: OrderData.amount,
  //     currency: OrderData.currency,
  //     name: "ReachAI",
  //     description: "Unlock full metadata for your YouTube channel's videos",
  //     order_id: OrderData.orderId,
  //     prefill: { email },

  //     //#### use of handler because to redirect after veryfing payment.
  //     handler: async function (response: any) {
  //       try {

  //           console.log("Razorpay response:", response);
  //       //-----veryfying payments
  //         const verifyRes = await fetch(`http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/verify`, {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_signature: response.razorpay_signature,
  //             PaidJobId: OrderData.PaidJobId,    //from my side because of motia.
  //           }),
  //       });

  //       const verifyData = await verifyRes.json()



  //       //success message-------like alert something.
  //       if (verifyData.success) router.push("/thank-you");
          
  //       } catch (error) {
  //         console.log(error)
  //       }
  //     },
  //       theme: { color: "#0F62FE" },
  //   };


  //   //##### --------razorpay pop-up opening
  //   const rzrp = new (window as any).Razorpay(options);

  //   //if payment failed
  //   rzrp.on("payment.failed", function (response:any) {
  //     console.log("Payment failed:", response.error);
  //     alert("Payment failed! No money deducted. Please try again.");
  //   });

  //   rzrp.open();
  
  // }




  //-----------------------------------------------------


  const HandlePayment = async () => {
    try {
      setLoading(true);

      // #1: Create order
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, email }),
      });

      const OrderData = await res.json();
      setLoading(false);

      if (!OrderData?.orderId) {
        alert("Order creation failed!");
        return;
      }

      // Razorpay options
      const options: any = {
        key: OrderData.keyId,
        amount: OrderData.amount,
        currency: OrderData.currency,
        name: "ReachAI",
        description: "Unlock full metadata for your YouTube channel's videos",
        order_id: OrderData.orderId,
        prefill: { email },
        theme: { color: "#0F62FE" },

        handler: async function (response: any) {
          try {
            console.log("Razorpay response:", response);

            // #2: Verify payment
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                PaidJobId: OrderData.PaidJobId,
              }),
            });

            if (!verifyRes.ok) {
              alert("Verification request failed");
              return;
            }

            const verifyData = await verifyRes.json();
            console.log("Verify response:", verifyData);

            if (verifyData.success) {
              alert("Payment verified successfully!");
              router.push("/thank-you");
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            console.error("Verify error:", error);
            alert("Error verifying payment");
          } finally {
            setLoading(false);
          }
        },
      };

      // Razorpay popup
      const rzrp = new (window as any).Razorpay(options);

      rzrp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        alert("Payment failed! No money deducted. Please try again.");
        setLoading(false);
      });

      rzrp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong while starting payment");
      setLoading(false);
    }
  };




  return (
    <section className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 md:px-0">

      {/* Main Card */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-md p-8 md:p-12 flex flex-col gap-10 relative">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Unlock Metadata for Your Latest 10 Videos
          </h1>
          <p className="mt-2 text-gray-600 text-sm md:text-base">
            Get AI-powered titles, descriptions, tags & hashtags — all for just <span className="text-red-600 font-semibold">₹99</span>!
          </p>
        </div>

        {/* Why Buy Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col justify-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Why Buy?</h2>
            <ul className="list-disc list-inside text-gray-700 text-sm md:text-base space-y-1">
              <li>Save hours writing titles & tags.</li>
              <li>Boost views with SEO-optimized metadata.</li>
              <li>AI suggestions for trending videos.</li>
              <li>All 10 latest videos in one click.</li>
              <li>Less than <span className="text-red-600">₹10 per video</span>— unbeatable deal!</li>
            </ul>
          </div>

          {/* Inline Metadata Illustration */}
          <div className="flex justify-center md:justify-end">
  <svg
    className="w-48 h-48"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Video thumbnail */}
    <rect
      x="10"
      y="10"
      width="180"
      height="100"
      rx="12"
      fill="url(#thumbGradient)"
      stroke="#fca5a5"
      strokeWidth="2"
    />
    <polygon
      points="80,50 120,65 80,80"
      fill="#f87171"
      stroke="#dc2626"
      strokeWidth="1"
    />

    {/* Title bars */}
    <rect x="10" y="120" width="180" height="10" rx="3" fill="#fca5a5" />
    <rect x="10" y="135" width="150" height="10" rx="3" fill="#fecaca" />

    {/* Tags / Hashtags */}
    <rect x="10" y="155" width="40" height="8" rx="4" fill="#fca5a5" />
    <rect x="55" y="155" width="30" height="8" rx="4" fill="#fecaca" />
    <rect x="90" y="155" width="50" height="8" rx="4" fill="#f87171" />

    {/* Gradient definition */}
    <defs>
      <linearGradient id="thumbGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef2f2" />
        <stop offset="100%" stopColor="#fca5a5" />
      </linearGradient>
    </defs>
  </svg>
</div>

        </div>

        {/* Features / What You Get */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
            What You Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm md:text-base">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition">
              <span className="font-semibold">Titles</span>
              <p>Click-worthy, SEO-optimized titles for 10 videos.</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition">
              <span className="font-semibold">Descriptions</span>
              <p>Engaging descriptions that increase watch time.</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition">
              <span className="font-semibold">Tags</span>
              <p>Trending tags for better discoverability.</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition">
              <span className="font-semibold">Hashtags</span>
              <p>Curated hashtags to maximize reach.</p>
            </div>
          </div>
        </div>

        {/* Unlock Button inside the card */}
        <div className="text-center mt-6">
          <button
            className="px-8 py-4 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition text-lg"
            onClick={HandlePayment}
          >
            {loading ? "Processing..." : "Unlock Full Metadata Now — ₹99"}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-gray-500 text-xs text-center mt-6">
          Your payment covers AI service costs and supports ReachAI development.
        </p>
      </div>
    </section>
  );
}

