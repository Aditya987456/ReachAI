export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full py-28 px-6 lg:px-40 bg-gradient-to-b from-white via-[#FFF8F8] to-[#FFECEC] overflow-hidden"
    >
      {/* background glow shapes */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-200/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-pink-300/10 blur-[100px] rounded-full"></div>

      {/* heading */}
      <div className="relative max-w-5xl mx-auto text-center z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8">
          About <span className="text-red-600">ReachAI</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          ReachAI helps YouTubers gain visibility by generating trending,
          high-performance metadata — based on their
          <span className="font-semibold text-gray-900"> niche and real-time search trends</span>.
          No more manual keyword research or guessing.
        </p>
      </div>

      {/* info + illustration */}
      <div className="relative max-w-6xl mx-auto mt-20 grid md:grid-cols-2 gap-16 items-start z-10">
        {/* left text */}
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            Most creators make amazing videos but lose views because metadata isn’t optimized
            for what people are actually searching on YouTube.
          </p>
          <p>
            ReachAI analyzes your channel and trending topics to produce metadata proven
            to improve click-through rate and discoverability.
          </p>

          <ul className="space-y-3 text-[17px] pt-4 list-none pl-0">
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2 text-xl">⚡</span> Metadata in under 30 seconds
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2 text-xl">🚀</span> Tailored to your channel, not generic prompts
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2 text-xl">📌</span> Ready-to-paste titles, tags & descriptions
            </li>
          </ul>
        </div>

        {/* RIGHT — Lightweight clean illustration with no image load */}
        <div className="flex justify-center md:justify-start pt-8 md:pt-0">
          <div className="relative w-full max-w-md bg-white p-10 rounded-2xl shadow-lg border border-red-100">

            {/* floating circles */}
            <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-red-100"></div>
            <div className="absolute -bottom-5 right-6 w-16 h-16 rounded-full bg-pink-100/60"></div>

            {/* center minimal illustration */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-52 h-32 border-2 border-red-300 rounded-xl flex items-center justify-center bg-red-50">
                <span className="text-4xl">🎥</span>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">▶</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-300"></div>
                  <div className="w-3 h-3 rounded-full bg-pink-300"></div>
                  <div className="w-3 h-3 rounded-full bg-red-200"></div>
                </div>
              </div>

              <p className="text-lg font-semibold text-gray-800 text-center max-w-sm leading-relaxed">
                Smarter metadata. Higher reach.
                <br />
                You just create — we handle the growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* how it works — enhanced modern UI */}
      <div className="relative max-w-4xl mx-auto mt-28 bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-8 sm:p-10">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">
          How it works — super simple
        </h3>

        <div className="relative grid grid-cols-3 gap-8 sm:gap-10 text-center">
          {/* dotted connector line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 hidden sm:block">
            <div className="w-full h-full border-t-4 border-dotted border-red-300"></div>
          </div>

          {[
            { icon: "🔗", text: "Enter Channel ID" },
            { icon: "🧠", text: "AI analyzes trends" },
            { icon: "📄", text: "Get metadata instantly" },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center space-y-3 z-10 bg-white p-3 rounded-xl group"
            >
              <span className="text-5xl transition-transform group-hover:scale-110">
                {step.icon}
              </span>
              <p className="font-semibold text-gray-800 text-base">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
