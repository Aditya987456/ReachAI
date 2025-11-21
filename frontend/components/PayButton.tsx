'use client';

export default function PayButton({ channelId, email }: { channelId: string; email: string }) {
  const handlePayment = () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, // your TEST key
      amount: 9900, // ₹99 in paise
      currency: 'INR',
      name: 'ReachAI',
      description: 'Full Metadata Pack',
      handler: function (response: any) {
        console.log('Payment success:', response);
        window.location.href = '/thank-you';
      },
      prefill: { email },
      theme: { color: '#4F46E5' },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
    >
      Pay ₹99 & Unlock Metadata
    </button>
  );
}
