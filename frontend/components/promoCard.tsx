"use client";
import React from "react";

interface FeaturedPromoCardProps {
  beforeText: string;
  afterText: string;
  imageSrc?: string;
  views?: string;
  likes?: string;
  subscribers?: string;
  badgeText?: string;
}

export default function FeaturedPromoCard({
  beforeText,
  afterText,
  imageSrc = "/thumbnail.png",
  views = "1.2M",
  likes = "25K",
  subscribers = "98K",
  badgeText = "ReachAI",
}: FeaturedPromoCardProps) {
  return (
    <div className="w-full max-w-[600px] bg-white border border-red-200 rounded-2xl overflow-hidden hover:shadow-sm transition transform hover:-translate-y-0.5 flex flex-row gap-0">

      {/* Thumbnail */}
      <div className="w-2/5 h-32 sm:h-40 md:h-48 flex-shrink-0 relative">
        <img
          src={imageSrc}
          alt="Thumbnail"
          className="w-full h-full object-cover rounded-l-2xl"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between gap-2 sm:gap-3">
        {/* Badge */}
        {badgeText && (
          <span className="text-[10px] sm:text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full w-fit">
            {badgeText}
          </span>
        )}

        {/* Before → After */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-2 flex flex-row items-center justify-between gap-2 text-[12px] sm:text-[13px] font-medium mt-1">
          <span className="text-gray-500 line-through flex-1 text-left">{beforeText}</span>
          <span className="text-red-600 font-bold text-xl">→</span>
          <span className="text-gray-900 font-semibold flex-1 text-right">{afterText}</span>
        </div>

        {/* Stats */}
        <div className="flex gap-2 sm:gap-3 mt-1 text-gray-600 text-[10px] sm:text-xs">
          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 rounded-lg">👍 {likes}</span>
          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 rounded-lg">👁️ {views}</span>
          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 rounded-lg">🎯 {subscribers}</span>
        </div>
      </div>
    </div>
  );
}
