import { schoolCategories } from "@/_mocks_/schoolData";
import React from "react";
import { SchoolCategoryCard } from "./schoolCategoryCard";

export const TopSearchesSection: React.FC = () => {
  return (
    <section className=" bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-800 mb-4">
            &quot;Top Searches for you!!&quot;
          </h3>
          <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 h-fit">
          {schoolCategories.map((category, index) => (
            <SchoolCategoryCard key={index} category={category} />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-green-700 text-lg max-w-2xl mx-auto">
            Discover the best educational institutions across India. From
            top-rated schools to specialized boarding facilities, find the
            perfect learning environment for your child.
          </p>
        </div>
      </div>
    </section>
  );
};
