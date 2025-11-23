export default function Hero() {
  return (
    <section
      className="w-full py-28 md:py-40"
      style={{
        background: "linear-gradient(97.79deg, #FFFAFA 28.74%, #FF0000 117.88%)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-40 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

        {/* LEFT side */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
         <span className="px-4 py-1 border border-red-600 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
          <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-1 shadow-[0_0_4px_rgba(255,0,0,0.6)] animate-pulse"></span>
          AI optimized
        </span>


          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug lg:leading-tight">
            Boost YouTube Reach with{" "}
            <span className="text-red-600">AI-Powered</span>,{" "}
            <span className="text-red-600">Trend-Aware</span>{" "}
            Metadata.
          </h1>

          <p className="text-gray-700 max-w-lg mx-auto lg:mx-0 text-sm sm:text-base md:text-lg">
            ReachAI analyzes your channel, finds what's trending in your niche,
            and generates SEO-optimized metadata that boosts your YouTube growth.
          </p>
        </div>

        {/* RIGHT side — FORM */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            {/* Shadow */}
            <div className="absolute inset-0 rounded-2xl -z-10 translate-x-4 translate-y-4 bg-black/40 shadow-[0_10px_25px_rgba(0,0,0,0.3)]"></div>

            <form className="bg-white shadow-xl border rounded-2xl p-7 space-y-5">
              <h2 className="text-xl sm:text-2xl font-bold leading-snug text-center">
                Generate Free <span className="text-red-600">AI-Powered</span> Titles Now!
              </h2>
              <p className="text-center text-gray-500 text-sm sm:text-base ">
                100% free. No Signup, No Signin required.<br />
                Free titles sent to your email.
              </p>

              <input
                type="text"
                placeholder="Enter YouTube channel ID"
                className="w-full border rounded-xl px-5 py-3 text-sm sm:text-base focus:outline focus:outline-red-600"
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-xl px-5 py-3 text-sm sm:text-base focus:outline focus:outline-red-600"
              />

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-base sm:text-lg py-3 rounded-xl flex justify-center gap-2"
              >
                ✨ Generate Titles
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
