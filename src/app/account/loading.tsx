import React from "react";
import { Shimmer } from "@/components/Shimmer";

const loading = () => (
  <div className="mx-auto w-full max-w-[900px] space-y-4 p-6">
    <Shimmer className="h-8 w-48 rounded-lg" />
    <Shimmer className="h-40 w-full rounded-2xl" />
    <Shimmer className="h-24 w-full rounded-2xl" />
    <Shimmer className="h-24 w-full rounded-2xl" />
  </div>
);

export default loading;
