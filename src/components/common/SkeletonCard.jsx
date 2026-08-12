import React from 'react';

export function SkeletonCard() {
  return (
    <div className="relative glass-card rounded-3xl p-5 border border-white/5 flex flex-col justify-between h-[360px] overflow-hidden">
      {/* Animated Shimmer Overlay */}
      <div className="absolute inset-0 shimmer-mask pointer-events-none z-10" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 w-14 bg-slate-800/80 rounded-md animate-pulse" />
        <div className="flex gap-1.5">
          <div className="w-8 h-8 rounded-full bg-slate-800/80 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-slate-800/80 animate-pulse" />
        </div>
      </div>

      {/* Center Circle Image Placeholder */}
      <div className="w-32 h-32 mx-auto rounded-full bg-slate-800/60 my-2 flex items-center justify-center animate-pulse">
        <div className="w-24 h-24 rounded-full bg-slate-700/40" />
      </div>

      {/* Bottom Info */}
      <div className="space-y-3 mt-auto">
        <div className="h-6 w-2/3 bg-slate-800/80 rounded-md mx-auto animate-pulse" />
        <div className="flex justify-center gap-2">
          <div className="h-6 w-16 bg-slate-800/80 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-slate-800/80 rounded-full animate-pulse" />
        </div>
        <div className="pt-2 border-t border-white/5 flex justify-between">
          <div className="h-3 w-16 bg-slate-800/60 rounded" />
          <div className="h-3 w-12 bg-slate-800/60 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SkeletonCard;

