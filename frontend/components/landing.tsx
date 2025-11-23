"use client";
import { useState } from "react";
import PromoCard from "./promoCard";

export default function SectionsPage() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "How does ReachAI generate the metadata?", a: "ReachAI analyzes trending videos in your niche and generates optimized titles, tags and descriptions using hooks that increase CTR." },
    { q: "Do I need to connect my YouTube account?", a: "No. Only channel ID and email are required. No login or OAuth requested." },
    { q: "Can I test it for free?", a: "Yes — sample metadata is free. The full optimized metadata unlocks after payment." },
    { q: "How fast do I receive the results?", a: "Within 15–30 seconds after submitting your channel details." },
    { q: "Does it work for any niche?", a: "Yes — gaming, tech, fitness, vlogs, motivation, finance, etc." },
  ];

  return (
    <>
      {/* ================= BEFORE → AFTER ================= */}
<section className="w-full py-20 md:py-24 bg-white">
  <div className="max-w-[1180px] mx-auto px-6 lg:px-20 flex flex-col items-center gap-12">

    {/* Heading */}
    <div className="text-center max-w-[700px]">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
        Before <span className="text-gray-400">→</span> <span className="text-red-600">After</span>
      </h2>
      <p className="text-gray-500 text-sm font-bold sm:text-base mt-3">
        Watch how optimized hooks transform normal titles into viral winners.
      </p>
    </div>

    {/* Table */}
    <div className="w-full max-w-[1050px] rounded-3xl border border-red-200 shadow-xl overflow-hidden">

      {/* Header — desktop */}
      <div className="hidden md:grid grid-cols-2 bg-gray-50 border-b border-red-200 text-center">
        <div className="py-5 font-semibold text-gray-700 border-r border-red-100">Before</div>
        <div className="py-5 font-semibold text-red-700">After</div>
      </div>

      {[
        { before: "How to stop procrastinating", after: "This 3-Minute Trick Killed My Procrastination Forever ⏰" },
        { before: "How to get more YouTube views", after: "This Hidden Algorithm Hack 10×'d My YouTube Views 🚀" },
        { before: "Minecraft survival challenge", after: "I Survived 100 Days in Minecraft Hardcore 😱" },
        { before: "Morning routine for success", after: "The 7-Minute Morning Routine That Rewired My Brain 🧠" },
      ].map((item, i) => (
        <div
          key={i}
          className="
            grid grid-cols-1 md:grid-cols-2
            border-b last:border-b-0 border-red-100
            transition hover:bg-red-50/60
          "
        >
          {/* Before */}
          <div className="p-5 md:p-6 md:border-r border-red-100 flex flex-col gap-2">
            {/* Visible labels on sm/md now */}
            <span className="md:hidden inline-block bg-gray-100 text-gray-700 text-xs font-semibold py-1 px-2 rounded-md w-fit">
              BEFORE
            </span>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg font-medium leading-snug">
               “{item.before}”
            </p>
          </div>

          {/* After */}
          <div className="p-5 md:p-6 flex flex-col gap-2 bg-red-50/10">
            <span className="md:hidden inline-block bg-red-100 text-red-700 text-xs font-semibold py-1 px-2 rounded-md w-fit">
              AFTER (AI Optimized)
            </span>
            <p className="text-red-700 text-sm sm:text-base md:text-lg font-semibold leading-snug">
              {item.after}
            </p>
          </div>
        </div>
      ))}
    </div>
    
  </div>
</section>







      {/* ================= HOW REACHAI WORKS ================= */}
<section className="py-16 md:py-24 bg-gradient-to-b from-white via-[#F7FBFF] to-white relative overflow-hidden">
  {/* Decorative Blur */}
  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-200 opacity-10 blur-[120px]" />

  {/* Heading */}
  <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
    <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4">
      How <span className="text-red-600">ReachAI</span> Works
    </h2>
    <p className="text-gray-600 max-w-2xl mx-auto mb-12 md:mb-16 text-sm sm:text-base md:text-[16px] lg:text-[18px]">
      “ReachAI learns from trending videos in your niche and crafts optimized titles,tags and description for clicks.”
    </p>
  </div>

  {/* Timeline */}
  <div className="max-w-4xl mx-auto px-6 relative">
    {/* Main vertical line */}
    <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-red-200 top-0 z-0"></div>

    {[
      {
        title: "Enter Channel & Email",
        desc: "Provide your channel ID and email ID to ReachAI",
      },
      {
        title: "AI Scans Trends",
        desc: "ReachAI analyzes the latest trending videos, keywords, and engagement patterns in your niche.",
      },
      {
        title: "Get Titles",
        desc: "Receive optimized video titles instantly on your email",
      },
      {
        title: "Unlock Full Metadata",
        desc: "After payment, get titles, descriptions, tags & hashtags for latest 10 videos.",
        last: true,
      }
    ].map((item, index) => (
      <div
        key={item.title}
        className={`flex relative mb-10 md:mb-16 w-full ${
          index % 2 === 0 ? "md:justify-start" : "md:justify-end"
        }`}
      >
        {/* Step Dot */}
        <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 z-10 flex flex-col items-center">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white ring-opacity-80">
            <span className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl">{index + 1}</span>
          </div>
          {/* Vertical line below the dot (only if not last step) */}
          {!item.last && <div className="w-0.5  h-full bg-red-200 mt-1"></div>}
        </div>

        {/* Content Card */}
        <div
          className={`w-full ml-14 md:ml-0 p-4 md:p-6 bg-white rounded-2xl shadow-md border border-red-100/50 hover:border-red-300 transition-all text-left text-sm sm:text-base md:text-[16px] lg:text-[16px] ${
            index % 2 === 0
              ? "md:w-[calc(50%-4rem)] md:pr-10"
              : "md:w-[calc(50%-4rem)] md:pl-10 order-2"
          }`}
        >
          <h3 className="font-bold text-base sm:text-lg md:text-xl lg:text-xl mb-1 text-red-600/70">
            {index + 1}. {item.title}
          </h3>
          <p className="text-gray-700">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
</section>


{/* ================= WHY REACHAI ================= */}
<section className="py-20 md:py-28 bg-gradient-to-b from-white via-[#F7FBFF] to-white relative overflow-hidden">
  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-200 opacity-5 blur-[140px]" />

  <div className="max-w-[1350px] mx-auto px-6 lg:px-28 text-center relative z-10">
    {/* Title */}
    <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
      Why <span className="text-red-600">ReachAI</span>?
    </h2>

    {/* Subtitle */}
    <p className="text-gray-600 max-w-2xl mx-auto mb-12 md:mb-16 text-sm sm:text-[15px] md:text-[16px] lg:text-[17px]">
      You create — ReachAI handles titles, tags & growth.
    </p>

    {/* Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
      {[
        ["🚀", "Grow Views Faster", "Titles designed to maximize CTR & reach."],
        ["🔍", "Niche-Aware", "Learns top patterns in your niche — not generic tips."],
        ["⏳", "Save Time", "Hours of research reduced to 30 seconds."],
        ["💰", "Boost Revenue", "Higher CTR → more views → more monetization."],
      ].map(([icon, title, desc]) => (
        <div
          key={title}
          className="w-full bg-white border rounded-3xl p-5 sm:p-6 md:p-7 shadow-md hover:shadow-xl hover:-translate-y-1 transition flex flex-col items-center text-center"
        >
          {/* Centered Icon */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-5">
            {icon}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-xs sm:text-sm md:text-[15px] leading-relaxed">
            {desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>



{/* ================= FAQ ================= */}
<section className="py-16 md:py-24">
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

    </>
  );
}
