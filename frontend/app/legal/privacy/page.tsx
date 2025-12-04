

import BackHomeButton from "@/components/BackHomeButton";


export default function PrivacyPage() {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last updated: {currentDate}</p>

      <p className="mb-4">
        ReachAI collects only the minimum required information to deliver
        metadata, including your YouTube channel handle, optional email, and
        basic device or browser analytics.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Data</h2>
      <p className="mb-4">
        We use the collected data to generate metadata, send reports, and
        improve ReachAI. We do not sell or rent personal information.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Payments</h2>
      <p className="mb-4">
        Payments are processed through Razorpay. We do not store banking,
        UPI, or card details.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">AI Processing</h2>
      <p className="mb-4">
        Your channel and video metadata may be shared with AI models to generate
        results. We do not store private video files.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Storage</h2>
      <p className="mb-4">
        ReachAI currently does not maintain a database for storing user
        metadata. Data is handled temporarily during processing.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Cookies</h2>
      <p className="mb-4">
        Minimal cookies or local storage may be used for session handling and
        UX. We do not track users across other websites.
      </p>


      <p className="mt-8">
        For privacy-related questions, please use the{" "}
        <a href="/contact" className="text-blue-600 font-extrabold">Contact page</a>.
      </p>

<div className="flex items-center justify-center mt-4">
<BackHomeButton/>
</div>




    </main>
  );
}
