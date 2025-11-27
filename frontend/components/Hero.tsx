
import HeroForm from "./heroform";
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
          <span className="inline-block w-2 h-2  bg-red-600 rounded-full mr-1 shadow-[0_0_4px_rgba(255,0,0,0.3)] animate-pulse"></span>
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

        {/*-------- form generate titles right side */}
        <HeroForm/>

      </div>
    </section>
  );
}
