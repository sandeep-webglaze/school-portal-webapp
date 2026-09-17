import { SchoolCategory } from "@/_mocks_/schoolData";
import Link from "next/link";
import React from "react";

interface SchoolCategoryCardProps {
  category: SchoolCategory;
}

export const SchoolCategoryCard: React.FC<SchoolCategoryCardProps> = ({
  category,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-2  h-fit">
      <h4 className="text-lg font-semibold text-green-800 mb-2 text-center border-b border-green-200 pb-3">
        {category.title}
      </h4>
      <div className="space-y-2 h-fit w-fit text-center mx-auto">
        {category.items.map((item, index) => (
          <Link
            key={index}
            href={item.url}
            className="block text-green-700 text-center tracking-wide hover:text-green-900 hover:bg-green-50 px-3 py-1 rounded-lg transition-all duration-200 text-sm font-medium hover:translate-x-1"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
