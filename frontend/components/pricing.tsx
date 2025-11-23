export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      perks: ["1 Free report", "5 AI titles", "Basic tags"],
      accent: "border-gray-200",
      cta: "Try free",
    },
    {
      name: "Pro",
      price: "₹99",
      perks: ["Unlimited reports", "40 AI titles / month", "Tags + Descriptions", "Priority email"],
      accent: "border-red-200",
      cta: "Unlock Pro",
      popular: true,
    },
    {
      name: "Lifetime",
      price: "₹999",
      perks: ["Lifetime access", "Unlimited everything", "Priority support"],
      accent: "border-yellow-200",
      cta: "Buy Lifetime",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-40 text-center">
        <div className="max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold">Pricing that fits creators</h2>
          <p className="text-gray-600 mt-3">Simple transparent pricing — try the Free plan, upgrade anytime.</p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-6 flex flex-col justify-between ${p.accent} shadow-sm hover:shadow-md`}>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  {p.popular && <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">Popular</span>}
                </div>
                <p className="text-3xl font-bold mt-6">{p.price}</p>
                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  {p.perks.map((perk) => (<li key={perk}>• {perk}</li>))}
                </ul>
              </div>

              <div className="mt-6">
                <button className={`w-full py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700`}>
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
