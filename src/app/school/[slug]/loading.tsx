import React from "react";
import { Shimmer } from "@/components/Shimmer";

// Shimmer skeleton for the school detail page while data loads.
const loading = () => (
  <main className="bg-[#eef4fb]">
    <div className="mx-auto w-[90%] max-w-[1280px] py-10">
      <Shimmer className="mb-4 h-6 w-40 rounded-lg" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_0.9fr]">
        <div>
          <Shimmer className="h-72 w-full rounded-3xl" />
          <Shimmer className="mt-6 h-8 w-2/3 rounded-lg" />
          <Shimmer className="mt-3 h-4 w-1/2 rounded" />
          <div className="mt-6 flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Shimmer key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
          <Shimmer className="mt-6 h-40 w-full rounded-2xl" />
          <Shimmer className="mt-4 h-40 w-full rounded-2xl" />
        </div>
        <div>
          <Shimmer className="h-80 w-full rounded-3xl" />
          <Shimmer className="mt-4 h-48 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  </main>
);

export default loading;
