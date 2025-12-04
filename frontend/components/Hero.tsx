


import HeroForm from "./heroform";




export default function Hero() {


  return (
    <section
      className="w-full py-20 sm:py-28 lg:py-32 xl:py-36"
      style={{
        background:
          "linear-gradient(97.79deg, #FFFAFA 28.74%, #FF0000 117.88%)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 xl:px-28 grid grid-cols-1 xl:grid-cols-12 gap-12 items-center">

        {/* ------- Left side ----- */}
        <div
          className="
          xl:col-span-7 
          space-y-7 
          text-center xl:text-left
          
          /* --- LG ONLY CHANGES --- */
          md:max-w-3xl
          lg:max-w-4xl 
          md:mx-auto
          lg:space-y-9
          "
        >
          {/* AI optimized - badge*/}
          <span className="px-4 py-1 border border-red-600 bg-red-100 text-red-600 rounded-full text-sm font-semibold inline-flex items-center gap-2 mx-auto xl:mx-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            AI optimized
          </span>

          {/* Heading */}
          <h1 className="
            text-3xl sm:text-4xl md:text-5xl 
            font-extrabold leading-snug xl:leading-tight 
            max-w-2xl mx-auto xl:mx-0

            /* lg+ screen width increase. */
            lg:max-w-4xl
          ">
            Boost YouTube Reach with{" "}
            <span className="text-red-600">AI-Powered</span>,{" "}
            
            <span className="relative inline-block text-red-600 pr-2 pb-1">
              Trend-Aware
              <svg
                className="
                  absolute left-0 bottom-0 w-full
                  h-[6px] sm:h-[7px] md:h-[8px] lg:h-[9px] xl:h-[10px]
                "
                viewBox="0 0 280 10"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 6C70 0 210 0 276 6"
                  stroke="#DC2626"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            Metadata.
          </h1>

          <p className="
            text-gray-700 max-w-lg mx-auto xl:mx-0 
            text-sm sm:text-base md:text-lg md:max-w-xl

            /* LG wider line width */
            lg:max-w-3xl
          ">
            ReachAI analyzes your channel, finds what's trending in your niche,
            and generates SEO-optimized <b>titles, description, tags and hashtags</b> that boosts your YouTube growth.
          </p>
        </div>

        {/* right side form */}
        <div
          className="
          xl:col-span-5 
          flex justify-center xl:justify-end w-full 

          /* lg+ screen width increase. */
          max-w-md sm:max-w-lg md:max-w-2xl 
          lg:max-w-3xl mx-auto
          "
        >
          <HeroForm />
        </div>
      </div>
    </section>
  );
}

