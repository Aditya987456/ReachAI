// "use client";
// import React from "react";

// export default function ThankYouPage() {
//   return (
//     <section className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 px-4 md:px-0">
      
//       <div className="max-w-xl w-full bg-white rounded-3xl shadow-md p-8 md:p-12 flex flex-col items-center gap-6 text-center">

//         {/* Success Icon */}
//         <div className="w-24 h-24 flex items-center justify-center bg-green-100 rounded-full">
//           <svg
//             className="w-12 h-12 text-green-600"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
//           </svg>
//         </div>

//         {/* Thank You Message */}
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//           Thank You for Your Purchase!
//         </h1>
//         <p className="text-gray-700 text-sm md:text-base">
//           Your payment was successful. 🎉 <br />
//           The full metadata for your latest 10 videos will be sent to your email within 1-2 minutes.
//         </p>

//         {/* Contact Info */}
//         <p className="text-gray-600 text-sm md:text-base mt-2">
//           For any questions or suggestions, reach out at{" "}
//           <a href="mailto:support@reachai.com" className="text-red-600 font-semibold underline">
//             support@reachai.com
//           </a>
//           .
//         </p>

//         {/* Back Button */}
//         <button
//           className="mt-4 px-8 py-3 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition"
//           onClick={() => (window.location.href = "/")}
//         >
//           Back to Home
//         </button>

//       </div>
//     </section>
//   );
// }





"use client";
import React from "react";

export default function ThankYouPage() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center py-16 px-4 md:px-0">
      
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 flex flex-col items-center gap-6 text-center">

        {/* Success Icon with Animation */}
        <div className="w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 rounded-full shadow-md sm:shadow-lg animate-pulse">
          <svg
            className="w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Thank You Message */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-700 text-sm md:text-lg leading-relaxed">
            Thank you for your purchase! Your order has been confirmed.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="w-full bg-blue-50 rounded-2xl p-6 text-left space-y-3">
          <h2 className="text-md font-semibold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            What happens next?
          </h2>
          <ul className="space-y-2 text-xs md:text-base text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Your metadata report will be sent to your email <strong>within 1-2 minutes</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>The report includes full metadata for your latest 10 videos</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Check your spam/junk folder if you don't see it in your inbox</span>
            </li>
          </ul>
        </div>

        {/* Support Text */}
        <p className="text-gray-600 text-sm md:text-base mt-4">
          If you have any questions, feedback, or suggestions please visit our{" "}
          <a href="/contact" className="text-red-600 font-semibold underline hover:text-red-700">
            contact page
          </a>
          .
        </p>

        {/* Back to Home Button */}
        <button
          className="mt-6 px-8 py-3 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition"
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </button>

        {/* Order Confirmation Number (Optional) */}
        <p className="text-xs text-gray-500 mt-4">
          Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </div>
    </section>
  );
}
