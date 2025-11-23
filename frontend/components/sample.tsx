type Sample = {
  before: string;
  after: string;
  tags: string[];
  description: string;
};

const sample: Sample = {
  before: "How to grow on YouTube",
  after: "This NEW Strategy Skyrocketed Small YouTubers — Nobody is Talking About This",
  tags: ["#YouTubeGrowth", "#AlgorithmHack", "#ContentStrategy"],
  description:
    "Short description that highlights a unique hook and promises immediate value — crafted to boost CTR and watch-time.",
};

export default function SampleOutput() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-red-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-40">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Real sample output — <span className="text-red-600">Before → After</span>
          </h2>
          <p className="text-gray-600 mt-3">See how ReachAI rewrites a bland title into a high-converting hook.</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <h4 className="text-sm text-gray-500 mb-2">Before</h4>
                <p className="text-lg font-medium">“{sample.before}”</p>
              </div>

              <div>
                <h4 className="text-sm text-gray-500 mb-2">After</h4>
                <p className="text-lg font-semibold text-red-600">“{sample.after}”</p>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="text-sm text-gray-500 mb-2">Generated tags</h5>
              <div className="flex flex-wrap gap-2">
                {sample.tags.map((t) => (
                  <span key={t} className="text-sm px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                    {t}
                  </span>
                ))}
              </div>

              <h5 className="text-sm text-gray-500 mt-4 mb-2">Suggested description (preview)</h5>
              <p className="text-gray-700">{sample.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
