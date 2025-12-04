import BackHomeButton from "@/components/BackHomeButton";

export default function RefundPage() {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <main className="w-full flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl text-[15px] sm:text-base leading-relaxed">
        <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: {currentDate}</p>

        <p className="mb-4">
          ReachAI provides instant AI-generated digital metadata. Once the
          metadata has been delivered, the service is considered consumed and
          cannot be returned.
        </p>

        <p className="mb-4">
          Refunds are not offered for dissatisfaction with AI output, lack of
          expected performance, or change of mind.
        </p>

        <p className="mb-4">
          In rare circumstances—such as technical errors or service failures—we
          may review a request and decide at our discretion.
        </p>

        <p className="mb-4">
          To request assistance, please contact us through the{" "}
          <a href="/contact" className="text-blue-600 font-extrabold">
            Contact page
          </a>.
        </p>

        <div className="flex items-center justify-center mt-4">
        <BackHomeButton/>
        </div>


    
      </div>
    </main>
  );
}
