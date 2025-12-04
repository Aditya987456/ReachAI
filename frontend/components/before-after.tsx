export default function BeforeAfter() {
  return (
  <section className="py-20 md:py-24 bg-white">
      <div className="max-w-[1180px] mx-auto px-6 lg:px-20 flex flex-col items-center gap-12">

    {/* Heading */}
    <div className="text-center max-w-[700px]">


      <div className="inline-block mb-4 px-4 py-1 bg-red-50 text-red-600 rounded-full text-sm font-semibold">
              Real Results
         </div>





      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
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
        <div className="py-5 font-semibold text-gray-700 border-r border-red-100">😴 Before</div>
        <div className="py-5 font-semibold text-red-700">🔥 After (AI Optimized)</div>
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
             😴 BEFORE
            </span>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg font-medium leading-snug">
               “{item.before}”
            </p>
          </div>

          {/* After */}
          <div className="p-5 md:p-6 flex flex-col gap-2 bg-red-50/10">
            <span className="md:hidden inline-block bg-red-100 text-red-700 text-xs font-semibold py-1 px-2 rounded-md w-fit">
              🔥 AFTER (AI Optimized)
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
  );
}
