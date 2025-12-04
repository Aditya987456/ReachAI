export default function Benefits() {
  const items = [
    { title: "Grow views faster", desc: "AI finds trending hooks & keywords that attract clicks.", icon: "🚀" },
    { title: "Niche-aware suggestions", desc: "ReachAI studies top creators in your niche.", icon: "🔍" },
    { title: "Save hours of research", desc: "Stop guessing — get tested title patterns instantly.", icon: "⏳" },
    { title: "Better CTR = more revenue", desc: "Higher CTR leads to more viewers and monetization opportunities.", icon: "💰" },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-[#F7FBFF] to-white relative overflow-hidden">
  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-200 opacity-5 blur-[140px]" />

  <div className="max-w-[1350px] mx-auto px-6 lg:px-28 text-center relative z-10">

    <div className="inline-block mb-4 px-4 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
            Why Choose Us
    </div>


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
  );
}
