"use client";
import { useRouter } from "next/navigation";

export default function BackHomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="mt-10 inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
    >
      ← Back to Home
    </button>
  );
}
