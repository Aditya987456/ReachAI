'use client';

import { useParams, useSearchParams } from 'next/navigation';
import PayButton from '@/components/PayButton';

export default function PayPage() {
  const { channelId } = useParams();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Unlock Full Metadata 🚀</h1>
        <p className="text-gray-600 mb-6">
          Get optimized titles, descriptions, tags, and hashtags for your 10 latest videos — powered by AI and trend data.
        </p>

        <PayButton channelId={channelId as string} email={email} />

        <p className="text-sm text-gray-500 mt-6">
          Secure payment powered by Razorpay. Metadata will be delivered to your email after successful payment.
        </p>
      </div>
    </div>
  );
}
