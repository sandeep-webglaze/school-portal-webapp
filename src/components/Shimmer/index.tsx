import React from "react";

// Simple shimmer block — use for any placeholder line/box.
export const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`skeleton rounded-md ${className}`} />
);

// A school-card shaped skeleton (image + title + tags + button).
export const SchoolCardSkeleton = ({ width = "" }: { width?: string }) => (
  <div
    className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-light ${width}`}
  >
    <div className="skeleton h-40 w-full" />
    <div className="space-y-3 p-4">
      <Shimmer className="h-4 w-3/4" />
      <Shimmer className="h-3 w-1/2" />
      <div className="flex gap-2">
        <Shimmer className="h-6 w-16" />
        <Shimmer className="h-6 w-16" />
      </div>
      <Shimmer className="h-9 w-full rounded-lg" />
    </div>
  </div>
);

// A full page grid of card skeletons (used by loading.tsx).
export const SchoolsGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="mx-auto w-[90%] max-w-[1400px] py-12">
    <Shimmer className="mb-6 h-8 w-64 rounded-lg" />
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SchoolCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default Shimmer;
