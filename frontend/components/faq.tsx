"use client";
import { useState } from "react";



export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "How does ReachAI generate the metadata?", a: "ReachAI analyzes trending videos in your niche and generates optimized titles, tags and descriptions using hooks that increase CTR." },
    { q: "Do I need to connect my YouTube account?", a: "No. Only channel ID and email are required. No login or OAuth requested." },
    { q: "Can I test it for free?", a: "Yes — sample metadata is free. The full optimized metadata unlocks after payment." },
    { q: "How fast do I receive the results?", a: "Within 15–30 seconds after submitting your channel details." },
    { q: "Does it work for any niche?", a: "Yes — gaming, tech, fitness, vlogs, motivation, finance, etc." },
  ];

  return (

    <section id="faq" className="py-16 md:py-24">
    <div className="max-w-[1200px] mx-auto px-6 lg:px-28 flex flex-col gap-10 text-center">
      
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
        Frequently <span className="text-red-600">Asked Questions</span>
      </h2>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto flex flex-col gap-3 text-left">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border transition"
          >
            {/* Question */}
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4 font-medium text-sm sm:text-[16px] md:text-[17px]"
            >
              <span className={`${open === i ? "text-red-600" : "text-black"}`}>
                {item.q}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-red-600">
                {open === i ? "-" : "+"}
              </span>
            </button>

            {/* Answer */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                open === i ? "max-h-40 px-4 sm:px-5 pb-4" : "max-h-0"
              }`}
            >
              <p className="text-gray-600 text-xs sm:text-[14px] md:text-[15px] leading-relaxed">
                {item.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  );
}
