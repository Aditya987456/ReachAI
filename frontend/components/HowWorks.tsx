
export default function HowWorks() {
  return (

  <section id="how" className="py-16 md:py-24 bg-gradient-to-b from-white via-[#F7FBFF] to-white relative overflow-hidden">
    {/* Decorative Blur */}
    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-200 opacity-10 blur-[120px]" />

    {/* Heading */}
    <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">

      <div className="inline-block mb-4 px-4 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
            Simple Process
      </div>

      <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4">
        How <span className="text-red-600">ReachAI</span> Works
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12 md:mb-16 italic text-sm sm:text-base md:text-[16px] lg:text-[18px]">
        “ReachAI learns from trending videos in your niche and crafts optimized titles,tags and description for clicks.”
      </p>
    </div>

    {/* Timeline */}
    <div className="max-w-4xl mx-auto px-6 relative">
      {/* Main vertical line */}
     <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-20 w-0.5 bg-red-200 z-0"></div>

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
          <div className="absolute -left-3 md:left-1/2 transform md:-translate-x-1/2 z-10 flex flex-col items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white ring-opacity-80">
              <span className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl">{index + 1}</span>
            </div>
            {/* Vertical line below the dot (only if not last step) */}
            {!item.last && <div className="w-0.5 h-full bg-red-200 mt-1"></div>}
          </div>
          {/* Content Card */}
          <div
            className={`w-full ml-14 md:ml-0 p-4 md:p-6 bg-white rounded-2xl shadow-md border border-red-100/50 hover:border-red-300 transition-all text-left text-sm sm:text-base md:text-[16px] lg:text-[16px] ${
              index % 2 === 0
                ? "md:w-[calc(50%-4rem)] md:pr-10"
                : "md:w-[calc(50%-4rem)] md:pl-10 order-2"
            }`}
          >
            <h3 className="font-bold text-base sm:text-md md:text-lg mb-1 text-red-700">
              {index + 1}. {item.title}
            </h3>
            <p className="text-gray-700">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
  );
}

