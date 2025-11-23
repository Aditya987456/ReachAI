"use client";
import React from "react";

export default function ThankYouPage() {
  return (
    <section className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 px-4 md:px-0">
      
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-md p-8 md:p-12 flex flex-col items-center gap-6 text-center">

        {/* Success Icon */}
        <div className="w-24 h-24 flex items-center justify-center bg-green-100 rounded-full">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Thank You Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Thank You for Your Purchase!
        </h1>
        <p className="text-gray-700 text-sm md:text-base">
          Your payment was successful. 🎉 <br />
          The full metadata for your latest 10 videos will be sent to your email within 1-2 minutes.
        </p>

        {/* Contact Info */}
        <p className="text-gray-600 text-sm md:text-base mt-2">
          For any questions or suggestions, reach out at{" "}
          <a href="mailto:support@reachai.com" className="text-red-600 font-semibold underline">
            support@reachai.com
          </a>
          .
        </p>

        {/* Back Button */}
        <button
          className="mt-4 px-8 py-3 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition"
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </button>

      </div>
    </section>
  );
}
